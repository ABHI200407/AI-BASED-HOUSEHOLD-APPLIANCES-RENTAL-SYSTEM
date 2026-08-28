import os
import django
import sys

# Setup django environment to use mongoengine
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
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
