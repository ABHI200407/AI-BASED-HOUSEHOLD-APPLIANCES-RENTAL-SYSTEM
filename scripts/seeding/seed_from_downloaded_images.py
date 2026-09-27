import os
import sys
import django
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User
from appliances.models import Appliance

def seed_downloaded_images():
    print("Finding or creating an owner user...")
    owner = User.objects(role='owner').first()
    if not owner:
        owner = User(
            email='partner@rentova.ai',
            full_name='Rentova Asset Host',
            password='password123',
            role='owner'
        )
        owner.save()
        print("Created owner:", owner.email)
    else:
        print("Using owner:", owner.email)

    products_data = [
        # ── APPLIANCES ──
        {
            "name": "Samsung 653L Side-by-Side Smart Refrigerator",
            "brand": "Samsung",
            "category": "Refrigerator",
            "description": "Twin Cooling Plus frost-free side-by-side refrigerator with digital inverter and Wi-Fi smart control.",
            "price_per_day": 32.0,
            "monthly_rent": 2850.0,
            "weekly_rent": 750.0,
            "deposit": 5700.0,
            "images": ["/downloaded_images/appliances/refrigerator/refrigerator_001_pid9646742.jpg"],
            "image_url": "/downloaded_images/appliances/refrigerator/refrigerator_001_pid9646742.jpg",
            "rating": 4.9,
            "reviews_count": 142,
            "location": "Bengaluru",
        },
        {
            "name": "LG 260L 3-Star Smart Inverter Double Door Refrigerator",
            "brand": "LG",
            "category": "Refrigerator",
            "description": "Multi air flow cooling with Smart Diagnosis, moist balance crisper, and toughened glass shelves.",
            "price_per_day": 22.0,
            "monthly_rent": 1950.0,
            "weekly_rent": 520.0,
            "deposit": 3900.0,
            "images": ["/downloaded_images/appliances/refrigerator/refrigerator_002_pid27301775.jpg"],
            "image_url": "/downloaded_images/appliances/refrigerator/refrigerator_002_pid27301775.jpg",
            "rating": 4.8,
            "reviews_count": 98,
            "location": "Bengaluru",
        },
        {
            "name": "Whirlpool 240L Triple Door Frost-Free Refrigerator",
            "brand": "Whirlpool",
            "category": "Refrigerator",
            "description": "Protton world series with Active Fresh zone and Zeolite technology preventing fruit over-ripening.",
            "price_per_day": 20.0,
            "monthly_rent": 1800.0,
            "weekly_rent": 480.0,
            "deposit": 3600.0,
            "images": ["/downloaded_images/appliances/refrigerator/refrigerator_003_pid34872429.jpg"],
            "image_url": "/downloaded_images/appliances/refrigerator/refrigerator_003_pid34872429.jpg",
            "rating": 4.7,
            "reviews_count": 76,
            "location": "Hyderabad",
        },
        {
            "name": "Daikin 1.5 Ton 5-Star Inverter Split AC",
            "brand": "Daikin",
            "category": "AC",
            "description": "Copper condenser with PM 2.5 filter, Neo Swing compressor, and Coanda airflow stream.",
            "price_per_day": 28.0,
            "monthly_rent": 2400.0,
            "weekly_rent": 640.0,
            "deposit": 4800.0,
            "images": ["/downloaded_images/appliances/ac/ac_001_pid16848596.jpg"],
            "image_url": "/downloaded_images/appliances/ac/ac_001_pid16848596.jpg",
            "rating": 4.9,
            "reviews_count": 210,
            "location": "Bengaluru",
        },
        {
            "name": "Voltas 1 Ton 3-Star Adjustable Inverter AC",
            "brand": "Voltas",
            "category": "AC",
            "description": "High ambient cooling at 52°C, superdry dehumidifier mode, and anti-microbial protection.",
            "price_per_day": 21.0,
            "monthly_rent": 1850.0,
            "weekly_rent": 490.0,
            "deposit": 3700.0,
            "images": ["/downloaded_images/appliances/ac/ac_002_pid2410319.jpg"],
            "image_url": "/downloaded_images/appliances/ac/ac_002_pid2410319.jpg",
            "rating": 4.6,
            "reviews_count": 115,
            "location": "Mumbai",
        },
        {
            "name": "Sony Bravia 55\" 4K Ultra HD Smart Google TV",
            "brand": "Sony",
            "category": "TV",
            "description": "Cognitive Processor XR, Dolby Vision HDR, Acoustic Multi-Audio with built-in voice assistant.",
            "price_per_day": 26.0,
            "monthly_rent": 2100.0,
            "weekly_rent": 580.0,
            "deposit": 4200.0,
            "images": ["/downloaded_images/appliances/tv/tv_001_pid5202925.jpg"],
            "image_url": "/downloaded_images/appliances/tv/tv_001_pid5202925.jpg",
            "rating": 4.95,
            "reviews_count": 340,
            "location": "Bengaluru",
        },
        {
            "name": "LG 43\" 4K UHD Smart AI ThinQ TV",
            "brand": "LG",
            "category": "TV",
            "description": "Quad Core Processor 4K with Magic Remote, Filmmaker Mode, and Apple AirPlay integration.",
            "price_per_day": 18.0,
            "monthly_rent": 1450.0,
            "weekly_rent": 390.0,
            "deposit": 2900.0,
            "images": ["/downloaded_images/appliances/tv/tv_002_pid7045763.jpg"],
            "image_url": "/downloaded_images/appliances/tv/tv_002_pid7045763.jpg",
            "rating": 4.8,
            "reviews_count": 180,
            "location": "Delhi NCR",
        },
        {
            "name": "Bosch 8kg Front Load 5-Star Inverter Washing Machine",
            "brand": "Bosch",
            "category": "Washing Machine",
            "description": "EcoSilence Drive brushless motor with Anti-Vibration side panels, AllergyPlus, and SpeedPerfect.",
            "price_per_day": 24.0,
            "monthly_rent": 1950.0,
            "weekly_rent": 520.0,
            "deposit": 3900.0,
            "images": ["/downloaded_images/appliances/washing_machine/washing_machine_001_pid4440652.jpg"],
            "image_url": "/downloaded_images/appliances/washing_machine/washing_machine_001_pid4440652.jpg",
            "rating": 4.85,
            "reviews_count": 220,
            "location": "Bengaluru",
        },
        {
            "name": "IFB 7kg 5-Star Fully-Automatic Front Load Washer",
            "brand": "IFB",
            "category": "Washing Machine",
            "description": "Deep Clean Technology, Triadic Pulsator, Aqua Energie water softener filter for hard water areas.",
            "price_per_day": 20.0,
            "monthly_rent": 1650.0,
            "weekly_rent": 440.0,
            "deposit": 3300.0,
            "images": ["/downloaded_images/appliances/washing_machine/washing_machine_002_pid7045766.jpg"],
            "image_url": "/downloaded_images/appliances/washing_machine/washing_machine_002_pid7045766.jpg",
            "rating": 4.7,
            "reviews_count": 134,
            "location": "Pune",
        },
        {
            "name": "IFB 30L Convection Microwave Oven",
            "brand": "IFB",
            "category": "Microwave",
            "description": "Multi-stage cooking with rotisserie, 101 auto-cook menus, steam clean and deodorize cycles.",
            "price_per_day": 12.0,
            "monthly_rent": 950.0,
            "weekly_rent": 260.0,
            "deposit": 1900.0,
            "images": ["/downloaded_images/appliances/microwave/microwave_001_pid7045762.jpg"],
            "image_url": "/downloaded_images/appliances/microwave/microwave_001_pid7045762.jpg",
            "rating": 4.65,
            "reviews_count": 89,
            "location": "Bengaluru",
        },
        {
            "name": "Dyson Pure Cool HEPA H13 Air Purifier",
            "brand": "Dyson",
            "category": "Air Purifier",
            "description": "Captures 99.95% of ultrafine particles including bacteria, viruses, and VOC pollutants with real-time LCD report.",
            "price_per_day": 20.0,
            "monthly_rent": 1600.0,
            "weekly_rent": 430.0,
            "deposit": 3200.0,
            "images": ["/downloaded_images/appliances/air_purifier/air_purifier_001_pid31057404.jpg"],
            "image_url": "/downloaded_images/appliances/air_purifier/air_purifier_001_pid31057404.jpg",
            "rating": 4.92,
            "reviews_count": 67,
            "location": "Delhi NCR",
        },
        {
            "name": "Kent Grand Plus RO + UV + UF Water Purifier",
            "brand": "Kent",
            "category": "Water Purifier",
            "description": "Multi-stage mineral RO purification with TDS controller, in-tank UV disinfection, and 9L storage.",
            "price_per_day": 11.0,
            "monthly_rent": 850.0,
            "weekly_rent": 230.0,
            "deposit": 1700.0,
            "images": ["/downloaded_images/appliances/water_purifier/water_purifier_001_pid34872428.jpg"],
            "image_url": "/downloaded_images/appliances/water_purifier/water_purifier_001_pid34872428.jpg",
            "rating": 4.75,
            "reviews_count": 150,
            "location": "Bengaluru",
        },

        # ── LIVING ROOM FURNITURE ──
        {
            "name": "Horizon Velvet 3-Seater Minimalist Sofa",
            "brand": "Rentova Studio",
            "category": "Sofa",
            "description": "Deep-cushioned high-resilience foam wrapped in stain-resistant performance boucle fabric.",
            "price_per_day": 24.0,
            "monthly_rent": 1850.0,
            "weekly_rent": 500.0,
            "deposit": 3700.0,
            "images": ["/downloaded_images/living_room/sofas/sofas_001_pid7587782.jpg"],
            "image_url": "/downloaded_images/living_room/sofas/sofas_001_pid7587782.jpg",
            "rating": 4.9,
            "reviews_count": 195,
            "location": "Bengaluru",
        },
        {
            "name": "Nordic L-Shaped Sectional Lounger Sofa",
            "brand": "Rentova Studio",
            "category": "Sofa",
            "description": "Reversible chaise lounge with solid kiln-dried salwood frame and modular configuration.",
            "price_per_day": 34.0,
            "monthly_rent": 2600.0,
            "weekly_rent": 700.0,
            "deposit": 5200.0,
            "images": ["/downloaded_images/living_room/sofas/sofas_002_pid6980724.jpg"],
            "image_url": "/downloaded_images/living_room/sofas/sofas_002_pid6980724.jpg",
            "rating": 4.85,
            "reviews_count": 140,
            "location": "Bengaluru",
        },
        {
            "name": "Curved Oak Minimalist Coffee Table",
            "brand": "Rentova Crafted",
            "category": "Living Room",
            "description": "Organic rounded edges with natural matte lacquer finish and concealed storage shelf.",
            "price_per_day": 8.0,
            "monthly_rent": 650.0,
            "weekly_rent": 180.0,
            "deposit": 1300.0,
            "images": ["/downloaded_images/living_room/coffee_tables/coffee_tables_001_pid6782570.jpg"],
            "image_url": "/downloaded_images/living_room/coffee_tables/coffee_tables_001_pid6782570.jpg",
            "rating": 4.8,
            "reviews_count": 82,
            "location": "Hyderabad",
        },
        {
            "name": "Floating Fluted Wood TV Media Console",
            "brand": "Rentova Crafted",
            "category": "Living Room",
            "description": "Tambour slatted sliding doors with integrated cord management channels supporting up to 75-inch TVs.",
            "price_per_day": 12.0,
            "monthly_rent": 950.0,
            "weekly_rent": 260.0,
            "deposit": 1900.0,
            "images": ["/downloaded_images/living_room/tv_units/tv_units_001_pid7587780.jpg"],
            "image_url": "/downloaded_images/living_room/tv_units/tv_units_001_pid7587780.jpg",
            "rating": 4.78,
            "reviews_count": 91,
            "location": "Bengaluru",
        },

        # ── BEDROOM FURNITURE ──
        {
            "name": "Linen Queen Bed Frame with Ortho Mattress",
            "brand": "SleepWell x Rentova",
            "category": "Bed",
            "description": "Upholstered acoustic linen headboard with 8-inch pocket spring orthopaedic memory foam mattress.",
            "price_per_day": 26.0,
            "monthly_rent": 2100.0,
            "weekly_rent": 560.0,
            "deposit": 4200.0,
            "images": ["/downloaded_images/bedroom/beds/beds_001_pid7445084.jpg"],
            "image_url": "/downloaded_images/bedroom/beds/beds_001_pid7445084.jpg",
            "rating": 4.92,
            "reviews_count": 270,
            "location": "Bengaluru",
        },
        {
            "name": "Solid Sheesham King Bed with Hydraulic Storage",
            "brand": "Rentova Crafted",
            "category": "Bed",
            "description": "Hand-buffed honey finish Sheesham wood bed featuring heavy-duty German gas-lift storage.",
            "price_per_day": 32.0,
            "monthly_rent": 2650.0,
            "weekly_rent": 710.0,
            "deposit": 5300.0,
            "images": ["/downloaded_images/bedroom/beds/beds_002_pid6903157.jpg"],
            "image_url": "/downloaded_images/bedroom/beds/beds_002_pid6903157.jpg",
            "rating": 4.88,
            "reviews_count": 164,
            "location": "Mumbai",
        },
        {
            "name": "Minimalist 3-Door Modular Wardrobe",
            "brand": "Rentova Studio",
            "category": "Storage",
            "description": "Full-height wardrobe with full-length vanity mirror, lockable security drawer, and soft-close hinges.",
            "price_per_day": 16.0,
            "monthly_rent": 1350.0,
            "weekly_rent": 360.0,
            "deposit": 2700.0,
            "images": ["/downloaded_images/storage/wardrobes/wardrobes_001_pid31388433.jpg"],
            "image_url": "/downloaded_images/storage/wardrobes/wardrobes_001_pid31388433.jpg",
            "rating": 4.75,
            "reviews_count": 88,
            "location": "Bengaluru",
        },

        # ── DINING & WORKSPACE ──
        {
            "name": "Solid Teak 4-Seater Dining Suite",
            "brand": "Rentova Crafted",
            "category": "Dining",
            "description": "Warm walnut stained teak table accompanied by four ergonomic upholstered dining chairs.",
            "price_per_day": 20.0,
            "monthly_rent": 1650.0,
            "weekly_rent": 440.0,
            "deposit": 3300.0,
            "images": ["/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg"],
            "image_url": "/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg",
            "rating": 4.84,
            "reviews_count": 112,
            "location": "Bengaluru",
        },
        {
            "name": "Focus Ergonomic Height-Adjustable Standing Desk",
            "brand": "ErgoMotion",
            "category": "Workstation",
            "description": "Dual-motor motorized standing desk with 4 programmable presets and integrated wireless charging pad.",
            "price_per_day": 18.0,
            "monthly_rent": 1450.0,
            "weekly_rent": 390.0,
            "deposit": 2900.0,
            "images": ["/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg"],
            "image_url": "/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg",
            "rating": 4.91,
            "reviews_count": 230,
            "location": "Bengaluru",
        },
        {
            "name": "Aero Mesh High-Back Ergonomic Task Chair",
            "brand": "Herman Miller Style",
            "category": "Workstation",
            "description": "Breathable Korean mesh with 3D adjustable armrests, dynamic lumbar support, and synchronized tilt lock.",
            "price_per_day": 10.0,
            "monthly_rent": 850.0,
            "weekly_rent": 230.0,
            "deposit": 1700.0,
            "images": ["/downloaded_images/office_furniture/chairs/chairs_001_pid31388432.jpg"],
            "image_url": "/downloaded_images/office_furniture/chairs/chairs_001_pid31388432.jpg",
            "rating": 4.86,
            "reviews_count": 190,
            "location": "Bengaluru",
        },
    ]

    added_count = 0
    updated_count = 0
    for p in products_data:
        existing = Appliance.objects(name=p["name"]).first()
        if existing:
            existing.images = p["images"]
            existing.image_url = p["image_url"]
            existing.monthly_rent = p["monthly_rent"]
            existing.price_per_day = p["price_per_day"]
            existing.description = p["description"]
            existing.save()
            updated_count += 1
        else:
            app = Appliance(
                owner_id=owner,
                created_at=datetime.utcnow(),
                **p
            )
            app.save()
            added_count += 1

    print(f"[OK] Added {added_count} new products and updated {updated_count} existing products with real downloaded images.")
    print(f"Total appliances in DB now: {Appliance.objects.count()}")

if __name__ == '__main__':
    seed_downloaded_images()
