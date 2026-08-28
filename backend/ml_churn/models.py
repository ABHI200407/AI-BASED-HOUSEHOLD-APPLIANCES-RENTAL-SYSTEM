from mongoengine import Document, ReferenceField, FloatField, StringField, IntField, DateTimeField
from datetime import datetime
from users.models import User

class ChurnScore(Document):
    tenant_id = ReferenceField(User, required=True)
    risk_score = FloatField(min_value=0, max_value=1)
    risk_level = StringField(choices=('Low', 'Medium', 'High'))
    recency_days = IntField()
    frequency_count = IntField()
    monetary_total = FloatField()
    calculated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'churn_scores'
    }
