import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rental.models import Appliance, Category

total_appliances = Appliance.objects.count()
appliances_with_images = Appliance.objects.exclude(image_url__isnull=True).exclude(image_url__exact='').count()

print(f"Total Appliances: {total_appliances}")
print(f"Total Appliances with Images: {appliances_with_images}")
print("-" * 40)

categories = Category.objects.all()
for c in categories:
    total_in_cat = c.appliance_set.count()
    with_img = c.appliance_set.exclude(image_url__isnull=True).exclude(image_url__exact='').count()
    if total_in_cat > 0:
        print(f"Category: {c.name.ljust(20)} | Images: {with_img}/{total_in_cat}")
    else:
        print(f"Category: {c.name.ljust(20)} | NO PRODUCTS")
