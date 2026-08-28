from django.urls import path
from .views import InstallationListCreateView, InstallationDetailView

urlpatterns = [
    path('', InstallationListCreateView.as_view(), name='installation_list_create'),
    path('<str:pk>/', InstallationDetailView.as_view(), name='installation_detail'),
]
