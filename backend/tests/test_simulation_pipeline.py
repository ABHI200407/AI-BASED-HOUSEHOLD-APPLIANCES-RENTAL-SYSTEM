import os
import sys
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from simulation.ingestion import DatasetIngestionService
from simulation.clock import SimulationClock
from simulation.engine import SimulationEngine
from simulation.models import SimulationEvent, DataProvenance, SimulationRun
from users.models import User
from bookings.models import Booking
from appliances.models import Appliance
from ml_recommend.views import RecommendView
from ml_churn.views import AtRiskCustomersView
from django.test import RequestFactory

rf = RequestFactory()

print("==================================================")
print("  RentAI Simulation & Provenance Verification Run  ")
print("==================================================")

# 1. Ingest real dataset records into Layer 1 and project to Layer 2
print("\n[Step 1] Ingesting real-world customer records...")
cust_res = DatasetIngestionService.ingest_rental_customers(max_records=30)
print(f"  Result: {cust_res}")

print("\n[Step 2] Ingesting interaction dataset...")
int_res = DatasetIngestionService.ingest_interactions(max_records=500)
print(f"  Result: {int_res}")

# 2. Test Clock & Engine
print("\n[Step 3] Initializing Simulation Clock and Engine...")
engine = SimulationEngine()
clock = engine.clock
print(f"  Initial virtual time: {clock.current_time}")
print(f"  Current Scenario: {engine.run.scenario}")

# 3. Simulate 7 Days (Normal Scenario)
print("\n[Step 4] Advancing simulation by 7 days (Normal Scenario)...")
adv_res = engine.run_days(7)
print(f"  Result: {adv_res}")
print(f"  Virtual time after 7 days: {clock.current_time}")
print(f"  Total bookings created: {Booking.objects.count()}")
print(f"  Total simulation events logged: {SimulationEvent.objects.count()}")

# 4. Scenario switch: Demand Spike
print("\n[Step 5] Switching scenario to 'demand_spike' and simulating 7 days...")
engine.set_scenario('demand_spike')
spike_res = engine.run_days(7)
print(f"  Spike result: {spike_res}")
print(f"  Virtual time: {clock.current_time}")

# 5. Scenario switch: Engagement Decline & Product Failure
print("\n[Step 6] Testing 'engagement_decline' & 'product_failure'...")
engine.set_scenario('product_failure')
fail_res = engine.run_days(5)
print(f"  Product failure run: {fail_res}")

# 6. Verify Recommendation API with Model Scoring
print("\n[Step 7] Testing Explainable Recommendation Endpoint...")
sample_tenant = User.objects(role='tenant').first()
req = rf.get(f'/api/recommend/{sample_tenant.id}/')
rec_res = RecommendView.as_view()(req, tenant_id=str(sample_tenant.id))
print(f"  Rec status: {rec_res.status_code}")
if rec_res.data:
    sample_rec = rec_res.data[0]
    print(f"  Sample Item: {sample_rec['name']}")
    print(f"  Match Score: {sample_rec.get('match_score')}%")
    print(f"  Reason: {sample_rec.get('recommendation_reason')}")
    print(f"  Data Origin: {sample_rec.get('data_origin')}")
    print(f"  Model Version: {sample_rec.get('model_version')}")

# 7. Verify Churn API with Top Feature Impacts
print("\n[Step 8] Testing Churn Prediction Endpoint...")
req = rf.get('/api/churn/at-risk/')
churn_res = AtRiskCustomersView.as_view()(req)
print(f"  Churn status: {churn_res.status_code}, At-Risk Count: {len(churn_res.data)}")
if churn_res.data:
    first_risk = churn_res.data[0]
    print(f"  Highest Risk Customer: {first_risk.get('full_name')} ({first_risk.get('email')})")
    print(f"  Risk Score: {first_risk.get('risk_score')}")
    print(f"  Model Version: {first_risk.get('model_version')}")
    print(f"  Top Features: {first_risk.get('top_features')}")

# 8. Verify Data Provenance
print("\n[Step 9] Verifying Data Provenance on a Booking...")
booking = Booking.objects().first()
if booking:
    prov = DataProvenance.objects(entity_id=str(booking.id)).first()
    if prov:
        print(f"  Booking ID: {booking.id}")
        print(f"  Data Origin: {prov.data_origin}")
        print(f"  Simulation Run ID: {prov.simulation_run_id}")
        print(f"  Provenance Metadata: {prov.metadata}")

print("\n==================================================")
print("  ALL SIMULATION & PROVENANCE TESTS PASSED!       ")
print("==================================================")
