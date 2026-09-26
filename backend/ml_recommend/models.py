from mongoengine import Document, ReferenceField, FloatField, StringField, DateTimeField
from datetime import datetime
from users.models import User
from appliances.models import Appliance

class RecommendationLog(Document):
    tenant_id = ReferenceField(User, required=True)
    appliance_id = ReferenceField(Appliance, required=True)
    score = FloatField()
    method = StringField(choices=('content_based', 'collaborative', 'hybrid'), default='collaborative')
    generated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'recommendation_logs'
    }
