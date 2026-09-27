"""
🛋️ Furniture Image MEGA Downloader (1000+ Images)
====================================================
Downloads 1000+ high-quality furniture images from Pexels API
for your furniture rental e-commerce website.

Storage: G:\My Drive\sdc2\downloaded_images (5TB available)

HOW TO USE:
1. Get a FREE Pexels API key from: https://www.pexels.com/api/
   - Sign up (free)
   - Click "Your API Key"
   - Copy the key
2. Paste your API key below in PEXELS_API_KEY
3. Run: python image_downloader.py
4. Images will be saved in G:\My Drive\sdc2\downloaded_images\
"""

import os
import json
import urllib.request
import urllib.parse
import urllib.error
import time
import sys
import io

# Fix Windows console encoding for emojis
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', write_through=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace', write_through=True)

# ============================================================
# 🔑 PASTE YOUR FREE PEXELS API KEY HERE
# Get it from: https://www.pexels.com/api/
# ============================================================
PEXELS_API_KEY = "bcx6bkxsoxXIJ4FsNtTyj5E5H089sw3vykBGR91KsmvhdyJCqhYLTWoc"

# ============================================================
# 📁 Output folder - Google Drive with 5TB space
# ============================================================
OUTPUT_DIR = r"G:\My Drive\sdc2\downloaded_images"

# ============================================================
# ⚙️ Settings
# ============================================================
IMAGE_SIZE = "large2x"   # Options: original, large2x, large, medium, small
DELAY_BETWEEN_REQUESTS = 0.4  # seconds (be nice to API)
MAX_RETRIES = 3

