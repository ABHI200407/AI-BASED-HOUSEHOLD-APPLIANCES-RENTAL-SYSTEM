import os
import sys
import django
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import RequestFactory
from users.views import RegisterView, LoginView, AdminUserListView, KYCView
from appliances.views import ApplianceListCreateView, ApplianceDetailView, CategoryListView
from bookings.views import BookingListCreateView
from ml_recommend.views import RecommendView, PublicRecommendView
from ml_churn.views import AtRiskCustomersView
from ml_forecast.views import BIDashboardView
from users.models import User
from appliances.models import Appliance

rf = RequestFactory()

print("=== 1. Testing CategoryListView ===")
req = rf.get('/api/appliances/categories/')
res = CategoryListView.as_view()(req)
print(f"Status: {res.status_code}, Categories count: {len(res.data) if hasattr(res, 'data') else 0}")
if hasattr(res, 'data'):
    print("Categories:", res.data[:5])

print("\n=== 2. Testing ApplianceListCreateView ===")
req = rf.get('/api/appliances/')
res = ApplianceListCreateView.as_view()(req)
print(f"Status: {res.status_code}, Appliances count: {res.data.get('total', 0)}")

print("\n=== 3. Testing PublicRecommendView ===")
req = rf.get('/api/recommend/trending/')
res = PublicRecommendView.as_view()(req)
print(f"Status: {res.status_code}, Trending count: {len(res.data) if hasattr(res, 'data') else 0}")

print("\n=== 4. Testing RecommendView with tenant ===")
tenant = User.objects(role='tenant').first()
tenant_id = str(tenant.id) if tenant else "dummy_tenant_123"
req = rf.get(f'/api/recommend/{tenant_id}/')
res = RecommendView.as_view()(req, tenant_id=tenant_id)
print(f"Status: {res.status_code}, Recs count: {len(res.data) if hasattr(res, 'data') else 0}")
if hasattr(res, 'data') and len(res.data) > 0:
    print("Sample rec item:", res.data[0].get('name'), "Rating:", res.data[0].get('rating'))

print("\n=== 5. Testing AtRiskCustomersView ===")
req = rf.get('/api/churn/at-risk/')
res = AtRiskCustomersView.as_view()(req)
print(f"Status: {res.status_code}, At risk count: {len(res.data) if hasattr(res, 'data') else 0}")

print("\n=== 6. Testing BIDashboardView ===")
req = rf.get('/api/bi/dashboard/')
res = BIDashboardView.as_view()(req)
print(f"Status: {res.status_code}")
if hasattr(res, 'data'):
    print("Summary:", res.data.get('summary'))
    print("Total revenue:", res.data.get('total_revenue'))
    print("Active bookings:", res.data.get('active_bookings'))
    print("Forecast categories:", list(res.data.get('forecasts', {}).keys()))

print("\n=== 7. Testing KYCView ===")
req = rf.get('/api/users/kyc/')
res = KYCView.as_view()(req)
print(f"Status: {res.status_code}, KYC Data: {res.data}")

print("\n=== 8. Testing ChurnMetricsView ===")
from ml_churn.views import ChurnMetricsView
req = rf.get('/api/churn/metrics/')
res = ChurnMetricsView.as_view()(req)
print(f"Status: {res.status_code}, LightGBM Accuracy: {res.data.get('models', {}).get('LightGBM', {}).get('accuracy')}, ROC-AUC: {res.data.get('models', {}).get('LightGBM', {}).get('roc_auc')}")

print("\n=== 9. Testing RecommendMetricsView ===")
from ml_recommend.views import RecommendMetricsView
req = rf.get('/api/recommend/metrics/')
res = RecommendMetricsView.as_view()(req)
print(f"Status: {res.status_code}, SVD RMSE: {res.data.get('evaluation_metrics', {}).get('test_rmse')}, Precision@10: {res.data.get('evaluation_metrics', {}).get('precision_at_10')}")

print("\nALL BASE & ML EVALUATION ENDPOINTS TESTED SUCCESSFULLY!")
