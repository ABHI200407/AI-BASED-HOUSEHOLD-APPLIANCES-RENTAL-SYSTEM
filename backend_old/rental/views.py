from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Sum, Q
from .models import Category, Appliance, Customer, Booking
from .serializers import CategorySerializer, ApplianceSerializer, CustomerSerializer, BookingSerializer


# ─── Dashboard Stats ────────────────────────────────────────────────
class DashboardStatsView(APIView):
    def get(self, request):
        total_appliances = Appliance.objects.count()
        available = Appliance.objects.filter(status='available').count()
        rented = Appliance.objects.filter(status='rented').count()
        total_customers = Customer.objects.count()
        total_bookings = Booking.objects.count()
        active_bookings = Booking.objects.filter(status__in=['confirmed', 'active']).count()
        total_revenue = Booking.objects.filter(payment_status='paid').aggregate(
            total=Sum('total_amount'))['total'] or 0

        return Response({
            'total_appliances': total_appliances,
            'available': available,
            'rented': rented,
            'total_customers': total_customers,
            'total_bookings': total_bookings,
            'active_bookings': active_bookings,
            'total_revenue': float(total_revenue),
        })


# ─── Category Views ──────────────────────────────────────────────────
class CategoryListView(APIView):
    def get(self, request):
        cats = Category.objects.all()
        return Response(CategorySerializer(cats, many=True).data)

    def post(self, request):
        ser = CategorySerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Appliance Views ─────────────────────────────────────────────────
class ApplianceListView(APIView):
    def get(self, request):
        qs = Appliance.objects.all()
        category = request.query_params.get('category')
        appliance_status = request.query_params.get('status')
        search = request.query_params.get('search')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        sort = request.query_params.get('sort')

        if category:
            qs = qs.filter(category__id=category)
        if appliance_status:
            qs = qs.filter(status=appliance_status)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(brand__icontains=search))
        if min_price:
            qs = qs.filter(monthly_rent__gte=min_price)
        if max_price:
            qs = qs.filter(monthly_rent__lte=max_price)
            
        if sort == 'price_asc':
            qs = qs.order_by('monthly_rent')
        elif sort == 'price_desc':
            qs = qs.order_by('-monthly_rent')
            
        return Response(ApplianceSerializer(qs, many=True).data)

    def post(self, request):
        ser = ApplianceSerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplianceDetailView(APIView):
    def get_object(self, pk):
        try:
            return Appliance.objects.get(pk=pk)
        except Appliance.DoesNotExist:
            return None

    def get(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ApplianceSerializer(obj).data)

    def put(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        ser = ApplianceSerializer(obj, data=request.data, partial=True)
        if ser.is_valid():
            ser.save()
            return Response(ser.data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Customer Views ──────────────────────────────────────────────────
class CustomerListView(APIView):
    def get(self, request):
        customers = Customer.objects.all()
        return Response(CustomerSerializer(customers, many=True).data)

    def post(self, request):
        ser = CustomerSerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Booking Views ───────────────────────────────────────────────────
class BookingListView(APIView):
    def get(self, request):
        bookings = Booking.objects.select_related('customer', 'appliance').all().order_by('-created_at')
        return Response(BookingSerializer(bookings, many=True).data)

    def post(self, request):
        ser = BookingSerializer(data=request.data)
        if ser.is_valid():
            booking = ser.save()
            # Mark appliance as rented
            booking.appliance.status = 'rented'
            booking.appliance.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingDetailView(APIView):
    def get_object(self, pk):
        try:
            return Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return None

    def put(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        ser = BookingSerializer(obj, data=request.data, partial=True)
        if ser.is_valid():
            ser.save()
            return Response(ser.data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
