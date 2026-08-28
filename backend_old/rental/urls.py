from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardStatsView.as_view(), name='dashboard'),
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('appliances/', views.ApplianceListView.as_view(), name='appliances'),
    path('appliances/<int:pk>/', views.ApplianceDetailView.as_view(), name='appliance-detail'),
    path('customers/', views.CustomerListView.as_view(), name='customers'),
    path('bookings/', views.BookingListView.as_view(), name='bookings'),
    path('bookings/<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
]
