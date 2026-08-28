from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from .permissions import IsAdmin
import mongoengine

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        full_name = data.get('full_name', '')
        
        if not email or not password or not role:
            return Response({'error': 'Email, password, and role are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if role not in ('admin', 'owner', 'tenant'):
            return Response({'error': 'Invalid role.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        if User.objects(email=email).first():
            return Response({'error': 'User with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User(
            email=email,
            role=role,
            full_name=full_name,
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )
        user.set_password(password)
        try:
            user.save()
            return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects(email=email).first()
        if not user or not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
        if not getattr(user, 'is_active', True):
            return Response({"error": "Account deactivated"}, status=status.HTTP_403_FORBIDDEN)

        # Generate tokens manually since we are not using Django's standard User
        refresh = RefreshToken()
        refresh['user_id'] = str(user.id)
        refresh['role'] = user.role
        refresh['email'] = user.email

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': user.role,
            'email': user.email,
            'full_name': user.full_name,
            'id': str(user.id)
        }, status=status.HTTP_200_OK)

class AdminUserListView(APIView):
    permission_classes = [IsAdmin]
    
    def get(self, request):
        users = User.objects()
        data = []
        for u in users:
            data.append({
                'id': str(u.id),
                'email': u.email,
                'full_name': getattr(u, 'full_name', ''),
                'role': u.role,
                'is_active': getattr(u, 'is_active', True),
                'date_joined': u.date_joined.isoformat() if u.date_joined else None
            })
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request):
        user_id = request.data.get('user_id')
        is_active = request.data.get('is_active')
        
        if not user_id or is_active is None:
            return Response({'error': 'user_id and is_active are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects(id=user_id).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
        user.is_active = is_active
        user.save()
        
        return Response({'message': f'User active status set to {is_active}'}, status=status.HTTP_200_OK)
