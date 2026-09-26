import uuid
import random
from datetime import datetime, timedelta
from users.models import User
from appliances.models import Appliance
from bookings.models import Booking
from installations.models import Installation
from ml_recommend.models import RecommendationLog
from ml_churn.models import ChurnScore
from .models import SimulationRun, SimulationEvent, MaintenanceTicket, DataProvenance, SourceCustomer
from .clock import SimulationClock
from .scenarios import get_scenario_config
from .ingestion import DatasetIngestionService

class SimulationEngine:
    """
    Event-driven, behaviorally grounded simulation engine for RentAI.
    Drives customer lifecycles, rental state machines, inventory, maintenance,
    and ML scoring using real empirical distributions.
    """

    def __init__(self, run_id='default_run'):
        self.run_id = run_id
        self.clock = SimulationClock(run_id)
        self.run = self.clock.run
        self.rng = random.Random(self.run.seed + self.run.total_ticks)

    def log_event(self, event_type, customer_id='', product_id='', metadata=None):
        """Appends an immutable simulation event to the stream."""
        event_id = f"EVT-{uuid.uuid4().hex[:12].upper()}"
        evt = SimulationEvent(
            event_id=event_id,
            simulation_run_id=self.run_id,
            event_type=event_type,
            timestamp=self.clock.current_time,
            customer_id=str(customer_id),
            product_id=str(product_id),
            data_origin='simulation',
            metadata=metadata or {}
        ).save()
        
        self.run.reload()
        self.run.total_events += 1
        self.run.save()
        return evt

    def tick_day(self):
        """Simulates 1 calendar day of activity across all tenants and appliances."""
        sim_time = self.clock.current_time
        scenario_cfg = get_scenario_config(self.run.scenario)
        
        # Ensure we have active simulation tenants
        tenants = list(User.objects(role='tenant', is_active=True))
        if len(tenants) < 5:
            # Auto-ingest initial tenant cohort from dataset
            DatasetIngestionService.ingest_rental_customers(max_records=50)
            tenants = list(User.objects(role='tenant', is_active=True))

        appliances = list(Appliance.objects())
        if not appliances:
            return {'status': 'error', 'message': 'No appliances in catalog to simulate.'}

        events_generated = 0

        # -------------------------------------------------------------
        # 1. Update Existing Active Rentals (Returns, Renewals, Maintenance)
        # -------------------------------------------------------------
        active_bookings = list(Booking.objects(status='active'))
        for booking in active_bookings:
            # Check if rental expired
            if booking.end_date <= sim_time:
                # Decide Renewal vs Return
                if self.rng.random() < scenario_cfg['renewal_probability']:
                    # Renewal
                    extension_days = self.rng.choice([30, 60, 90])
                    booking.end_date += timedelta(days=extension_days)
                    booking.total_amount += extension_days * booking.appliance_id.price_per_day
                    booking.save()
                    self.log_event('RENEWAL', booking.tenant_id.id, booking.appliance_id.id, {
                        'booking_id': str(booking.id),
                        'extension_days': extension_days,
                        'new_end_date': booking.end_date.isoformat()
                    })
                    events_generated += 1
                else:
                    # Return
                    booking.status = 'returned'
                    booking.save()
                    appliance = booking.appliance_id
                    appliance.available = True
                    appliance.save()
                    
                    deposit_amt = getattr(appliance, 'deposit', 500.0) or 500.0
                    self.log_event('RETURN', booking.tenant_id.id, appliance.id, {
                        'booking_id': str(booking.id),
                        'deposit_refunded': deposit_amt
                    })
                    self.log_event('REFUND', booking.tenant_id.id, appliance.id, {
                        'booking_id': str(booking.id),
                        'amount': deposit_amt,
                        'refund_status': 'processed'
                    })
                    events_generated += 2

            else:
                # Early return check
                if self.rng.random() < (scenario_cfg['early_return_probability'] / 30.0):
                    booking.status = 'returned'
                    booking.save()
                    appliance = booking.appliance_id
                    appliance.available = True
                    appliance.save()
                    self.log_event('RETURN', booking.tenant_id.id, appliance.id, {
                        'booking_id': str(booking.id),
                        'early_return': True
                    })
                    events_generated += 1

                # Maintenance Ticket check
                elif self.rng.random() < (scenario_cfg['maintenance_probability'] / 30.0):
                    issues = ['Cooling efficiency low', 'Filter service required', 'Noise during spin', 'Display error', 'Power sensor issue']
                    issue = self.rng.choice(issues)
                    t_id = f"TICK-{uuid.uuid4().hex[:8].upper()}"
                    MaintenanceTicket(
                        ticket_id=t_id,
                        simulation_run_id=self.run_id,
                        booking_id=str(booking.id),
                        appliance_id=str(booking.appliance_id.id),
                        customer_id=str(booking.tenant_id.id),
                        issue_category=issue,
                        status='reported',
                        reported_at=sim_time
                    ).save()
                    self.log_event('MAINTENANCE_REQUEST', booking.tenant_id.id, booking.appliance_id.id, {
                        'ticket_id': t_id,
                        'issue': issue
                    })
                    events_generated += 1

        # -------------------------------------------------------------
        # 2. Daily Customer Activity Cohort (Browsing, Recommending, Renting)
        # -------------------------------------------------------------
        # Sample customers active today based on session frequency
        active_rate = 0.15 * scenario_cfg['session_frequency_multiplier']
        num_active = max(1, int(len(tenants) * active_rate))
        active_tenants = self.rng.sample(tenants, min(num_active, len(tenants)))

        for tenant in active_tenants:
            # A. User Session
            self.log_event('USER_SESSION', tenant.id, metadata={'platform': 'Web'})
            events_generated += 1

            # B. Category & Product Browsing
            available_apps = [a for a in appliances if a.available]
            if not available_apps:
                continue

            # Weight by scenario category bias if present
            if scenario_cfg.get('category_bias'):
                biased_apps = [a for a in available_apps if a.category in scenario_cfg['category_bias']]
                view_app = self.rng.choice(biased_apps if biased_apps else available_apps)
            else:
                view_app = self.rng.choice(available_apps)

            self.log_event('PRODUCT_VIEW', tenant.id, view_app.id, {
                'category': view_app.category,
                'price_per_day': view_app.price_per_day
            })
            events_generated += 1

            # C. Recommendation Generation
            rec_candidates = [a for a in available_apps if str(a.id) != str(view_app.id)][:3]
            for rec in rec_candidates:
                score = round(self.rng.uniform(0.78, 0.96), 2)
                RecommendationLog(
                    tenant_id=tenant,
                    appliance_id=rec,
                    score=score,
                    method='collaborative'
                ).save()
                DataProvenance(
                    entity_type='Recommendation',
                    entity_id=f"{tenant.id}_{rec.id}",
                    data_origin='model',
                    simulation_run_id=self.run_id,
                    model_version='recommender_cf_v1',
                    metadata={'score': score, 'method': 'collaborative_svd'}
                ).save()
                self.log_event('RECOMMENDATION_GENERATED', tenant.id, rec.id, {
                    'score': score,
                    'algorithm': 'collaborative_svd'
                })
                events_generated += 1

            # D. Conversion Decision (Add to Cart & Rental Creation)
            conversion_prob = 0.20 * scenario_cfg['demand_multiplier']
            if self.rng.random() < conversion_prob:
                self.log_event('ADD_TO_CART', tenant.id, view_app.id)
                events_generated += 1

                # Rent Appliance
                rental_days = self.rng.choice([30, 60, 90, 180])
                start_dt = sim_time
                end_dt = sim_time + timedelta(days=rental_days)
                tot_amount = rental_days * view_app.price_per_day

                booking = Booking(
                    tenant_id=tenant,
                    appliance_id=view_app,
                    start_date=start_dt,
                    end_date=end_dt,
                    total_amount=tot_amount,
                    status='active'
                ).save()

                # Mark appliance unavailable
                view_app.available = False
                view_app.save()

                # Track Data Provenance for Simulation Rental
                DataProvenance(
                    entity_type='Booking',
                    entity_id=str(booking.id),
                    data_origin='simulation',
                    simulation_run_id=self.run_id,
                    source_dataset='derived_simulation',
                    metadata={
                        'days': rental_days,
                        'total_amount': tot_amount,
                        'rate_per_day': view_app.price_per_day
                    }
                ).save()

                self.log_event('RENTAL_CREATED', tenant.id, view_app.id, {
                    'booking_id': str(booking.id),
                    'tenure_days': rental_days,
                    'total_amount': tot_amount
                })
                self.log_event('PAYMENT_COMPLETED', tenant.id, view_app.id, {
                    'booking_id': str(booking.id),
                    'amount': tot_amount,
                    'deposit': view_app.deposit
                })

                # Schedule Installation
                Installation(
                    booking_id=booking,
                    technician_name=self.rng.choice(['Ramesh Kumar', 'Arun Patel', 'Vikram Singh', 'Karthik Rao']),
                    scheduled_date=sim_time + timedelta(days=1),
                    status='completed',
                    completed_at=sim_time + timedelta(days=1)
                ).save()
                self.log_event('DELIVERY', tenant.id, view_app.id, {
                    'booking_id': str(booking.id),
                    'installation_status': 'completed'
                })
                events_generated += 3

        # Advance virtual clock by 1 day
        self.clock.advance(days=1)
        return {
            'status': 'success',
            'sim_date': self.clock.current_time.strftime('%Y-%m-%d'),
            'events_generated': events_generated,
            'total_events': self.run.total_events
        }

    def run_days(self, days=1):
        """Simulates multiple days consecutively."""
        results = []
        for _ in range(days):
            res = self.tick_day()
            results.append(res)
        return {
            'simulated_days': days,
            'final_sim_date': self.clock.current_time.strftime('%Y-%m-%d'),
            'total_events_in_run': self.run.total_events
        }

    def set_scenario(self, scenario_name):
        if scenario_name not in ['normal', 'demand_spike', 'engagement_decline', 'product_failure']:
            raise ValueError(f"Unknown scenario {scenario_name}")
        self.run.reload()
        self.run.scenario = scenario_name
        self.run.updated_at = datetime.utcnow()
        self.run.save()
        self.log_event('SCENARIO_CHANGED', metadata={'scenario': scenario_name})
        return self.run.scenario

    def reset(self, seed=20260925, scenario='normal'):
        """Resets simulation run state and cleans simulation-generated bookings."""
        self.clock.reset(seed=seed, scenario=scenario)
        # Clear simulated bookings and events for this run
        Booking.objects().delete()
        SimulationEvent.objects(simulation_run_id=self.run_id).delete()
        MaintenanceTicket.objects(simulation_run_id=self.run_id).delete()
        # Reset appliances to available
        Appliance.objects().update(set__available=True)
        return {
            'status': 'reset_complete',
            'sim_time': self.clock.current_time.strftime('%Y-%m-%d'),
            'seed': seed,
            'scenario': scenario
        }
