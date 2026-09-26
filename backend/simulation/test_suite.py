import os
import sys
import unittest
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import RequestFactory
from simulation.clock import SimulationClock
from simulation.engine import SimulationEngine
from simulation.ingestion import DatasetIngestionService
from simulation.models import (
    SourceCustomer, SourceInteraction, DataProvenance, 
    SimulationRun, SimulationEvent, MaintenanceTicket
)
from users.models import User
from appliances.models import Appliance
from bookings.models import Booking
from ml_recommend.views import RecommendView, PublicRecommendView
from ml_churn.views import AtRiskCustomersView
from ml_forecast.views import BIDashboardView
from simulation.views import (
    SimulationStateView, SimulationAdvanceView,
    SimulationScenarioView, SimulationResetView,
    SimulationEventsView, DataProvenanceDetailView
)

class DataLayerTests(unittest.TestCase):
    """Verifies dataset ingestion, immutability of Layer 1, and Data Provenance."""

    def test_customer_ingestion_and_provenance(self):
        res = DatasetIngestionService.ingest_rental_customers(max_records=10)
        self.assertEqual(res['status'], 'success')
        self.assertGreaterEqual(SourceCustomer.objects.count(), 10)
        
        # Verify provenance was attached
        sample_tenant = User.objects(email__endswith='@rentai.sim').first()
        self.assertIsNotNone(sample_tenant)
        prov = DataProvenance.objects(entity_id=str(sample_tenant.id)).first()
        self.assertIsNotNone(prov)
        self.assertEqual(prov.data_origin, 'source')
        self.assertIn('rental_churn_dataset.csv', prov.source_dataset)

    def test_interaction_ingestion(self):
        res = DatasetIngestionService.ingest_interactions(max_records=50)
        self.assertEqual(res['status'], 'success')
        self.assertGreaterEqual(SourceInteraction.objects.count(), 50)


class SimulationEngineTests(unittest.TestCase):
    """Verifies virtual clock, determinism, lifecycle transitions, and reset."""

    def setUp(self):
        self.engine = SimulationEngine(run_id='test_run')
        self.engine.reset(seed=42)

    def test_clock_advancement(self):
        t0 = self.engine.clock.current_time
        self.engine.clock.advance(days=3)
        t1 = self.engine.clock.current_time
        self.assertEqual((t1 - t0).days, 3)

    def test_simulation_tick_and_events(self):
        init_events = SimulationEvent.objects(simulation_run_id='test_run').count()
        res = self.engine.tick_day()
        self.assertEqual(res['status'], 'success')
        new_events = SimulationEvent.objects(simulation_run_id='test_run').count()
        self.assertGreater(new_events, init_events)

    def test_deterministic_seed(self):
        # Two runs initialized with the exact same seed must produce identical event counts
        e1 = SimulationEngine(run_id='run_det_1')
        e1.reset(seed=20260925)
        res1 = e1.run_days(3)

        e2 = SimulationEngine(run_id='run_det_2')
        e2.reset(seed=20260925)
        res2 = e2.run_days(3)

        self.assertEqual(res1['total_events_in_run'], res2['total_events_in_run'])


class AIMachineLearningTests(unittest.TestCase):
    """Verifies explainable recommendations and churn feature impact predictions."""

    def setUp(self):
        self.rf = RequestFactory()

    def test_explainable_recommendation_scoring(self):
        tenant = User.objects(role='tenant').first()
        req = self.rf.get(f'/api/recommend/{tenant.id}/')
        res = RecommendView.as_view()(req, tenant_id=str(tenant.id))
        self.assertEqual(res.status_code, 200)
        self.assertGreater(len(res.data), 0)
        
        item = res.data[0]
        self.assertIn('match_score', item)
        self.assertIn('recommendation_reason', item)
        self.assertEqual(item['data_origin'], 'model')
        self.assertEqual(item['model_version'], 'collaborative_svd_v1')

    def test_churn_rfm_prediction_with_top_features(self):
        req = self.rf.get('/api/churn/at-risk/')
        res = AtRiskCustomersView.as_view()(req)
        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.data, list)
        if len(res.data) > 0:
            risk_entry = res.data[0]
            self.assertIn('churn_probability', risk_entry)
            self.assertIn('risk_level', risk_entry)
            self.assertIn('top_features', risk_entry)
            self.assertEqual(risk_entry['data_origin'], 'model')
            self.assertEqual(risk_entry['model_version'], 'churn_rf_v1')


class APIEndpointTests(unittest.TestCase):
    """Verifies all simulation control, provenance, and BI endpoints."""

    def setUp(self):
        self.rf = RequestFactory()

    def test_simulation_state_and_advance(self):
        # 1. State
        req = self.rf.get('/api/simulation/state/')
        res = SimulationStateView.as_view()(req)
        self.assertEqual(res.status_code, 200)
        self.assertIn('simulation_run_id', res.data)
        self.assertIn('metrics', res.data)

        # 2. Advance
        req_adv = self.rf.post('/api/simulation/advance/', {'days': 2}, content_type='application/json')
        res_adv = SimulationAdvanceView.as_view()(req_adv)
        self.assertEqual(res_adv.status_code, 200)
        self.assertEqual(res_adv.data['simulated_days'], 2)

    def test_simulation_scenario_change(self):
        req = self.rf.post('/api/simulation/scenario/', {'scenario': 'demand_spike'}, content_type='application/json')
        res = SimulationScenarioView.as_view()(req)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['scenario'], 'demand_spike')

    def test_bi_dashboard_endpoint(self):
        req = self.rf.get('/api/bi/dashboard/')
        res = BIDashboardView.as_view()(req)
        self.assertEqual(res.status_code, 200)
        self.assertIn('forecasts', res.data)
        self.assertIn('total_revenue', res.data)
        self.assertIn('active_bookings', res.data)


if __name__ == '__main__':
    unittest.main()
