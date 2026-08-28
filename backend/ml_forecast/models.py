from mongoengine import Document, FloatField, StringField, DateTimeField
from datetime import datetime

class DemandForecast(Document):
    category = StringField(required=True)
    forecast_date = DateTimeField(required=True)
    predicted_units = FloatField(required=True)
    model_version = StringField()
    generated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'demand_forecasts'
    }
