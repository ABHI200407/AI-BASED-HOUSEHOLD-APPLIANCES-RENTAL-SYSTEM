from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from bookings.models import Booking
from appliances.models import Appliance
from datetime import datetime

class BookingListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'tenant':
            bookings = Booking.objects(tenant_id=request.user.id)
        elif request.user.role == 'owner':
            appliances = Appliance.objects(owner_id=request.user.id)
            app_ids = [app.id for app in appliances]
            bookings = Booking.objects(appliance_id__in=app_ids)
        else:
            bookings = []

        data = []
        for b in bookings:
            data.append({
                'id': str(b.id),
                'tenant_id': str(b.tenant_id.id),
                'tenant_name': b.tenant_id.full_name,
                'appliance_id': str(b.appliance_id.id),
                'appliance_name': b.appliance_id.name,
                'start_date': b.start_date.isoformat(),
                'end_date': b.end_date.isoformat(),
                'status': b.status,
                'total_amount': b.total_amount,
                'created_at': b.created_at.isoformat()
            })
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.role != 'tenant':
            return Response({"error": "Only tenants can create bookings"}, status=status.HTTP_403_FORBIDDEN)
            
        app_id = request.data.get('appliance_id')
        start_date_str = request.data.get('start_date')
        end_date_str = request.data.get('end_date')

        if not all([app_id, start_date_str, end_date_str]):
            return Response({"error": "appliance_id, start_date, and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        appliance = Appliance.objects(id=app_id).first()
        if not appliance:
            return Response({"error": "Appliance not found"}, status=status.HTTP_404_NOT_FOUND)
            
        if not appliance.available:
            return Response({"error": "Appliance is currently not available"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
        except ValueError:
            return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

        delta = (end_date.date() - start_date.date()).days
        if delta < 1:
            return Response({"error": "End date must be at least 1 day after start date"}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = delta * appliance.price_per_day

        booking = Booking(
            tenant_id=request.user.id,
            appliance_id=appliance.id,
            start_date=start_date,
            end_date=end_date,
            total_amount=total_amount,
            status='requested'
        )
        booking.save()
        return Response({"message": "Booking requested successfully", "id": str(booking.id)}, status=status.HTTP_201_CREATED)

class BulkBookingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'tenant':
            return Response({"error": "Only tenants can create bookings"}, status=status.HTTP_403_FORBIDDEN)
            
        items = request.data.get('items', [])
        if not items:
            return Response({"error": "Items list is required"}, status=status.HTTP_400_BAD_REQUEST)

        created_bookings = []
        for item in items:
            app_id = item.get('appliance_id')
            start_date_str = item.get('start_date')
            end_date_str = item.get('end_date')

            appliance = Appliance.objects(id=app_id).first()
            if not appliance or not appliance.available:
                continue

            try:
                start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
                end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
            except ValueError:
                continue

            delta = (end_date.date() - start_date.date()).days
            if delta < 1:
                continue

            total_amount = delta * appliance.price_per_day

            booking = Booking(
                tenant_id=request.user.id,
                appliance_id=appliance.id,
                start_date=start_date,
                end_date=end_date,
                total_amount=total_amount,
                status='requested'
            )
            booking.save()
            created_bookings.append(str(booking.id))

        return Response({"message": f"{len(created_bookings)} bookings created successfully", "ids": created_bookings}, status=status.HTTP_201_CREATED)

class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        booking = Booking.objects(id=pk).first()
        if not booking:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
            
        new_status = request.data.get('status')
        if not new_status:
            return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)

        appliance = booking.appliance_id

        # Tenant can only cancel requested bookings
        if request.user.role == 'tenant':
            if str(booking.tenant_id.id) != str(request.user.id):
                return Response({"error": "Not your booking"}, status=status.HTTP_403_FORBIDDEN)
            if new_status == 'cancelled' and booking.status == 'requested':
                booking.status = 'cancelled'
                booking.save()
                return Response({"message": "Booking cancelled"}, status=status.HTTP_200_OK)
            return Response({"error": "Cannot perform this action"}, status=status.HTTP_403_FORBIDDEN)

        # Owner can approve, reject, mark active, mark returned
        elif request.user.role == 'owner':
            if str(appliance.owner_id.id) != str(request.user.id):
                return Response({"error": "Not your appliance"}, status=status.HTTP_403_FORBIDDEN)
                
            valid_transitions = {
                'requested': ['approved', 'rejected'],
                'approved': ['active', 'cancelled'],
                'active': ['returned']
            }
            
            allowed = valid_transitions.get(booking.status, [])
            if new_status not in allowed:
                return Response({"error": f"Invalid status transition from {booking.status} to {new_status}"}, status=status.HTTP_400_BAD_REQUEST)
                
            booking.status = new_status
            booking.save()
            
            # Update appliance availability if needed
            if new_status == 'active':
                appliance.available = False
                appliance.save()
            elif new_status == 'returned':
                appliance.available = True
                appliance.save()
                
            return Response({"message": f"Booking {new_status}"}, status=status.HTTP_200_OK)
            
        return Response({"error": "Invalid role"}, status=status.HTTP_403_FORBIDDEN)
