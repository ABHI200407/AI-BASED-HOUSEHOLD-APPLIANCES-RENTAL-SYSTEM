"""
Seed script to populate the database with sample data.
Run: python seed_data.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rental.models import Category, Appliance, Customer, Booking
from datetime import date, timedelta
import random

print("Seeding database...")

# Clear existing data
Booking.objects.all().delete()
Appliance.objects.all().delete()
Category.objects.all().delete()
Customer.objects.all().delete()

# Create categories
categories_data = [
    {'name': 'Kitchen Appliances', 'icon': '🍳', 'description': 'Refrigerators, microwaves, ovens and more'},
    {'name': 'Washing & Cleaning', 'icon': '🧺', 'description': 'Washing machines, dryers, vacuum cleaners'},
    {'name': 'Air & Climate', 'icon': '❄️', 'description': 'Air conditioners, fans, air purifiers'},
    {'name': 'Entertainment', 'icon': '📺', 'description': 'TVs, projectors, sound systems'},
    {'name': 'Computing', 'icon': '💻', 'description': 'Laptops, desktops, printers'},
    {'name': 'Small Appliances', 'icon': '☕', 'description': 'Coffee makers, blenders, toasters'},
]

categories = []
for c in categories_data:
    cat = Category.objects.create(**c)
    categories.append(cat)
    print(f"  Created category: {cat.name}")

# Create appliances
appliances_data = [
    # Kitchen
    {'name': 'Double Door Refrigerator', 'brand': 'Samsung', 'category': categories[0], 'daily_rent': 150, 'weekly_rent': 900, 'monthly_rent': 3200, 'deposit': 5000, 'rating': 4.8, 'reviews_count': 124, 'description': 'Energy-efficient 350L double door refrigerator with inverter technology and smart cooling system.'},
    {'name': 'Convection Microwave Oven', 'brand': 'LG', 'category': categories[0], 'daily_rent': 80, 'weekly_rent': 500, 'monthly_rent': 1800, 'deposit': 3000, 'rating': 4.6, 'reviews_count': 89, 'description': '32L convection microwave with auto-cook menus, steam cleaning and child lock.'},
    {'name': 'Dishwasher', 'brand': 'Bosch', 'category': categories[0], 'daily_rent': 120, 'weekly_rent': 750, 'monthly_rent': 2600, 'deposit': 4000, 'rating': 4.7, 'reviews_count': 67, 'description': '12-place setting dishwasher with 5 programs and half-load option.'},
    # Washing
    {'name': 'Front Load Washing Machine', 'brand': 'Whirlpool', 'category': categories[1], 'daily_rent': 100, 'weekly_rent': 650, 'monthly_rent': 2400, 'deposit': 4000, 'status': 'rented', 'rating': 4.5, 'reviews_count': 201, 'description': '7kg front-load washing machine with 16 wash programs and in-built heater.'},
    {'name': 'Dryer Machine', 'brand': 'Haier', 'category': categories[1], 'daily_rent': 90, 'weekly_rent': 580, 'monthly_rent': 2100, 'deposit': 3500, 'rating': 4.4, 'reviews_count': 55, 'description': '6kg tumble dryer with sensor drying and anti-crease function.'},
    {'name': 'Robot Vacuum Cleaner', 'brand': 'Roborock', 'category': categories[1], 'daily_rent': 70, 'weekly_rent': 430, 'monthly_rent': 1600, 'deposit': 2500, 'rating': 4.9, 'reviews_count': 312, 'description': 'Smart robot vacuum with laser navigation, auto-emptying and app control.'},
    # Air
    {'name': '1.5 Ton Split AC', 'brand': 'Daikin', 'category': categories[2], 'daily_rent': 180, 'weekly_rent': 1100, 'monthly_rent': 4000, 'deposit': 6000, 'status': 'rented', 'rating': 4.8, 'reviews_count': 445, 'description': '5-star rated inverter split AC with PM 2.5 filter and self-cleaning coil.'},
    {'name': 'Air Purifier', 'brand': 'Dyson', 'category': categories[2], 'daily_rent': 100, 'weekly_rent': 620, 'monthly_rent': 2200, 'deposit': 3500, 'rating': 4.7, 'reviews_count': 178, 'description': 'HEPA + activated carbon filtration with real-time air quality monitoring.'},
    {'name': 'Tower Fan', 'brand': 'Orient', 'category': categories[2], 'daily_rent': 40, 'weekly_rent': 240, 'monthly_rent': 900, 'deposit': 1500, 'rating': 4.3, 'reviews_count': 93, 'description': '3-speed tower fan with oscillation, timer and remote control.'},
    # Entertainment
    {'name': '55" 4K Smart TV', 'brand': 'Sony', 'category': categories[3], 'daily_rent': 200, 'weekly_rent': 1250, 'monthly_rent': 4500, 'deposit': 7000, 'rating': 4.9, 'reviews_count': 567, 'description': 'OLED 4K Smart TV with Google TV, Dolby Vision and Dolby Atmos.'},
    {'name': 'Home Theatre System', 'brand': 'Bose', 'category': categories[3], 'daily_rent': 150, 'weekly_rent': 950, 'monthly_rent': 3500, 'deposit': 5000, 'status': 'rented', 'rating': 4.8, 'reviews_count': 234, 'description': '5.1 surround sound system with wireless rear speakers and HDMI ARC.'},
    {'name': '4K Projector', 'brand': 'Epson', 'category': categories[3], 'daily_rent': 250, 'weekly_rent': 1600, 'monthly_rent': 5800, 'deposit': 8000, 'rating': 4.6, 'reviews_count': 112, 'description': 'Native 4K laser projector with 4000 lumens, 100" screen included.'},
    # Computing
    {'name': 'MacBook Pro 14"', 'brand': 'Apple', 'category': categories[4], 'daily_rent': 350, 'weekly_rent': 2200, 'monthly_rent': 8000, 'deposit': 12000, 'rating': 4.9, 'reviews_count': 389, 'description': 'M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals and creators.'},
    {'name': 'Gaming Laptop', 'brand': 'ASUS ROG', 'category': categories[4], 'daily_rent': 300, 'weekly_rent': 1900, 'monthly_rent': 6800, 'deposit': 10000, 'status': 'rented', 'rating': 4.7, 'reviews_count': 278, 'description': 'RTX 4070, Intel i9, 32GB RAM, 1TB SSD with 165Hz display.'},
    # Small
    {'name': 'Espresso Machine', 'brand': 'De\'Longhi', 'category': categories[5], 'daily_rent': 60, 'weekly_rent': 380, 'monthly_rent': 1400, 'deposit': 2000, 'rating': 4.8, 'reviews_count': 156, 'description': 'Fully automatic espresso machine with built-in grinder and milk frother.'},
    {'name': 'Stand Mixer', 'brand': 'KitchenAid', 'category': categories[5], 'daily_rent': 50, 'weekly_rent': 310, 'monthly_rent': 1100, 'deposit': 1800, 'rating': 4.9, 'reviews_count': 223, 'description': '5-quart stand mixer with 10 speeds and dough hook, whisk and flat beater.'},
]

appliances = []
for a in appliances_data:
    app = Appliance.objects.create(**a)
    appliances.append(app)
    print(f"  Created appliance: {app.name}")

# Create customers
customers_data = [
    {'name': 'Arjun Mehta', 'email': 'arjun.mehta@gmail.com', 'phone': '9876543210', 'address': '12, Banjara Hills, Hyderabad - 500034'},
    {'name': 'Priya Sharma', 'email': 'priya.sharma@yahoo.com', 'phone': '9988776655', 'address': '45, Indiranagar, Bengaluru - 560038'},
    {'name': 'Ravi Kumar', 'email': 'ravi.k@outlook.com', 'phone': '9871234567', 'address': '78, Anna Nagar, Chennai - 600040'},
    {'name': 'Sneha Reddy', 'email': 'sneha.reddy@gmail.com', 'phone': '9900112233', 'address': '23, Jubilee Hills, Hyderabad - 500033'},
    {'name': 'Vikram Singh', 'email': 'vikram.s@gmail.com', 'phone': '9823456789', 'address': '56, Connaught Place, New Delhi - 110001'},
]

customers = []
for c in customers_data:
    cust = Customer.objects.create(**c)
    customers.append(cust)
    print(f"  Created customer: {cust.name}")

# Create bookings
today = date.today()
bookings_data = [
    {'customer': customers[0], 'appliance': appliances[0], 'start_date': today - timedelta(days=5), 'end_date': today + timedelta(days=25), 'total_amount': 3200, 'deposit_paid': 5000, 'status': 'active', 'payment_status': 'paid'},
    {'customer': customers[1], 'appliance': appliances[6], 'start_date': today - timedelta(days=2), 'end_date': today + timedelta(days=28), 'total_amount': 4000, 'deposit_paid': 6000, 'status': 'active', 'payment_status': 'paid'},
    {'customer': customers[2], 'appliance': appliances[10], 'start_date': today + timedelta(days=3), 'end_date': today + timedelta(days=33), 'total_amount': 3500, 'deposit_paid': 5000, 'status': 'confirmed', 'payment_status': 'paid'},
    {'customer': customers[3], 'appliance': appliances[13], 'start_date': today - timedelta(days=10), 'end_date': today + timedelta(days=20), 'total_amount': 6800, 'deposit_paid': 10000, 'status': 'active', 'payment_status': 'paid'},
    {'customer': customers[4], 'appliance': appliances[3], 'start_date': today - timedelta(days=30), 'end_date': today - timedelta(days=2), 'total_amount': 2400, 'deposit_paid': 4000, 'status': 'completed', 'payment_status': 'paid'},
    {'customer': customers[0], 'appliance': appliances[9], 'start_date': today + timedelta(days=7), 'end_date': today + timedelta(days=37), 'total_amount': 4500, 'deposit_paid': 0, 'status': 'pending', 'payment_status': 'unpaid'},
]

for b in bookings_data:
    booking = Booking.objects.create(**b)
    print(f"  Created booking #{booking.id}: {booking.customer.name} -> {booking.appliance.name}")

print("\n✅ Database seeded successfully!")
print(f"   Categories: {Category.objects.count()}")
print(f"   Appliances: {Appliance.objects.count()}")
print(f"   Customers:  {Customer.objects.count()}")
print(f"   Bookings:   {Booking.objects.count()}")
