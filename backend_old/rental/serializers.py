from rest_framework import serializers
from .models import Category, Appliance, Customer, Booking


class CategorySerializer(serializers.ModelSerializer):
    appliance_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_appliance_count(self, obj):
        return obj.appliances.count()


class ApplianceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Appliance
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    booking_count = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = '__all__'

    def get_booking_count(self, obj):
        return obj.bookings.count()


class BookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    appliance_name = serializers.CharField(source='appliance.name', read_only=True)
    appliance_brand = serializers.CharField(source='appliance.brand', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
