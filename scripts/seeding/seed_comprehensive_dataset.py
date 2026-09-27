import os
import sys
import django
from datetime import datetime

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User
from appliances.models import Appliance

DOWNLOADED_DIR = os.path.join(PROJECT_ROOT, 'downloaded_images')

BRANDS = {
    'AC': ['Daikin', 'Voltas', 'LG', 'Blue Star', 'Carrier', 'Hitachi', 'Panasonic', 'Lloyd'],
    'Refrigerator': ['Samsung', 'LG', 'Whirlpool', 'Haier', 'Bosch', 'Godrej', 'Panasonic'],
    'TV': ['Sony Bravia', 'Samsung Neo', 'LG OLED', 'OnePlus', 'TCL', 'Xiaomi', 'Vu'],
    'Washing Machine': ['Bosch', 'LG AI DD', 'IFB Senator', 'Samsung EcoBubble', 'Whirlpool'],
    'Microwave': ['IFB', 'Panasonic', 'LG Charcoal', 'Samsung Solo', 'Morphy Richards'],
    'Air Purifier': ['Dyson', 'Philips', 'Mi Smart', 'Coway Airmega', 'Sharp Plasmacluster'],
    'Water Purifier': ['Kent Grand', 'Aquaguard Aura', 'Pureit Copper', 'AO Smith Z9', 'Livpure'],
    'Sofa': ['Rentova Studio', 'Urban Living', 'Scandi Craft', 'Velvet Luxe', 'Loom & Thread'],
    'Bed': ['SleepWell x Rentova', 'Wakefit Sheesham', 'OrthoRest', 'Urban Wood', 'Haven Plush'],
    'Dining': ['Rentova Crafted', 'Sheesham Artisan', 'Nordic Teak', 'Minimalist Oak'],
    'Workstation': ['ErgoMotion', 'Herman Miller Style', 'Steelcase Series', 'DeskWorx', 'FlexiSpot'],
    'Storage': ['Rentova Modular', 'SpaceOptimizer', 'Urban Wardrobe', 'Slider Luxe'],
}

CATEGORY_MAP = [
    {
        'folder': 'appliances/ac',
        'category': 'AC',
        'prefix': 'Inverter Split Air Conditioner',
        'price_range': (1600, 2600),
    },
    {
        'folder': 'appliances/refrigerator',
        'category': 'Refrigerator',
        'prefix': 'Frost-Free Refrigerator',
        'price_range': (1400, 3100),
    },
    {
        'folder': 'appliances/tv',
        'category': 'TV',
        'prefix': '4K Ultra HD Smart TV',
        'price_range': (1200, 2800),
    },
    {
        'folder': 'appliances/washing_machine',
        'category': 'Washing Machine',
        'prefix': 'Inverter Washing Machine',
        'price_range': (1300, 2200),
    },
    {
        'folder': 'appliances/microwave',
        'category': 'Microwave',
        'prefix': 'Convection Microwave Oven',
        'price_range': (750, 1200),
    },
    {
        'folder': 'appliances/air_purifier',
        'category': 'Air Purifier',
        'prefix': 'HEPA H13 Smart Air Purifier',
        'price_range': (1100, 1800),
    },
    {
        'folder': 'appliances/water_purifier',
        'category': 'Water Purifier',
        'prefix': 'Mineral RO+UV Water Purifier',
        'price_range': (650, 950),
    },
    {
        'folder': 'living_room/sofas',
        'category': 'Sofa',
        'prefix': 'Designer Living Room Sofa',
        'price_range': (1500, 3200),
    },
    {
        'folder': 'bedroom/beds',
        'category': 'Bed',
        'prefix': 'Premium Bed with Ortho Mattress',
        'price_range': (1700, 3400),
    },
    {
        'folder': 'dining_room/dining_tables',
        'category': 'Dining',
        'prefix': 'Solid Wood Dining Suite',
        'price_range': (1400, 2400),
    },
    {
        'folder': 'office_furniture/desks',
        'category': 'Workstation',
        'prefix': 'Ergonomic Work Desk',
        'price_range': (900, 1900),
    },
    {
        'folder': 'office_furniture/chairs',
        'category': 'Workstation',
        'prefix': 'High-Back Mesh Task Chair',
        'price_range': (650, 1200),
    },
    {
        'folder': 'storage/wardrobes',
        'category': 'Storage',
        'prefix': 'Modular Storage Wardrobe',
        'price_range': (1100, 1900),
    },
]

LOCATIONS = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai']

def run():
    print("Preparing comprehensive catalog dataset...")
    owner = User.objects(role='owner').first()
    if not owner:
        owner = User(
            email='partner@rentova.ai',
            full_name='Rentova Master Host',
            password='password123',
            role='owner'
        )
        owner.save()

    # Clear old duplicate items to avoid repeats
    deleted = Appliance.objects.delete()
    print(f"Purged {deleted} existing products for clean deduplication.")

    total_created = 0
    used_images = set()

    for config in CATEGORY_MAP:
        folder_path = os.path.join(DOWNLOADED_DIR, config['folder'].replace('/', os.sep))
        if not os.path.exists(folder_path):
            print(f"Folder not found: {folder_path}")
            continue

        files = sorted([f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
        cat_brands = BRANDS.get(config['category'], ['Rentova Studio', 'Artisan Choice'])

        for idx, filename in enumerate(files):
            rel_image_path = f"/downloaded_images/{config['folder']}/{filename}"
            if rel_image_path in used_images:
                continue
            used_images.add(rel_image_path)

            brand = cat_brands[idx % len(cat_brands)]
            model_num = 100 + idx * 7
            name = f"{brand} {config['prefix']} #{model_num}"

            # Rent calculation
            min_r, max_r = config['price_range']
            step = (max_r - min_r) // max(len(files), 1)
            monthly_rent = float(min_r + (idx * step))
            price_per_day = round(monthly_rent / 30.0, 1)
            deposit = round(monthly_rent * 2.0, 0)
            weekly_rent = round(monthly_rent * 0.28, 0)
            rating = round(4.5 + ((idx % 5) * 0.1), 1)
            reviews = 45 + (idx * 13)
            location = LOCATIONS[idx % len(LOCATIONS)]

            app = Appliance(
                owner_id=owner,
                name=name,
                brand=brand,
                category=config['category'],
                description=f"Verified premium grade {config['category']} unit. Sanitized, performance certified, and covered under 100% Rentova Care damage shield.",
                price_per_day=price_per_day,
                monthly_rent=monthly_rent,
                weekly_rent=weekly_rent,
                deposit=deposit,
                images=[rel_image_path],
                image_url=rel_image_path,
                rating=rating,
                reviews_count=float(reviews),
                location=location,
                available=True,
            )
            app.save()
            total_created += 1

    print(f"DONE! Seeded {total_created} completely unique products with 100% distinct images.")
    print(f"Total verified appliances in DB: {Appliance.objects.count()}")

if __name__ == '__main__':
    run()
