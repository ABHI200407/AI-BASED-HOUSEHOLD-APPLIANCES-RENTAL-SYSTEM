from django.contrib import admin
from .models import Category, Appliance, Customer, Booking


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'description']


@admin.register(Appliance)
class ApplianceAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'category', 'daily_rent', 'status']
    list_filter = ['status', 'category']
    search_fields = ['name', 'brand']


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'created_at']
    search_fields = ['name', 'email']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'appliance', 'start_date', 'end_date', 'status', 'payment_status', 'total_amount']
    list_filter = ['status', 'payment_status']
