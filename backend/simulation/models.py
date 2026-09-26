from mongoengine import (
    Document, StringField, FloatField, IntField, BooleanField, 
    DateTimeField, DictField, ReferenceField, ListField
)
from datetime import datetime

class DataProvenance(Document):
    """Tracks origin and lineage for any system record."""
    entity_type = StringField(required=True)  # 'Customer', 'Product', 'Booking', 'Recommendation', 'ChurnPrediction'
    entity_id = StringField(required=True)
    data_origin = StringField(choices=('source', 'application', 'simulation', 'model', 'derived'), required=True)
    source_dataset = StringField(default='')
    source_record_id = StringField(default='')
    simulation_run_id = StringField(default='')
    model_version = StringField(default='')
    created_at = DateTimeField(default=datetime.utcnow)
    metadata = DictField(default=dict)

    meta = {
        'collection': 'data_provenance',
        'indexes': ['entity_type', 'entity_id', 'data_origin', 'simulation_run_id']
    }


class SourceCustomer(Document):
    """Layer 1: Immutable customer records imported from real datasets."""
    source_dataset = StringField(required=True)
    source_customer_id = StringField(required=True)
    tenure_months = FloatField(default=0.0)
    monthly_spend = FloatField(default=0.0)
    active_rentals = IntField(default=0)
    late_payments = IntField(default=0)
    early_returns = IntField(default=0)
    cart_abandonment = FloatField(default=0.0)
    days_inactive = FloatField(default=0.0)
    avg_rating = FloatField(default=0.0)
    observed_churn = IntField(default=0)
    imported_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'source_customers',
        'indexes': ['source_dataset', 'source_customer_id']
    }


class SourceInteraction(Document):
    """Layer 1: Immutable user-item interactions imported from real recommendation datasets."""
    source_dataset = StringField(required=True)
    user_id = StringField(required=True)
    item_id = StringField(required=True)
    category = StringField(default='')
    rating = FloatField(default=0.0)
    price = FloatField(default=0.0)
    location = StringField(default='')
    platform = StringField(default='')
    imported_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'source_interactions',
        'indexes': ['user_id', 'item_id', 'category']
    }


class SimulationRun(Document):
    """State metadata for a reproducible simulation session."""
    simulation_run_id = StringField(unique=True, required=True)
    seed = IntField(default=20260925)
    status = StringField(choices=('idle', 'running', 'paused', 'completed'), default='idle')
    scenario = StringField(choices=('normal', 'demand_spike', 'engagement_decline', 'product_failure'), default='normal')
    start_sim_time = DateTimeField(default=datetime.utcnow)
    current_sim_time = DateTimeField(default=datetime.utcnow)
    speed = IntField(default=1)  # 1x, 10x, etc.
    total_ticks = IntField(default=0)
    total_events = IntField(default=0)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'simulation_runs',
        'indexes': ['simulation_run_id', 'status']
    }


class SimulationEvent(Document):
    """Layer 3: Append-only simulation event stream."""
    event_id = StringField(unique=True, required=True)
    simulation_run_id = StringField(required=True)
    event_type = StringField(required=True)
    timestamp = DateTimeField(required=True)
    customer_id = StringField(default='')
    product_id = StringField(default='')
    data_origin = StringField(default='simulation')
    metadata = DictField(default=dict)

    meta = {
        'collection': 'simulation_events',
        'indexes': ['simulation_run_id', 'event_type', 'timestamp', 'customer_id', 'product_id']
    }


class MaintenanceTicket(Document):
    """Layer 3: Appliance maintenance incidents occurring during rental lifecycle."""
    ticket_id = StringField(unique=True, required=True)
    simulation_run_id = StringField(default='')
    booking_id = StringField(required=True)
    appliance_id = StringField(required=True)
    customer_id = StringField(required=True)
    issue_category = StringField(default='Performance Issue')
    status = StringField(choices=('reported', 'technician_assigned', 'in_progress', 'resolved'), default='reported')
    reported_at = DateTimeField(default=datetime.utcnow)
    resolved_at = DateTimeField()
    resolution_notes = StringField(default='')
    data_origin = StringField(default='simulation')

    meta = {
        'collection': 'maintenance_tickets',
        'indexes': ['booking_id', 'appliance_id', 'customer_id', 'status']
    }
