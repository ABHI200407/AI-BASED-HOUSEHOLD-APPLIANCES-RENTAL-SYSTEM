from mongoengine import Document, ReferenceField, DateTimeField, StringField, FloatField
from datetime import datetime
from users.models import User
from appliances.models import Appliance

class Booking(Document):
    tenant_id = ReferenceField(User, required=True)
    appliance_id = ReferenceField(Appliance, required=True)
    start_date = DateTimeField(required=True)
    end_date = DateTimeField(required=True)
    status = StringField(choices=('requested', 'approved', 'active', 'returned', 'cancelled'), default='requested')
    total_amount = FloatField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'bookings'
    }