# ============================================================
# 🛋️ MEGA FURNITURE CATEGORIES - 1000+ images total
# ============================================================
FURNITURE_CATEGORIES = {

    # ==========================================
    # 🛏️ BEDROOM FURNITURE (80+ images)
    # ==========================================
    "bedroom/full_room": {
        "queries": [
            "modern bedroom interior design",
            "luxury bedroom furniture",
            "minimalist bedroom decor",
            "cozy bedroom design warm",
            "master bedroom contemporary",
            "small bedroom furniture ideas",
            "bedroom interior Indian style",
            "elegant bedroom design"
        ],
        "count": 8
    },
    "bedroom/beds": {
        "queries": [
            "wooden bed frame modern",
            "queen size bed bedroom",
            "king size bed luxury",
            "platform bed modern",
            "upholstered bed frame",
            "double bed wooden furniture",
            "single bed simple design",
            "bed with storage drawers"
        ],
        "count": 8
    },
    "bedroom/side_tables": {
        "queries": [
            "bedside table lamp modern",
            "nightstand wooden bedroom",
            "side table with drawer"
        ],
        "count": 5
    },
    "bedroom/dressing_table": {
        "queries": [
            "dressing table mirror modern",
            "vanity table bedroom",
            "makeup table with mirror"
        ],
        "count": 5
    },

    # ==========================================
    # 🛋️ LIVING ROOM FURNITURE (90+ images)
    # ==========================================
    "living_room/full_room": {
        "queries": [
            "modern living room interior",
            "contemporary living room design",
            "cozy living room decor",
            "luxury living room furniture",
            "small living room design ideas",
            "living room Indian apartment",
            "minimalist living room",
            "living room with balcony"
        ],
        "count": 8
    },
    "living_room/sofas": {
        "queries": [
            "modern L shaped sofa grey",
            "fabric sofa 3 seater",
            "leather sofa brown living room",
            "sectional sofa modern",
            "two seater sofa compact",
            "sofa set living room",
            "velvet sofa luxury",
            "sofa with cushions modern"
        ],
        "count": 8
    },
    "living_room/coffee_tables": {
        "queries": [
            "wooden coffee table modern",
            "center table living room",
            "glass coffee table contemporary",
            "round coffee table modern"
        ],
        "count": 5
    },
    "living_room/tv_units": {
        "queries": [
            "TV unit modern wooden",
            "entertainment center living room",
            "TV console table modern",
            "wall mounted TV unit"
        ],
        "count": 5
    },
    "living_room/bookshelves": {
        "queries": [
            "bookshelf modern wooden",
            "open bookcase living room",
            "wall shelf decorative"
        ],
        "count": 5
    },
    "living_room/recliners": {
        "queries": [
            "recliner chair leather",
            "recliner sofa modern",
            "lazy boy recliner",
            "recliner chair living room"
        ],
        "count": 5
    },

    # ==========================================
    # 🍽️ DINING ROOM FURNITURE (60+ images)
    # ==========================================
    "dining_room/full_room": {
        "queries": [
            "modern dining room interior",
            "dining room design contemporary",
            "elegant dining area",
            "small dining room ideas",
            "dining room with chandelier"
        ],
        "count": 8
    },
    "dining_room/dining_tables": {
        "queries": [
            "wooden dining table 4 seater",
            "6 seater dining table modern",
            "round dining table chairs",
            "glass dining table modern",
            "marble top dining table",
            "extendable dining table"
        ],
        "count": 6
    },
    "dining_room/dining_chairs": {
        "queries": [
            "dining chair wooden cushion",
            "modern dining chairs set",
            "upholstered dining chair"
        ],
        "count": 5
    },
    "dining_room/crockery_units": {
        "queries": [
            "crockery cabinet modern",
            "kitchen cabinet glass doors",
            "china cabinet dining room"
        ],
        "count": 4
    },

    # ==========================================
    # 📚 STUDY ROOM / HOME OFFICE (60+ images)
    # ==========================================
    "study_room/full_room": {
        "queries": [
            "home office modern design",
            "study room interior",
            "work from home setup",
            "home office desk setup",
            "modern home office ideas"
        ],
        "count": 8
    },
    "study_room/desks": {
        "queries": [
            "study table modern wooden",
            "computer desk home office",
            "writing desk minimalist",
            "L shaped desk office",
            "standing desk modern",
            "study desk with shelves"
        ],
        "count": 6
    },
    "study_room/chairs": {
        "queries": [
            "ergonomic office chair",
            "mesh office chair modern",
            "gaming chair RGB",
            "executive office chair leather"
        ],
        "count": 6
    },
    "study_room/bookshelves": {
        "queries": [
            "bookshelf study room",
            "wall mounted book shelf",
            "ladder bookshelf modern"
        ],
        "count": 5
    },

    # ==========================================
    # 👶 KIDS FURNITURE (40+ images)
    # ==========================================
    "kids_furniture/rooms": {
        "queries": [
            "kids room interior design colorful",
            "children bedroom furniture",
            "boy room design modern",
            "girl room design pink",
            "kids room small space"
        ],
        "count": 6
    },
    "kids_furniture/beds": {
        "queries": [
            "bunk bed children modern",
            "kids bed colorful",
            "baby crib wooden",
            "toddler bed small"
        ],
        "count": 5
    },
    "kids_furniture/study": {
        "queries": [
            "kids study table colorful",
            "children desk chair set"
        ],
        "count": 5
    },

    # ==========================================
    # 📦 STORAGE FURNITURE (40+ images)
    # ==========================================
    "storage/wardrobes": {
        "queries": [
            "wooden wardrobe modern",
            "sliding door wardrobe",
            "walk in closet design",
            "2 door wardrobe wooden",
            "3 door wardrobe large"
        ],
        "count": 6
    },
    "storage/shoe_racks": {
        "queries": [
            "shoe rack modern entryway",
            "shoe cabinet wooden"
        ],
        "count": 4
    },
    "storage/cabinets": {
        "queries": [
            "storage cabinet modern",
            "multipurpose cabinet wooden",
            "chest of drawers bedroom"
        ],
        "count": 5
    },

    # ==========================================
    # 🏢 OFFICE FURNITURE (40+ images)
    # ==========================================
    "office_furniture/desks": {
        "queries": [
            "office desk professional",
            "executive desk modern",
            "reception desk office",
            "conference table office"
        ],
        "count": 6
    },
    "office_furniture/chairs": {
        "queries": [
            "office chair professional",
            "conference room chairs",
            "visitor chair office"
        ],
        "count": 6
    },
    "office_furniture/conference": {
        "queries": [
            "conference room modern",
            "meeting room office furniture"
        ],
        "count": 5
    },

    # ==========================================
    # 🧊 HOME APPLIANCES (80+ images)
    # ==========================================
    "appliances/refrigerator": {
        "queries": [
            "modern refrigerator kitchen",
            "double door fridge stainless",
            "single door refrigerator",
            "side by side refrigerator",
            "mini fridge compact"
        ],
        "count": 6
    },
    "appliances/washing_machine": {
        "queries": [
            "washing machine front load",
            "top load washing machine",
            "washer dryer modern",
            "laundry room washing machine"
        ],
        "count": 5
    },
    "appliances/ac": {
        "queries": [
            "split air conditioner wall",
            "window air conditioner",
            "AC unit room modern",
            "air conditioner living room"
        ],
        "count": 5
    },
    "appliances/tv": {
        "queries": [
            "smart TV living room wall",
            "flat screen TV modern",
            "LED TV large screen",
            "television entertainment setup",
            "TV on stand modern"
        ],
        "count": 6
    },
    "appliances/microwave": {
        "queries": [
            "microwave oven kitchen",
            "convection microwave modern"
        ],
        "count": 4
    },
    "appliances/water_purifier": {
        "queries": [
            "water purifier modern kitchen",
            "RO water filter"
        ],
        "count": 3
    },
    "appliances/air_purifier": {
        "queries": [
            "air purifier room modern",
            "air purifier living room"
        ],
        "count": 3
    },
    "appliances/kitchen": {
        "queries": [
            "kitchen appliances modern",
            "gas stove kitchen",
            "induction cooktop modern",
            "mixer grinder kitchen",
            "toaster oven kitchen"
        ],
        "count": 4
    },

    # ==========================================
    # 🛋️ MATTRESS (25+ images)
    # ==========================================
    "mattress": {
        "queries": [
            "white mattress bedroom",
            "foam mattress comfortable",
            "spring mattress bed",
            "orthopedic mattress",
            "mattress on bed frame"
        ],
        "count": 5
    },

    # ==========================================
    # 🪑 INDIVIDUAL CHAIRS (30+ images)
    # ==========================================
    "chairs/accent": {
        "queries": [
            "accent chair living room",
            "arm chair modern fabric",
            "lounge chair contemporary"
        ],
        "count": 5
    },
    "chairs/bean_bags": {
        "queries": [
            "bean bag modern room",
            "bean bag chair colorful"
        ],
        "count": 4
    },
    "chairs/bar_stools": {
        "queries": [
            "bar stool modern kitchen",
            "counter stool wooden"
        ],
        "count": 4
    },

    # ==========================================
    # 🪞 TABLES (30+ images)
    # ==========================================
    "tables/console": {
        "queries": [
            "console table entryway",
            "hallway table modern"
        ],
        "count": 4
    },
    "tables/end_tables": {
        "queries": [
            "end table modern",
            "side table lamp living room"
        ],
        "count": 4
    },
    "tables/folding": {
        "queries": [
            "folding table portable",
            "compact folding desk"
        ],
        "count": 3
    },

    # ==========================================
    # 📦 COMBOS / PACKAGES (40+ images)
    # ==========================================
    "combos/1bhk": {
        "queries": [
            "1BHK furnished apartment India",
            "small apartment fully furnished",
            "studio apartment interior",
            "compact apartment furniture"
        ],
        "count": 6
    },
    "combos/2bhk": {
        "queries": [
            "2BHK apartment interior modern",
            "two bedroom apartment furnished",
            "family apartment interior"
        ],
        "count": 6
    },
    "combos/3bhk": {
        "queries": [
            "luxury apartment interior",
            "spacious apartment furnished",
            "3 bedroom apartment modern"
        ],
        "count": 5
    },
    "combos/bachelor": {
        "queries": [
            "bachelor pad interior modern",
            "single room furnished modern"
        ],
        "count": 5
    },

    # ==========================================
    # 🏙️ CITY LANDMARKS (30+ images)
    # ==========================================
    "cities/delhi": {
        "queries": ["Red Fort Delhi India landmark", "India Gate Delhi"],
        "count": 3
    },
    "cities/bangalore": {
        "queries": ["Vidhana Soudha Bangalore", "Bangalore city skyline India"],
        "count": 3
    },
    "cities/pune": {
        "queries": ["Pune city India landmark", "Shaniwar Wada Pune"],
        "count": 3
    },
    "cities/mumbai": {
        "queries": ["Gateway of India Mumbai", "Mumbai skyline Bandra Worli Sea Link"],
        "count": 3
    },
    "cities/hyderabad": {
        "queries": ["Charminar Hyderabad India", "Hyderabad city skyline HITEC"],
        "count": 3
    },
    "cities/gurgaon": {
        "queries": ["Gurgaon Cyber Hub skyline", "Gurugram city buildings India"],
        "count": 3
    },
    "cities/chennai": {
        "queries": ["Chennai Marina Beach lighthouse", "Chennai city temple India"],
        "count": 3
    },
    "cities/noida": {
        "queries": ["Noida city skyline India", "Noida sector buildings"],
        "count": 2
    },
    "cities/faridabad": {
        "queries": ["Faridabad Haryana India", "Surajkund Faridabad"],
        "count": 2
    },
    "cities/ghaziabad": {
        "queries": ["Ghaziabad city UP India"],
        "count": 2
    },
    "cities/hosur": {
        "queries": ["Hosur Tamil Nadu India"],
        "count": 2
    },
    "cities/navi_mumbai": {
        "queries": ["Navi Mumbai skyline palm beach"],
        "count": 2
    },
    "cities/thane": {
        "queries": ["Thane city lake Maharashtra"],
        "count": 2
    },

    # ==========================================
    # 🖼️ WEBSITE BANNERS & HEROES (30+ images)
    # ==========================================
    "banners/hero": {
        "queries": [
            "modern furniture showroom wide",
            "luxury interior design panoramic",
            "furniture store interior modern",
            "home decor apartment panoramic",
            "interior design studio modern"
        ],
        "count": 6
    },
    "banners/seasonal": {
        "queries": [
            "festive home decor Diwali",
            "home decoration celebration",
            "monsoon cozy home interior"
        ],
        "count": 5
    },
    "banners/lifestyle": {
        "queries": [
            "young couple new apartment",
            "family living room happy",
            "work from home lifestyle",
            "moving into new apartment boxes"
        ],
        "count": 5
    },

    # ==========================================
    # 🏠 ROOM SCENES / LIFESTYLE (40+ images)
    # ==========================================
    "lifestyle/apartments": {
        "queries": [
            "modern apartment interior India",
            "luxury flat interior design",
            "affordable apartment furnished",
            "newly furnished apartment",
            "apartment balcony furniture"
        ],
        "count": 6
    },
    "lifestyle/kitchen": {
        "queries": [
            "modern kitchen interior",
            "modular kitchen design",
            "small kitchen Indian apartment",
            "kitchen with appliances"
        ],
        "count": 5
    },
    "lifestyle/bathroom": {
        "queries": [
            "modern bathroom interior",
            "bathroom accessories organized"
        ],
        "count": 4
    },

    # ==========================================
    # 🎯 DISCOUNT / SALE IMAGERY (15+ images)
    # ==========================================
    "promotional/sale": {
        "queries": [
            "furniture sale showroom",
            "discount shopping happy",
            "clearance sale furniture"
        ],
        "count": 5
    },

    # ==========================================
    # 🚚 DELIVERY / SERVICE (15+ images)
    # ==========================================
    "services/delivery": {
        "queries": [
            "furniture delivery truck",
            "moving furniture apartment",
            "furniture assembly installation"
        ],
        "count": 5
    },
    "services/customer": {
        "queries": [
            "customer service support",
            "happy customer new home",
            "thumbs up satisfied customer"
        ],
        "count": 4
    },
}


