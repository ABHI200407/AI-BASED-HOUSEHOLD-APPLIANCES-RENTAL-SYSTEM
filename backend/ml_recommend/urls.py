from django.urls import path
from .views import RecommendView, PublicRecommendView, RecommendMetricsView

urlpatterns = [
    path('trending/', PublicRecommendView.as_view(), name='trending'),   # guests
    path('metrics/', RecommendMetricsView.as_view(), name='recommend_metrics'), # formal evaluation metrics
    path('<str:tenant_id>/', RecommendView.as_view(), name='recommend'), # logged-in
]

