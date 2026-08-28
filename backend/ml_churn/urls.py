from django.urls import path
from .views import AtRiskCustomersView

urlpatterns = [
    path('at-risk/', AtRiskCustomersView.as_view(), name='at_risk_customers'),
]