def download_image(url, filepath):
    """Download a single image from URL to filepath."""
    for attempt in range(MAX_RETRIES):
        try:
            req = urllib.request.Request(url)
            req.add_header("User-Agent", "FurnitureImageDownloader/1.0")
            
            with urllib.request.urlopen(req, timeout=60) as response:
                with open(filepath, 'wb') as f:
                    while True:
                        chunk = response.read(8192)
                        if not chunk:
                            break
                        f.write(chunk)
            return True
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(2)
            else:
                print(f"      ❌ Failed after {MAX_RETRIES} attempts: {e}")
                return False
    return False


def search_pexels(query, per_page=10, page=1):
    """Search Pexels API for images."""
    encoded_query = urllib.parse.quote(query)
    url = f"https://api.pexels.com/v1/search?query={encoded_query}&per_page={per_page}&page={page}"
    
    req = urllib.request.Request(url)
    req.add_header("Authorization", PEXELS_API_KEY)
    req.add_header("User-Agent", "Mozilla/5.0")
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode())
            return data.get("photos", [])
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("\n" + "=" * 60)
            print("❌ INVALID API KEY!")
            print("   Get a free key from: https://www.pexels.com/api/")
            print("=" * 60)
            sys.exit(1)
        elif e.code == 429:
            print("      ⏳ Rate limited. Waiting 60 seconds...")
            time.sleep(60)
            return search_pexels(query, per_page, page)
        else:
            print(f"      ❌ HTTP Error {e.code}: {e.reason}")
            return []
    except Exception as e:
        print(f"      ❌ Error: {e}")
        return []


