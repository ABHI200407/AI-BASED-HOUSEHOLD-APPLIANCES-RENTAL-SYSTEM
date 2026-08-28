from mongoengine import Document, StringField, DateTimeField, BooleanField
from datetime import datetime
from django.contrib.auth.hashers import make_password, check_password

class User(Document):
    email = StringField(unique=True, required=True)
    password = StringField(required=True)
    full_name = StringField()
    role = StringField(choices=('admin', 'owner', 'tenant'), required=True)
    phone = StringField()
    address = StringField()
    is_active = BooleanField(default=True)
    date_joined = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'users',
        'indexes': ['email']
    }

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
