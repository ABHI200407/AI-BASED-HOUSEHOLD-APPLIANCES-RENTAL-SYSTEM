from mongoengine import Document, ReferenceField, StringField, DateTimeField
from datetime import datetime
from bookings.models import Booking

class Installation(Document):
    booking_id = ReferenceField(Booking, required=True)
    technician_name = StringField(default='')
    scheduled_date = DateTimeField(required=True)
    status = StringField(
        choices=('scheduled', 'in_progress', 'completed', 'cancelled'),
        default='scheduled'
    )
    notes = StringField(default='')
    completed_at = DateTimeField()
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'installations'
    }