def get_file_size_mb(filepath):
    """Get file size in MB."""
    return os.path.getsize(filepath) / (1024 * 1024)


def main():
    print("=" * 60)
    print("🛋️  FURNITURE IMAGE MEGA DOWNLOADER")
    print("    1000+ High-Quality Images")
    print("=" * 60)
    
    # Check API key
    if PEXELS_API_KEY == "YOUR_API_KEY_HERE":
        print("\n❌ ERROR: Please set your Pexels API key!")
        print("   1. Go to: https://www.pexels.com/api/")
        print("   2. Sign up for free (no credit card)")
        print("   3. Get your API key")
        print("   4. Open this file and replace 'YOUR_API_KEY_HERE'")
        return
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Calculate total expected images
    total_expected = sum(
        len(config["queries"]) * config["count"] 
        for config in FURNITURE_CATEGORIES.values()
    )
    
    total_downloaded = 0
    total_skipped = 0
    total_failed = 0
    total_size_mb = 0
    
    print(f"\n📁 Save location: {OUTPUT_DIR}")
    print(f"📋 Categories: {len(FURNITURE_CATEGORIES)}")
    print(f"🖼️  Expected images: ~{total_expected}")
    print(f"💾 Drive space: 5TB available")
    print(f"📐 Image quality: {IMAGE_SIZE}")
    print("-" * 60)
    
    start_time = time.time()
    category_num = 0
    
    for category_path, config in FURNITURE_CATEGORIES.items():
        category_num += 1
        category_dir = os.path.join(OUTPUT_DIR, category_path)
        os.makedirs(category_dir, exist_ok=True)
        
        queries = config["queries"]
        count = config["count"]
        
        display_name = category_path.replace("/", " > ").upper().replace("_", " ")
        print(f"\n[{category_num}/{len(FURNITURE_CATEGORIES)}] 📂 {display_name}")
        
        img_num = 1
        cat_downloaded = 0
        
        for query in queries:
            print(f"   🔍 \"{query}\" (fetching {count} images)")
            
            photos = search_pexels(query, count)
            
            if not photos:
                print(f"      ⚠️  No results")
                continue
            
            for photo in photos:
                # Get high quality image
                img_url = photo.get("src", {}).get(IMAGE_SIZE, "")
                if not img_url:
                    img_url = photo.get("src", {}).get("large", "")
                
                photographer = photo.get("photographer", "unknown")
                photo_id = photo.get("id", "unknown")
                
                if not img_url:
                    continue
                
                filename = f"{category_path.split('/')[-1]}_{img_num:03d}_pid{photo_id}.jpg"
                filepath = os.path.join(category_dir, filename)
                
                # Skip if already downloaded
                if os.path.exists(filepath):
                    print(f"      ⏭️  {filename} (exists)")
                    total_skipped += 1
                    img_num += 1
                    continue
                
                if download_image(img_url, filepath):
                    size_mb = get_file_size_mb(filepath)
                    total_size_mb += size_mb
                    total_downloaded += 1
                    cat_downloaded += 1
                    img_num += 1
                    print(f"      ✅ {filename} ({size_mb:.1f} MB) by {photographer}")
                else:
                    total_failed += 1
                
                time.sleep(DELAY_BETWEEN_REQUESTS)
        
        print(f"   📊 {cat_downloaded} images saved to /{category_path}/")
    
    elapsed = time.time() - start_time
    elapsed_min = elapsed / 60
    
    print("\n" + "=" * 60)
    print("🎉 DOWNLOAD COMPLETE!")
    print("=" * 60)
    print(f"   ✅ Downloaded : {total_downloaded} images")
    print(f"   ⏭️  Skipped   : {total_skipped} (already existed)")
    print(f"   ❌ Failed     : {total_failed}")
    print(f"   💾 Total size : {total_size_mb:.1f} MB ({total_size_mb/1024:.2f} GB)")
    print(f"   ⏱️  Time taken : {elapsed_min:.1f} minutes")
    print(f"   📁 Location   : {OUTPUT_DIR}")
    print("=" * 60)
    
    # Generate README with full folder structure
    readme_path = os.path.join(OUTPUT_DIR, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write("# 🛋️ Downloaded Furniture Images\n\n")
        f.write(f"**Total Images**: {total_downloaded}\n")
        f.write(f"**Total Size**: {total_size_mb:.1f} MB\n")
        f.write(f"**Source**: [Pexels](https://www.pexels.com/) - Free for commercial use\n\n")
        f.write("## 📁 Folder Structure\n\n")
        f.write("```\n")
        f.write("downloaded_images/\n")
        for cat_path in sorted(FURNITURE_CATEGORIES.keys()):
            cat_dir = os.path.join(OUTPUT_DIR, cat_path)
            if os.path.exists(cat_dir):
                count = len([f for f in os.listdir(cat_dir) if f.endswith('.jpg')])
                parts = cat_path.split("/")
                indent = "  " * (len(parts) - 1)
                f.write(f"  {indent}├── {parts[-1]}/ ({count} images)\n")
        f.write("```\n\n")
        f.write("## 📜 License\n\n")
        f.write("All images from [Pexels](https://www.pexels.com/license/).\n")
        f.write("✅ Free for personal and commercial use\n")
        f.write("✅ No attribution required (but appreciated)\n")
    
    print(f"\n📝 Summary: {readme_path}")


if __name__ == "__main__":
    main()
