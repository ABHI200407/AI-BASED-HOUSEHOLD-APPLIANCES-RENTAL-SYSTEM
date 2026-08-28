from django.urls import path
from .views import ApplianceListCreateView, ApplianceDetailView, CategoryListView

urlpatterns = [
    path('', ApplianceListCreateView.as_view(), name='appliance-list-create'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('<str:pk>/', ApplianceDetailView.as_view(), name='appliance-detail'),
]
