from django.urls import path
from .views import RegisterView, LoginView, AdminUserListView, KYCView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_users'),
    path('kyc/', KYCView.as_view(), name='user_kyc'),
]
