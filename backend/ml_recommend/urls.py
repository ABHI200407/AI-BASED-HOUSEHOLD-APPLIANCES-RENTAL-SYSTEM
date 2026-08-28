from django.urls import path
from .views import RecommendView

urlpatterns = [
    path('<str:tenant_id>/', RecommendView.as_view(), name='recommend'),
]
