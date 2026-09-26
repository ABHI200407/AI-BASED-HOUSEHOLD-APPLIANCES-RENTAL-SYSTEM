from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from users.models import User
from appliances.models import Appliance
from bookings.models import Booking
from .models import SimulationRun, SimulationEvent, MaintenanceTicket, DataProvenance
from .engine import SimulationEngine
from .clock import SimulationClock

class SimulationStateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        engine = SimulationEngine()
        run = engine.run
        run.reload()

        total_customers = User.objects(role='tenant').count()
        total_appliances = Appliance.objects().count()
        available_appliances = Appliance.objects(available=True).count()
        active_rentals = Booking.objects(status='active').count()
        completed_returns = Booking.objects(status='returned').count()
        total_revenue = sum([b.total_amount for b in Booking.objects() if b.total_amount])
        maintenance_active = MaintenanceTicket.objects(status__in=['reported', 'in_progress']).count()

        return Response({
            'simulation_run_id': run.simulation_run_id,
            'status': run.status,
            'scenario': run.scenario,
            'current_sim_time': run.current_sim_time.strftime('%Y-%m-%d %H:%M:%S'),
            'seed': run.seed,
            'speed': f"{run.speed}x",
            'total_ticks': run.total_ticks,
            'total_events': run.total_events,
            'metrics': {
                'total_customers': total_customers,
                'total_appliances': total_appliances,
                'available_appliances': available_appliances,
                'active_rentals': active_rentals,
                'completed_returns': completed_returns,
                'total_revenue': round(total_revenue, 2),
                'active_maintenance_tickets': maintenance_active
            }
        }, status=status.HTTP_200_OK)


class SimulationAdvanceView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        days = int(request.data.get('days', 1))
        engine = SimulationEngine()
        result = engine.run_days(days=days)
        return Response(result, status=status.HTTP_200_OK)


class SimulationScenarioView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        scenario = request.data.get('scenario', 'normal')
        engine = SimulationEngine()
        try:
            active_scenario = engine.set_scenario(scenario)
            return Response({'status': 'scenario_updated', 'scenario': active_scenario}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SimulationResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        seed = int(request.data.get('seed', 20260925))
        scenario = request.data.get('scenario', 'normal')
        engine = SimulationEngine()
        res = engine.reset(seed=seed, scenario=scenario)
        return Response(res, status=status.HTTP_200_OK)


class SimulationEventsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        limit = int(request.query_params.get('limit', 50))
        event_type = request.query_params.get('event_type')
        
        query = {}
        if event_type:
            query['event_type'] = event_type
            
        events = SimulationEvent.objects(**query).order_by('-timestamp').limit(limit)
        data = []
        for e in events:
            data.append({
                'event_id': e.event_id,
                'event_type': e.event_type,
                'timestamp': e.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'customer_id': e.customer_id,
                'product_id': e.product_id,
                'data_origin': e.data_origin,
                'metadata': e.metadata
            })
        return Response({'total': len(data), 'events': data}, status=status.HTTP_200_OK)


class DataProvenanceDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, entity_type, entity_id):
        prov = DataProvenance.objects(entity_type__iexact=entity_type, entity_id=str(entity_id)).first()
        if not prov:
            return Response({
                'entity_type': entity_type,
                'entity_id': entity_id,
                'data_origin': 'derived_simulation',
                'provenance': 'Record was generated dynamically during runtime execution.'
            }, status=status.HTTP_200_OK)

        return Response({
            'entity_type': prov.entity_type,
            'entity_id': prov.entity_id,
            'data_origin': prov.data_origin,
            'source_dataset': prov.source_dataset,
            'source_record_id': prov.source_record_id,
            'simulation_run_id': prov.simulation_run_id,
            'model_version': prov.model_version,
            'created_at': prov.created_at.isoformat(),
            'metadata': prov.metadata
        }, status=status.HTTP_200_OK)
