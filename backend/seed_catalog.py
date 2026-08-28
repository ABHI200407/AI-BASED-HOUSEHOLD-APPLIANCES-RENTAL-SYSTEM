import os
import sys
import shutil
import random
import uuid
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from mongoengine import connect
from users.models import User
from appliances.models import Appliance
from django.conf import settings
from django.contrib.auth.hashers import make_password

BASE_IMAGE_DIR = r'G:\My Drive\sdc2\downloaded_images'

def format_name(folder_name):
    # e.g., "coffee_tables" -> "Coffee Tables"
    return folder_name.replace('_', ' ').title()

def generate_product_name(category):
    prefixes = ['Premium', 'Luxury', 'Modern', 'Classic', 'Sleek', 'Compact', 'Elegant', 'Cozy']
    suffixes = ['Edition', 'Series', 'Pro', 'Plus', 'Ultra', 'Essential']
    return f"{random.choice(prefixes)} {category} {random.choice(suffixes)}"

def seed_catalog():
    print("Starting massive catalog seeder...")
    
    media_dir = os.path.join(settings.BASE_DIR, 'media', 'appliances')
    os.makedirs(media_dir, exist_ok=True)
    
    owner = User.objects(email='owner@rentease.com').first()
    if not owner:
        print("Creating mock owner...")
        owner = User(
            email='owner@rentease.com',
            password=make_password('password123'),
            full_name='RentEase Official',
            role='owner',
            phone='1234567890'
        ).save()
    
    print("Clearing existing appliances...")
    Appliance.objects().delete()
    
    total_seeded = 0
    categories_found = set()
    
    for root, dirs, files in os.walk(BASE_IMAGE_DIR):
        images = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        if not images:
            continue
            
        # Determine category from folder name
        folder_name = os.path.basename(root)
        parent_folder = os.path.basename(os.path.dirname(root))
        
        # Avoid very generic names if nested
        if parent_folder in ['appliances', 'living_room', 'bedroom', 'dining_room']:
            category = format_name(folder_name)
        elif folder_name in ['appliances', 'bedroom', 'living_room', 'chairs']:
            category = format_name(folder_name)
        else:
            category = format_name(folder_name)
            
        categories_found.add(category)
        print(f"Seeding {category} ({len(images)} images found)...")
        
        for img in images:
            source_img = os.path.join(root, img)
            
            # Generate a unique safe filename
            ext = img.split('.')[-1]
            safe_filename = f"{uuid.uuid4().hex[:12]}.{ext}"
            dest_img_path = os.path.join(media_dir, safe_filename)
            
            try:
                shutil.copy2(source_img, dest_img_path)
            except Exception as e:
                print(f"  [x] Error copying {img}: {e}")
                continue
            
            product_name = generate_product_name(category)
            base_price = random.randint(20, 150) * 10
            
            Appliance(
                name=product_name,
                description=f"Top-tier {product_name.lower()} available for rent. Highly rated by customers. Free delivery included.",
                category=category,
                price_per_day=base_price,
                available=True,
                owner_id=owner,
                images=[f'/media/appliances/{safe_filename}'],
                location=random.choice(['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'])
            ).save()
            
            total_seeded += 1
            if total_seeded % 100 == 0:
                print(f"  ... seeded {total_seeded} products so far ...")

    print(f"\nSuccessfully seeded {total_seeded} products across {len(categories_found)} categories!")

if __name__ == '__main__':
    seed_catalog()
