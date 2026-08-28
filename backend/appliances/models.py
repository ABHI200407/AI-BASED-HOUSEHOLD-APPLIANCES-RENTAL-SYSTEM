from mongoengine import Document, StringField, FloatField, BooleanField, DateTimeField, ListField, ReferenceField
from datetime import datetime
from users.models import User

class Appliance(Document):
    owner_id = ReferenceField(User, required=True)
    name = StringField(required=True)
    brand = StringField(default="")
    category = StringField(required=True)
    description = StringField()
    price_per_day = FloatField(required=True)
    monthly_rent = FloatField(default=0.0)
    weekly_rent = FloatField(default=0.0)
    deposit = FloatField(default=0.0)
    images = ListField(StringField())  # Store local file paths
    image_url = StringField(default="") # Store external URL for storefront
    rating = FloatField(default=4.5)
    reviews_count = FloatField(default=0)
    location = StringField()
    available = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'appliances'
    }
