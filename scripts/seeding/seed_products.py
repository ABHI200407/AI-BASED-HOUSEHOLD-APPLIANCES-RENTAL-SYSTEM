import os
import django
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User
from appliances.models import Appliance

def run():
    print("Finding or creating an owner user...")
    owner = User.objects(role='owner').first()
    if not owner:
        print("No owner found, creating one...")
        owner = User(
            email='admin_owner@rentai.com',
            full_name='System Owner',
            password='password123',
            role='owner'
        )
        owner.save()

    print("Adding sample products...")
    sample_products = [
        {
            "name": "Minimalist Sofa",
            "brand": "IKEA",
            "category": "Furniture",
            "description": "A comfortable 3-seater minimalist sofa perfect for modern living rooms.",
            "price_per_day": 5.0,
            "monthly_rent": 120.0,
            "weekly_rent": 30.0,
            "deposit": 50.0,
            "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
            "rating": 4.8,
            "reviews_count": 124,
            "location": "Hyderabad",
        },
        {
            "name": "Smart 4K TV",
            "brand": "Samsung",
            "category": "Electronics",
            "description": "55-inch Smart 4K UHD TV with built-in streaming apps.",
            "price_per_day": 8.0,
            "monthly_rent": 150.0,
            "weekly_rent": 45.0,
            "deposit": 100.0,
            "image_url": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
            "rating": 4.9,
            "reviews_count": 89,
            "location": "Hyderabad",
        },
        {
            "name": "Ergonomic Office Chair",
            "brand": "Herman Miller",
            "category": "Workspace",
            "description": "Premium ergonomic office chair with lumbar support for long working hours.",
            "price_per_day": 4.0,
            "monthly_rent": 80.0,
            "weekly_rent": 22.0,
            "deposit": 40.0,
            "image_url": "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800",
            "rating": 4.7,
            "reviews_count": 56,
            "location": "Hyderabad",
        },
        {
            "name": "Front Load Washing Machine",
            "brand": "LG",
            "category": "Appliances",
            "description": "8kg Front Load Washing Machine with AI Direct Drive.",
            "price_per_day": 7.0,
            "monthly_rent": 140.0,
            "weekly_rent": 40.0,
            "deposit": 80.0,
            "image_url": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800",
            "rating": 4.6,
            "reviews_count": 210,
            "location": "Hyderabad",
        },
        {
            "name": "Wooden Dining Table Set",
            "brand": "HomeCentre",
            "category": "Furniture",
            "description": "Solid wood 4-seater dining table with upholstered chairs.",
            "price_per_day": 6.0,
            "monthly_rent": 110.0,
            "weekly_rent": 35.0,
            "deposit": 60.0,
            "image_url": "https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80&w=800",
            "rating": 4.5,
            "reviews_count": 45,
            "location": "Hyderabad",
        },
        {
            "name": "1.5 Ton 5-Star Split AC",
            "brand": "Daikin",
            "category": "AC",
            "description": "High efficiency inverter split air conditioner with fast cooling and silent operation.",
            "price_per_day": 12.0,
            "monthly_rent": 350.0,
            "weekly_rent": 90.0,
            "deposit": 150.0,
            "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
            "rating": 4.9,
            "reviews_count": 312,
            "location": "Hyderabad",
        },
        {
            "name": "Frost-Free Double Door Refrigerator",
            "brand": "Samsung",
            "category": "Refrigerator",
            "description": "253L convertible 3-in-1 double door digital inverter refrigerator.",
            "price_per_day": 9.0,
            "monthly_rent": 220.0,
            "weekly_rent": 65.0,
            "deposit": 120.0,
            "image_url": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=800",
            "rating": 4.8,
            "reviews_count": 180,
            "location": "Hyderabad",
        },
        {
            "name": "Convection Microwave Oven 28L",
            "brand": "LG",
            "category": "Microwave",
            "description": "All-in-one convection microwave with auto-cook menu and charcoal lighting heater.",
            "price_per_day": 5.0,
            "monthly_rent": 95.0,
            "weekly_rent": 30.0,
            "deposit": 50.0,
            "image_url": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&q=80&w=800",
            "rating": 4.6,
            "reviews_count": 94,
            "location": "Hyderabad",
        },
        {
            "name": "MacBook Pro M2 14-Inch",
            "brand": "Apple",
            "category": "Laptop",
            "description": "High performance developer laptop with 16GB unified memory and Liquid Retina display.",
            "price_per_day": 25.0,
            "monthly_rent": 600.0,
            "weekly_rent": 170.0,
            "deposit": 300.0,
            "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
            "rating": 4.95,
            "reviews_count": 87,
            "location": "Hyderabad",
        },
        {
            "name": "Instant Water Heater / Geyser 15L",
            "brand": "Havells",
            "category": "Geyser",
            "description": "Energy efficient digital temperature display water heater with rust-proof coating.",
            "price_per_day": 4.0,
            "monthly_rent": 75.0,
            "weekly_rent": 25.0,
            "deposit": 40.0,
            "image_url": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800",
            "rating": 4.7,
            "reviews_count": 62,
            "location": "Hyderabad",
        }
    ]

    for p in sample_products:
        # Check if exists
        if not Appliance.objects(name=p["name"]).first():
            app = Appliance(
                owner_id=owner,
                **p
            )
            app.save()
            print(f"Added: {p['name']}")
        else:
            print(f"Already exists: {p['name']}")

    print("Finished adding products!")

if __name__ == '__main__':
    run()
