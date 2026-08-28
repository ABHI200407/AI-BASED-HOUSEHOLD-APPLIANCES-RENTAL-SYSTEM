import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rental.models import Appliance

print("Fixing prices back to Indian Rupee (INR) scale...")

appliances = Appliance.objects.all()
updated_count = 0

for app in appliances:
    # Set to realistic Indian rental prices (e.g., ₹500 to ₹5000 per month)
    # We round to nearest 50 for clean numbers
    app.monthly_rent = round(random.randint(500, 5000) / 50) * 50
    app.weekly_rent = max(150, int(app.monthly_rent * 0.35))
    app.daily_rent = max(50, int(app.monthly_rent * 0.1))
    
    # Deposit is typically 1-2 months rent
    app.deposit = app.monthly_rent * random.choice([1, 2])
    
    app.save()
    updated_count += 1

print(f"Successfully updated {updated_count} products with Indian pricing scale!")
