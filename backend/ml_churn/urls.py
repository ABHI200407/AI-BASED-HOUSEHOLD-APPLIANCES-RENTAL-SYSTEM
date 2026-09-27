from django.urls import path
from .views import AtRiskCustomersView, ChurnMetricsView

urlpatterns = [
    path('at-risk/', AtRiskCustomersView.as_view(), name='at_risk_customers'),
    path('metrics/', ChurnMetricsView.as_view(), name='churn_metrics'),
]

