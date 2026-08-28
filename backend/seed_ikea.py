"""
seed_ikea.py
============
Seeds the MongoDB 'appliances' collection using ONLY the IKEA CSV dataset.
Products get real IKEA names, descriptions, categories, and INR-converted prices.
Images are curated Unsplash URLs (one per category) - no local file copying needed.

Run:
    python seed_ikea.py
"""

import os, csv, random
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from users.models import User
from appliances.models import Appliance

# ──────────────────────────────────────────────
# PATHS
# ──────────────────────────────────────────────
IKEA_CSV = r'G:\My Drive\sdc2\archive\ikea.csv'

# ──────────────────────────────────────────────
# IKEA category -> (rental label, [unsplash image URLs])
# ──────────────────────────────────────────────
CATEGORY_MAP = {
    'Sofas & armchairs': ('Sofas & Armchairs', [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    ]),
    'Beds': ('Beds', [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
        'https://images.unsplash.com/photo-1588046130759-ded48aa85a1f?w=800&q=80',
    ]),
    'Tables & desks': ('Tables & Desks', [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
        'https://images.unsplash.com/photo-1518455027359-f3f8164d1f56?w=800&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    ]),
    'Chairs': ('Chairs', [
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
        'https://images.unsplash.com/photo-1561793516-d3957c0faa91?w=800&q=80',
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    ]),
    'Bookcases & shelving units': ('Bookcases & Shelving', [
        'https://images.unsplash.com/photo-1583847268964-b28ce8f30e9b?w=800&q=80',
        'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&q=80',
    ]),
    'Wardrobes': ('Wardrobes', [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    ]),
    'Cabinets & cupboards': ('Cabinets & Cupboards', [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&q=80',
    ]),
    'Chests of drawers & drawer units': ('Chests of Drawers', [
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    ]),
    'TV & media furniture': ('TV & Media Furniture', [
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ]),
    "Children's furniture": ("Children's Furniture", [
        'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
        'https://images.unsplash.com/photo-1611128170656-b6c94aa9d4df?w=800&q=80',
    ]),
    'Nursery furniture': ("Children's Furniture", [
        'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
    ]),
    'Sideboards, buffets & console tables': ('Sideboards & Console Tables', [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
        'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&q=80',
    ]),
    'Bar furniture': ('Bar Furniture', [
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80',
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ]),
    'Cafe furniture': ('Cafe Furniture', [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ]),
    'Room dividers': ('Room Dividers', [
        'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&q=80',
    ]),
    'Outdoor furniture': ('Outdoor Furniture', [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    ]),
    'Trolleys': ('Storage & Trolleys', [
        'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&q=80',
    ]),
}

CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai']
ADJECTIVES = ['Premium', 'Elegant', 'Modern', 'Classic', 'Sleek', 'Compact',
              'Luxury', 'Essential', 'Smart', 'Minimalist', 'Scandinavian']


def ikea_price_to_rent(ikea_price_sar):
    """Convert IKEA SAR price to INR monthly rent (~4% of item value/month)."""
    inr_price = ikea_price_sar * 22
    monthly   = round(inr_price * 0.04 / 50) * 50
    monthly   = max(monthly, 299)
    weekly    = round(monthly * 0.30 / 10) * 10
    deposit   = round(monthly * 2.5 / 50) * 50
    price_day = round(monthly / 30)
    return dict(monthly_rent=float(monthly), weekly_rent=float(weekly),
                deposit=float(deposit), price_per_day=float(price_day))


def seed():
    print("\n[*] IKEA CSV Seeder Starting...\n")

    # Ensure owner account
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

    # Clear existing
    existing = Appliance.objects().count()
    print(f"  Clearing {existing} existing appliances...")
    Appliance.objects().delete()

    # Load CSV
    print(f"  Loading IKEA CSV from: {IKEA_CSV}")
    with open(IKEA_CSV, encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    print(f"  Found {len(rows)} IKEA products\n")

    total = 0

    for row in rows:
        ikea_cat = row.get('category', '').strip()
        if ikea_cat not in CATEGORY_MAP:
            continue  # skip unmapped categories

        label, img_pool = CATEGORY_MAP[ikea_cat]

        try:
            raw_price = float(row.get('price', 0) or 0)
        except (ValueError, TypeError):
            raw_price = 500.0
        if raw_price <= 0:
            raw_price = 500.0

        rents = ikea_price_to_rent(raw_price)
        name  = row['name'].strip().title()
        desc  = row.get('short_description', '').strip().strip(',').strip()
        if not desc:
            desc = f"{random.choice(ADJECTIVES)} {label} from IKEA. Ideal for rental homes."

        image = random.choice(img_pool)

        Appliance(
            owner_id      = owner,
            name          = name,
            brand         = 'IKEA',
            category      = label,
            description   = desc,
            price_per_day = rents['price_per_day'],
            monthly_rent  = rents['monthly_rent'],
            weekly_rent   = rents['weekly_rent'],
            deposit       = rents['deposit'],
            images        = [image],
            image_url     = image,
            rating        = round(random.uniform(4.0, 5.0), 1),
            reviews_count = random.randint(12, 480),
            location      = random.choice(CITIES),
            available     = True,
        ).save()

        total += 1

    print(f"[DONE] Seeded {total} IKEA products into MongoDB.\n")
    print("  Categories seeded:")
    done_cats = set()
    with open(IKEA_CSV, encoding='utf-8') as f:
        for row in csv.DictReader(f):
            c = row.get('category', '').strip()
            if c in CATEGORY_MAP:
                done_cats.add(CATEGORY_MAP[c][0])
    for c in sorted(done_cats):
        print(f"    - {c}")


if __name__ == '__main__':
    seed()
