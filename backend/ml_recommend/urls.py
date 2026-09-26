from django.urls import path
from .views import RecommendView, PublicRecommendView

urlpatterns = [
    path('trending/', PublicRecommendView.as_view(), name='trending'),   # guests
    path('<str:tenant_id>/', RecommendView.as_view(), name='recommend'), # logged-in
]
