import os
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from appliances.models import Appliance
from users.permissions import IsOwner

def save_uploaded_file(uploaded_file):
    if not os.path.exists(settings.MEDIA_ROOT):
        os.makedirs(settings.MEDIA_ROOT)
    ext = uploaded_file.name.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(settings.MEDIA_ROOT, filename)
    with open(filepath, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
    return f"{settings.MEDIA_URL}{filename}"

class ApplianceListCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        category = request.GET.get('category')
        search = request.GET.get('search')
        owner_id = request.GET.get('owner_id')
        
        try:
            page = int(request.GET.get('page', 1))
        except ValueError:
            page = 1
            
        try:
            limit = int(request.GET.get('limit', 20))
        except ValueError:
            limit = 20
            
        query = {}
        if category:
            query['category'] = category
        if search:
            query['name__icontains'] = search
        if owner_id:
            query['owner_id'] = owner_id
            
        skip = (page - 1) * limit
        total = Appliance.objects(**query).count()
        appliances = Appliance.objects(**query).skip(skip).limit(limit)
        data = []
        for app in appliances:
            data.append({
                'id': str(app.id),
                'name': app.name,
                'brand': app.brand,
                'category': app.category,
                'description': app.description,
                'price_per_day': app.price_per_day,
                'monthly_rent': app.monthly_rent,
                'weekly_rent': app.weekly_rent,
                'deposit': app.deposit,
                'rating': app.rating,
                'reviews_count': app.reviews_count,
                'images': app.images,
                'image_url': app.image_url,
                'location': app.location,
                'available': app.available,
                'owner_id': str(app.owner_id.id) if app.owner_id else None
            })
        return Response({
            'results': data,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        }, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.role != 'owner':
            return Response({"error": "Only owners can create appliances"}, status=status.HTTP_403_FORBIDDEN)
        
        name = request.data.get('name')
        category = request.data.get('category')
        price_per_day = request.data.get('price_per_day')
        description = request.data.get('description', '')
        location = request.data.get('location', '')
        
        if not all([name, category, price_per_day]):
            return Response({"error": "name, category, and price_per_day are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle images
        image_urls = []
        for key in request.FILES:
            for uploaded_file in request.FILES.getlist(key):
                image_urls.append(save_uploaded_file(uploaded_file))
                
        appliance = Appliance(
            owner_id=request.user,
            name=name,
            brand=request.data.get('brand', ''),
            category=category,
            description=description,
            price_per_day=float(price_per_day),
            monthly_rent=float(request.data.get('monthly_rent', 0) or 0),
            weekly_rent=float(request.data.get('weekly_rent', 0) or 0),
            deposit=float(request.data.get('deposit', 0) or 0),
            location=location,
            image_url=request.data.get('image_url', ''),
            images=image_urls
        )
        appliance.save()
        return Response({'id': str(appliance.id), 'message': 'Appliance created successfully'}, status=status.HTTP_201_CREATED)

class ApplianceDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        app = Appliance.objects(id=pk).first()
        if not app:
            return Response({"error": "Appliance not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            'id': str(app.id),
            'name': app.name,
            'brand': app.brand,
            'category': app.category,
            'description': app.description,
            'price_per_day': app.price_per_day,
            'monthly_rent': app.monthly_rent,
            'weekly_rent': app.weekly_rent,
            'deposit': app.deposit,
            'rating': app.rating,
            'reviews_count': app.reviews_count,
            'images': app.images,
            'image_url': app.image_url,
            'location': app.location,
            'available': app.available,
            'owner_id': str(app.owner_id.id) if app.owner_id else None
        }
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        app = Appliance.objects(id=pk).first()
        if not app:
            return Response({"error": "Appliance not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if request.user.role != 'owner' or str(app.owner_id.id) != str(request.user.id):
             return Response({"error": "You do not have permission to edit this appliance"}, status=status.HTTP_403_FORBIDDEN)
             
        app.name = request.data.get('name', app.name)
        app.brand = request.data.get('brand', app.brand)
        app.category = request.data.get('category', app.category)
        app.description = request.data.get('description', app.description)
        app.price_per_day = float(request.data.get('price_per_day', app.price_per_day))
        if 'monthly_rent' in request.data: app.monthly_rent = float(request.data.get('monthly_rent'))
        if 'weekly_rent' in request.data: app.weekly_rent = float(request.data.get('weekly_rent'))
        if 'deposit' in request.data: app.deposit = float(request.data.get('deposit'))
        if 'image_url' in request.data: app.image_url = request.data.get('image_url')
        app.location = request.data.get('location', app.location)
        if 'available' in request.data:
            # Handle string 'true'/'false' or bool
            val = request.data.get('available')
            app.available = val if isinstance(val, bool) else (str(val).lower() == 'true')
            
        app.save()
        return Response({"message": "Appliance updated"}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        app = Appliance.objects(id=pk).first()
        if not app:
            return Response({"error": "Appliance not found"}, status=status.HTTP_404_NOT_FOUND)
        
        is_owner = request.user.role == 'owner' and str(app.owner_id.id) == str(request.user.id)
        is_admin = request.user.role == 'admin'
        
        if not (is_owner or is_admin):
             return Response({"error": "You do not have permission to delete this appliance"}, status=status.HTTP_403_FORBIDDEN)
             
        app.delete()
        return Response({"message": "Appliance deleted"}, status=status.HTTP_204_NO_CONTENT)

class CategoryListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        categories = Appliance.objects().distinct('category')
        # Filter out empty or None
        categories = sorted([c for c in categories if c])
        return Response(categories, status=status.HTTP_200_OK)
