import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rental.models import Category, Appliance

MEDIA_ROOT = r'G:\My Drive\sdc2\downloaded_images'
BASE_URL = 'http://localhost:8000/media'

# Folders that aren't product categories
EXCLUDE_DIRS = ['banners', 'cities', 'promotional', 'services', 'lifestyle']

# Mapping folder names to nice UI icons
CATEGORY_ICONS = {
    'appliances': '🧊',
    'bedroom': '🛏️',
    'chairs': '🪑',
    'combos': '📦',
    'dining_room': '🍽️',
    'kids_furniture': '🧸',
    'living_room': '🛋️',
    'mattress': '🛏️',
    'office_furniture': '💼',
    'storage': '🗄️',
    'study_room': '📚',
    'tables': '🪵'
}

def generate_product_details(category_name, file_name):
    """Generate fake but realistic product details based on the category."""
    base_name = file_name.replace('.jpg', '').replace('_', ' ').title()
    brands = ['Urban Ladder', 'Pepperfry', 'IKEA', 'Godrej', 'Wakefit', 'Durian', 'Hometown', 'Nilkamal']
    
    brand = random.choice(brands)
    # Give it a premium name
    name = f"Premium {base_name}" if len(base_name.split()) < 3 else base_name
    
    monthly = random.randint(30, 200) * 10
    daily = int(monthly / 30 * 1.5)
    weekly = daily * 6
    deposit = monthly * 3
    
    desc = f"Experience ultimate comfort and premium design with this {name.lower()} by {brand}. Handcrafted to elevate your home aesthetic."
    rating = round(random.uniform(4.0, 5.0), 1)
    
    return {
        'name': name,
        'brand': brand,
        'description': desc,
        'daily_rent': daily,
        'weekly_rent': weekly,
        'monthly_rent': monthly,
        'deposit': deposit,
        'rating': rating,
        'reviews_count': random.randint(10, 500)
    }

print("Wiping existing dummy database...")
Appliance.objects.all().delete()
Category.objects.all().delete()

print("Scanning G: Drive images...")
if not os.path.exists(MEDIA_ROOT):
    print(f"Error: {MEDIA_ROOT} not found!")
    exit(1)

total_products = 0

for folder_name in os.listdir(MEDIA_ROOT):
    folder_path = os.path.join(MEDIA_ROOT, folder_name)
    if not os.path.isdir(folder_path) or folder_name in EXCLUDE_DIRS:
        continue
        
    print(f"Processing Category: {folder_name}")
    
    # Create category
    cat_name = folder_name.replace('_', ' ').title()
    cat_icon = CATEGORY_ICONS.get(folder_name, '✨')
    category = Category.objects.create(name=cat_name, description=f"Premium {cat_name} for rent", icon=cat_icon)
    
    # Process images
    images_found = 0
    for root, dirs, files in os.walk(folder_path):
        for file_name in files:
            if not (file_name.lower().endswith('.jpg') or file_name.lower().endswith('.png') or file_name.lower().endswith('.jpeg')):
                continue
                
            details = generate_product_details(folder_name, file_name)
            
            # URL encode spaces if any exist in the filename
            rel_dir = os.path.relpath(root, MEDIA_ROOT).replace('\\', '/')
            safe_file_name = file_name.replace(' ', '%20')
            image_url = f"{BASE_URL}/{rel_dir}/{safe_file_name}"
            
            Appliance.objects.create(
                category=category,
                name=details['name'],
                brand=details['brand'],
                description=details['description'],
                daily_rent=details['daily_rent'],
                weekly_rent=details['weekly_rent'],
                monthly_rent=details['monthly_rent'],
                deposit=details['deposit'],
                rating=details['rating'],
                reviews_count=details['reviews_count'],
                image_url=image_url,
                status='available'
            )
            images_found += 1
            total_products += 1
            
            # Cap at 30 per category so the DB isn't incredibly huge, but large enough
            if images_found >= 30:
                break
        if images_found >= 30:
            break
            
    print(f"  -> Added {images_found} products to {cat_name}")

print(f"Successfully generated {total_products} products from G: Drive images!")
