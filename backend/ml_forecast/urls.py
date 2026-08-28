from django.urls import path
from .views import BIDashboardView

urlpatterns = [
    path('dashboard/', BIDashboardView.as_view(), name='bi_dashboard'),
]
