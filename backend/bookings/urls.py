from django.urls import path
from .views import BookingListCreateView, BookingDetailView, BulkBookingCreateView

urlpatterns = [
    path('', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bulk/', BulkBookingCreateView.as_view(), name='booking-bulk-create'),
    path('<str:pk>/', BookingDetailView.as_view(), name='booking-detail'),
]
