"""
seed_images.py
==============
Seeds the MongoDB 'appliances' collection using ONLY the local downloaded
images from G:\\My Drive\\sdc2\\downloaded_images.

- Folder structure determines the product category
- Each image becomes one product
- Images are copied to backend/media/appliances/ (safe binary copy, no shutil)

Run:
    python seed_images.py
"""

import os, uuid, random
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
from django.contrib.auth.hashers import make_password
from users.models import User
from appliances.models import Appliance

# ──────────────────────────────────────────────
# PATHS
# ──────────────────────────────────────────────
IMAGE_BASE = r'G:\My Drive\sdc2\downloaded_images'
MEDIA_DEST = os.path.join(settings.BASE_DIR, 'media', 'appliances')
os.makedirs(MEDIA_DEST, exist_ok=True)

# ──────────────────────────────────────────────
# Folder path  →  (category label, product names, brand pool, price_range, deposit_mult)
# ──────────────────────────────────────────────
FOLDER_CONFIG = {
    # appliances
    'appliances/refrigerator':    ('Refrigerators',
        ['Double Door Refrigerator', 'Single Door Fridge', 'Side-by-Side Refrigerator',
         'Mini Fridge', 'French Door Refrigerator', 'Convertible Refrigerator'],
        ['LG', 'Samsung', 'Whirlpool', 'Haier', 'Godrej', 'Bosch'],
        (600, 1500), 2),

    'appliances/washing_machine': ('Washing Machines',
        ['Front Load Washing Machine', 'Top Load Washer', 'Semi-Automatic Washer',
         'Fully Automatic Washer', 'Compact Washer', 'Twin Tub Washer'],
        ['LG', 'Samsung', 'Bosch', 'Whirlpool', 'IFB', 'Haier'],
        (500, 1200), 2),

    'appliances/ac':              ('Air Conditioners',
        ['1.5 Ton Split AC', '1 Ton Window AC', '2 Ton Inverter AC',
         'Portable AC', '1 Ton Inverter Split AC', '2 Ton Window AC'],
        ['Voltas', 'Daikin', 'LG', 'Hitachi', 'Blue Star', 'Carrier'],
        (800, 2000), 2),

    'appliances/tv':              ('Televisions',
        ['4K Smart TV', 'Full HD LED TV', 'QLED Smart TV',
         'Android TV', 'OLED Smart TV', '32-inch LED TV', '55-inch 4K TV'],
        ['Sony', 'Samsung', 'LG', 'OnePlus', 'Xiaomi', 'TCL'],
        (500, 1800), 2),

    'appliances/microwave':       ('Microwaves',
        ['Convection Microwave', 'Solo Microwave', 'Grill Microwave', 'OTG Oven'],
        ['LG', 'Samsung', 'IFB', 'Godrej', 'Whirlpool', 'Panasonic'],
        (300, 800), 1),

    'appliances/water_purifier':  ('Water Purifiers',
        ['RO Water Purifier', 'UV Water Purifier', 'RO+UV Water Purifier',
         'Gravity Water Filter'],
        ['Kent', 'Aquaguard', 'Livpure', 'Pureit', 'HUL', 'AO Smith'],
        (400, 900), 2),

    'appliances/air_purifier':    ('Air Purifiers',
        ['HEPA Air Purifier', 'Ionizer Air Purifier', 'Smart Air Purifier',
         'Tower Air Purifier'],
        ['Dyson', 'Philips', 'Sharp', 'Honeywell', 'Mi', 'Coway'],
        (350, 800), 1),

    'appliances/kitchen':         ('Kitchen Appliances',
        ['Induction Cooktop', 'Mixer Grinder', 'Chimney Hood',
         'Dishwasher', 'Coffee Maker', 'Air Fryer'],
        ['Prestige', 'Butterfly', 'Elica', 'Bosch', 'Inalsa', 'Glen'],
        (300, 1000), 1),

    # bedroom
    'bedroom/beds':               ('Beds',
        ['Queen Size Bed', 'King Size Bed', 'Single Bed with Storage',
         'Platform Bed', 'Upholstered Bed', 'Bunk Bed'],
        ['Durian', 'Godrej Interio', 'Nilkamal', 'Urban Ladder', 'Pepperfry'],
        (700, 2000), 2),

    'bedroom/full_room':          ('Bedroom Sets',
        ['Complete Bedroom Set', 'Bed + Wardrobe Combo', 'Full Bedroom Package',
         'Master Bedroom Set', 'Studio Bedroom Kit'],
        ['Urban Ladder', 'Godrej Interio', 'Durian', 'Pepperfry'],
        (2000, 6000), 3),

    'bedroom/side_tables':        ('Side Tables',
        ['Bedside Table', 'Nightstand', 'Wooden Side Table', 'Glass Side Table'],
        ['Nilkamal', 'Urban Ladder', 'Pepperfry', 'Godrej Interio'],
        (200, 600), 1),

    'bedroom/dressing_table':     ('Dressing Tables',
        ['Dressing Table with Mirror', 'Vanity Table', 'Wooden Dressing Table'],
        ['Godrej Interio', 'Nilkamal', 'Urban Ladder', 'Durian'],
        (400, 1200), 1),

    # living room
    'living_room/sofas':          ('Sofas',
        ['3-Seater Sofa', 'L-Shaped Sofa', '2-Seater Sofa',
         'Sectional Sofa', 'Fabric Sofa', 'Leather Sofa'],
        ['Urban Ladder', 'Godrej Interio', 'Durian', 'Pepperfry', 'Nilkamal'],
        (800, 2500), 2),

    'living_room/recliners':      ('Recliners',
        ['Single Recliner', 'Rocking Recliner', 'Electric Recliner',
         'Fabric Recliner', 'Leather Recliner'],
        ['La-Z-Boy', 'Godrej Interio', 'Durian', 'Urban Ladder'],
        (600, 1800), 2),

    'living_room/coffee_tables':  ('Coffee Tables',
        ['Wooden Coffee Table', 'Glass Coffee Table', 'Marble Coffee Table',
         'Storage Coffee Table', 'Round Coffee Table'],
        ['Urban Ladder', 'Pepperfry', 'Godrej Interio', 'Nilkamal'],
        (300, 900), 1),

    'living_room/tv_units':       ('TV Units',
        ['TV Cabinet', 'Wall-Mount TV Unit', 'Entertainment Unit',
         'TV Stand', 'Media Console'],
        ['Nilkamal', 'Godrej Interio', 'Urban Ladder', 'Pepperfry'],
        (400, 1200), 1),

    'living_room/bookshelves':    ('Bookshelves',
        ['5-Tier Bookshelf', 'Open Bookcase', 'Wooden Bookshelf',
         'Display Shelf', 'Corner Bookshelf'],
        ['Nilkamal', 'Urban Ladder', 'Godrej Interio', 'Pepperfry'],
        (300, 900), 1),

    'living_room/full_room':      ('Living Room Sets',
        ['Complete 1BHK Living Set', 'Sofa + Coffee Table Combo',
         'Full Living Room Package', 'Premium Living Room Kit'],
        ['Urban Ladder', 'Godrej Interio', 'Pepperfry'],
        (2000, 6000), 3),

    # dining room
    'dining_room/dining_tables':  ('Dining Tables',
        ['4-Seater Dining Table', '6-Seater Dining Table',
         'Glass Dining Table', 'Wooden Dining Table', 'Extendable Dining Table'],
        ['Godrej Interio', 'Nilkamal', 'Urban Ladder', 'Pepperfry', 'Durian'],
        (500, 1500), 2),

    'dining_room/dining_chairs':  ('Dining Chairs',
        ['Wooden Dining Chair', 'Cushioned Dining Chair',
         'Metal Dining Chair', 'Upholstered Chair', 'Foldable Chair'],
        ['Nilkamal', 'Urban Ladder', 'Godrej Interio', 'Pepperfry'],
        (150, 500), 1),

    'dining_room/full_room':      ('Dining Sets',
        ['4-Seater Dining Set', '6-Seater Dining Set',
         'Complete Dining Room Set', 'Compact Dining Set'],
        ['Godrej Interio', 'Urban Ladder', 'Pepperfry', 'Durian'],
        (1500, 4000), 2),

    'dining_room/crockery_units': ('Crockery Units',
        ['Crockery Cabinet', 'Display Cabinet', 'Glass Crockery Unit',
         'Wooden Crockery Shelf'],
        ['Nilkamal', 'Godrej Interio', 'Urban Ladder'],
        (400, 1000), 1),

    # study room
    'study_room/desks':           ('Study Desks',
        ['Study Table', 'Computer Desk', 'L-Shaped Study Desk',
         'Standing Desk', 'Foldable Study Table', 'Writing Desk'],
        ['Nilkamal', 'Urban Ladder', 'Godrej Interio', 'Durian'],
        (400, 1200), 1),

    'study_room/chairs':          ('Study Chairs',
        ['Ergonomic Chair', 'Mesh Office Chair', 'High-Back Chair',
         'Study Chair', 'Revolving Chair'],
        ['Godrej Interio', 'Featherlite', 'Herman Miller', 'Urban Ladder'],
        (400, 1500), 1),

    'study_room/bookshelves':     ('Bookshelves',
        ['5-Tier Bookshelf', 'Open Bookcase', 'Study Room Shelf',
         'Wooden Bookshelf', 'Wall Bookshelf'],
        ['Nilkamal', 'Urban Ladder', 'Godrej Interio'],
        (300, 800), 1),

    'study_room/full_room':       ('Study Room Sets',
        ['Complete Study Room Set', 'Desk + Chair + Shelf Combo',
         'Work From Home Kit', 'Home Office Set'],
        ['Urban Ladder', 'Godrej Interio', 'Pepperfry'],
        (1000, 3000), 2),

    # storage
    'storage/wardrobes':          ('Wardrobes',
        ['2-Door Wardrobe', '3-Door Wardrobe', 'Sliding Door Wardrobe',
         'Wooden Wardrobe', 'Mirrored Wardrobe', '4-Door Wardrobe'],
        ['Godrej Interio', 'Nilkamal', 'Urban Ladder', 'Durian', 'Pepperfry'],
        (800, 2500), 2),

    'storage/cabinets':           ('Cabinets',
        ['Storage Cabinet', 'Shoe Cabinet', 'Filing Cabinet',
         'Multi-Purpose Cabinet', 'Kitchen Cabinet'],
        ['Nilkamal', 'Godrej Interio', 'Urban Ladder'],
        (400, 1200), 1),

    'storage/shoe_racks':         ('Shoe Racks',
        ['3-Tier Shoe Rack', '5-Tier Shoe Rack', 'Wooden Shoe Rack',
         'Shoe Cabinet', 'Foldable Shoe Rack'],
        ['Nilkamal', 'Urban Ladder', 'Cello'],
        (150, 500), 1),

    # kids furniture
    'kids_furniture/beds':        ('Kids Beds',
        ['Kids Single Bed', 'Bunk Bed', 'Trundle Bed',
         'Kids Bed with Storage', 'Toddler Bed'],
        ['Nilkamal', 'Godrej Interio', 'Alex Daisy'],
        (500, 1500), 2),

    'kids_furniture/rooms':       ("Children's Room Sets",
        ["Complete Kids Room Set", "Kids Bedroom Package",
         "Study + Bed Combo for Kids", "Kids Furniture Bundle"],
        ['Nilkamal', 'Alex Daisy', 'Godrej Interio'],
        (1500, 4000), 2),

    'kids_furniture/study':       ('Kids Study Sets',
        ['Kids Study Table', 'Kids Desk & Chair Set', 'Toddler Desk',
         'Kids Writing Table'],
        ['Nilkamal', 'Alex Daisy', 'Urban Ladder'],
        (300, 800), 1),

    # office
    'office_furniture/desks':     ('Office Desks',
        ['Executive Desk', 'Computer Workstation', 'Standing Desk',
         'L-Shaped Office Desk', 'Corner Workstation'],
        ['Godrej Interio', 'Featherlite', 'Nilkamal', 'Urban Ladder'],
        (800, 2500), 2),

    'office_furniture/chairs':    ('Office Chairs',
        ['Ergonomic Office Chair', 'Mesh Chair', 'High-Back Executive Chair',
         'Revolving Chair', 'Visitor Chair'],
        ['Godrej Interio', 'Featherlite', 'Herman Miller', 'Durian'],
        (500, 2000), 1),

    'office_furniture/conference': ('Conference Furniture',
        ['Conference Table Set', 'Boardroom Table', 'Meeting Room Set',
         'Modular Conference Setup'],
        ['Godrej Interio', 'Featherlite', 'Durian'],
        (2000, 6000), 2),

    # mattress
    'mattress':                   ('Mattresses',
        ['Memory Foam Mattress', 'Orthopaedic Mattress', 'Spring Mattress',
         'Latex Mattress', 'Bonnell Spring Mattress', 'Dual Comfort Mattress'],
        ['Sleepwell', 'Duroflex', 'Wakefit', 'SleepyCat', 'Kurlon', 'Springtek'],
        (400, 1500), 2),

    # chairs
    'chairs/accent':              ('Accent Chairs',
        ['Accent Chair', 'Wing Chair', 'Barrel Chair',
         'Lounge Chair', 'Reading Chair'],
        ['Urban Ladder', 'Pepperfry', 'Godrej Interio', 'Durian'],
        (400, 1200), 1),

    'chairs/bean_bags':           ('Bean Bags',
        ['XXL Bean Bag', 'Bean Bag Chair', 'Bean Bag Sofa',
         'Teardrop Bean Bag'],
        ['Couchette', 'Orka', 'Sattva', 'Comfybean'],
        (200, 700), 1),

    'chairs/bar_stools':          ('Bar Stools',
        ['Adjustable Bar Stool', 'Wooden Bar Stool', 'Metal Bar Stool',
         'Swivel Bar Stool'],
        ['Nilkamal', 'Urban Ladder', 'Godrej Interio'],
        (200, 700), 1),

    # combo sets
    'combos/1bhk':                ('1BHK Packages',
        ['Complete 1BHK Package', '1BHK Starter Kit', '1BHK Furnished Set',
         '1BHK Home Bundle'],
        ['Rentova'],
        (3000, 8000), 3),

    'combos/2bhk':                ('2BHK Packages',
        ['Complete 2BHK Package', '2BHK Home Bundle', '2BHK Furnished Set',
         '2BHK Premium Kit'],
        ['Rentova'],
        (5000, 12000), 3),

    'combos/3bhk':                ('3BHK Packages',
        ['Complete 3BHK Package', '3BHK Home Bundle', '3BHK Premium Furnished'],
        ['Rentova'],
        (8000, 18000), 3),

    'combos/bachelor':            ('Bachelor Packages',
        ["Bachelor's Kit", 'Studio Starter Pack', 'Single Room Package',
         'Compact Home Bundle'],
        ['Rentova'],
        (1500, 4000), 2),
}

CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai']
ADJECTIVES = ['Premium', 'Elegant', 'Modern', 'Classic', 'Sleek', 'Compact',
              'Luxury', 'Essential', 'Smart', 'Minimalist', 'Contemporary']
IMG_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}


def safe_copy(src, dst):
    """Binary file copy that works on Google Drive mounted paths."""
    with open(src, 'rb') as f_in:
        data = f_in.read()
    with open(dst, 'wb') as f_out:
        f_out.write(data)


def copy_image(src_path):
    """Copy image to media/appliances/, return the URL path."""
    ext = os.path.splitext(src_path)[1].lower()
    filename = f"{uuid.uuid4().hex[:12]}{ext}"
    dst = os.path.join(MEDIA_DEST, filename)
    safe_copy(src_path, dst)
    return f'/media/appliances/{filename}'


def seed():
    print("\n[*] Image Folder Seeder Starting...\n")

    # Ensure owner
    owner = User.objects(email='owner@rentova.com').first()
    if not owner:
        print("  Creating owner account...")
        owner = User(
            email='owner@rentova.com',
            password=make_password('password123'),
            full_name='Rentova Official',
            role='owner',
            phone='9999999999'
        ).save()
    print(f"  Owner: {owner.email}")

    # NOTE: This does NOT clear existing appliances so IKEA data is preserved.
    # If you want to start fresh, uncomment the next two lines:
    # print(f"  Clearing existing appliances...")
    # Appliance.objects().delete()

    existing = Appliance.objects().count()
    print(f"  Existing products in DB: {existing}")
    print(f"  Adding image-based products on top...\n")

    total = 0

    for folder_rel, config in FOLDER_CONFIG.items():
        label, names, brands, price_range, dep_mult = config
        folder_abs = os.path.join(IMAGE_BASE, folder_rel.replace('/', os.sep))

        if not os.path.isdir(folder_abs):
            print(f"  [!] Folder not found, skipping: {folder_rel}")
            continue

        images = [
            os.path.join(folder_abs, f)
            for f in os.listdir(folder_abs)
            if os.path.splitext(f)[1].lower() in IMG_EXTENSIONS
        ]

        if not images:
            print(f"  [!] No images in: {folder_rel}")
            continue

        cat_count = 0
        for img_path in images:
            try:
                img_url = copy_image(img_path)
            except Exception as e:
                print(f"  [!] Could not copy {img_path}: {e}")
                continue

            monthly   = random.randrange(price_range[0], price_range[1], 50)
            weekly    = round(monthly * 0.30 / 10) * 10
            deposit   = float(monthly * dep_mult)
            price_day = round(monthly / 30)

            Appliance(
                owner_id      = owner,
                name          = random.choice(names),
                brand         = random.choice(brands),
                category      = label,
                description   = (f"{random.choice(ADJECTIVES)} {label.lower()} available for rent. "
                                 f"Free delivery & installation included."),
                price_per_day = float(price_day),
                monthly_rent  = float(monthly),
                weekly_rent   = float(weekly),
                deposit       = deposit,
                images        = [img_url],
                image_url     = img_url,
                rating        = round(random.uniform(4.0, 5.0), 1),
                reviews_count = random.randint(8, 350),
                location      = random.choice(CITIES),
                available     = True,
            ).save()

            cat_count += 1
            total += 1

        print(f"  [OK] {label:<35s} ({cat_count} products from {folder_rel})")

    print(f"\n[DONE] Added {total} image-based products.")
    print(f"  Total in DB now: {Appliance.objects().count()}\n")


if __name__ == '__main__':
    seed()
