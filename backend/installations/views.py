from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from appliances.models import Appliance
from bookings.models import Booking
from .models import Installation
from bson.errors import InvalidId

def format_installation(inst):
    # Retrieve referenced documents
    booking = inst.booking_id
    # We might need to handle dereferencing if it's not automatically dereferenced
    return {
        'id': str(inst.id),
        'booking_id': str(booking.id),
        'appliance_name': booking.appliance_id.name if booking.appliance_id else '',
        'tenant_name': booking.tenant_id.full_name if booking.tenant_id else '',
        'technician_name': inst.technician_name,
        'scheduled_date': inst.scheduled_date.isoformat() if inst.scheduled_date else None,
        'status': inst.status,
        'notes': inst.notes,
        'completed_at': inst.completed_at.isoformat() if inst.completed_at else None,
        'created_at': inst.created_at.isoformat() if inst.created_at else None,
    }

class InstallationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'tenant':
            bookings = Booking.objects(tenant_id=user.id)
            installations = Installation.objects(booking_id__in=bookings)
        elif user.role == 'owner':
            appliances = Appliance.objects(owner_id=user.id)
            bookings = Booking.objects(appliance_id__in=appliances)
            installations = Installation.objects(booking_id__in=bookings)
        else: # admin
            installations = Installation.objects()
            
        data = [format_installation(inst) for inst in installations]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        if user.role != 'owner':
            return Response({'error': 'Only owners can create installations'}, status=status.HTTP_403_FORBIDDEN)
            
        booking_id = request.data.get('booking_id')
        scheduled_date_str = request.data.get('scheduled_date')
        technician_name = request.data.get('technician_name', '')
        notes = request.data.get('notes', '')
        
        if not booking_id or not scheduled_date_str:
            return Response({'error': 'booking_id and scheduled_date are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            booking = Booking.objects.get(id=booking_id)
        except (Booking.DoesNotExist, InvalidId):
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Validate booking belongs to owner's appliance
        if booking.appliance_id.owner_id.id != user.id:
            return Response({'error': 'Not authorized for this booking'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            scheduled_date = datetime.fromisoformat(scheduled_date_str.replace('Z', '+00:00'))
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
            
        installation = Installation(
            booking_id=booking,
            scheduled_date=scheduled_date,
            technician_name=technician_name,
            notes=notes
        )
        installation.save()
        
        return Response(format_installation(installation), status=status.HTTP_201_CREATED)

class InstallationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            inst = Installation.objects.get(id=pk)
            
            # Simple permission check
            user = request.user
            if user.role == 'tenant':
                if inst.booking_id.tenant_id.id != user.id:
                    return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            elif user.role == 'owner':
                if inst.booking_id.appliance_id.owner_id.id != user.id:
                    return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
                    
            return Response(format_installation(inst), status=status.HTTP_200_OK)
        except (Installation.DoesNotExist, InvalidId):
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        user = request.user
        if user.role not in ['owner', 'admin']:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            inst = Installation.objects.get(id=pk)
        except (Installation.DoesNotExist, InvalidId):
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
        if user.role == 'owner' and inst.booking_id.appliance_id.owner_id.id != user.id:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
        new_status = request.data.get('status')
        if new_status:
            inst.status = new_status
            if new_status == 'completed' and not inst.completed_at:
                inst.completed_at = datetime.utcnow()
                
        technician_name = request.data.get('technician_name')
        if technician_name is not None:
            inst.technician_name = technician_name
            
        notes = request.data.get('notes')
        if notes is not None:
            inst.notes = notes
            
        scheduled_date_str = request.data.get('scheduled_date')
        if scheduled_date_str:
            try:
                inst.scheduled_date = datetime.fromisoformat(scheduled_date_str.replace('Z', '+00:00'))
            except ValueError:
                return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
                
        inst.save()
        return Response(format_installation(inst), status=status.HTTP_200_OK)
