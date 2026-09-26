from django.urls import path
from .views import (
    SimulationStateView,
    SimulationAdvanceView,
    SimulationScenarioView,
    SimulationResetView,
    SimulationEventsView,
    DataProvenanceDetailView
)

urlpatterns = [
    path('state/', SimulationStateView.as_view(), name='simulation_state'),
    path('advance/', SimulationAdvanceView.as_view(), name='simulation_advance'),
    path('scenario/', SimulationScenarioView.as_view(), name='simulation_scenario'),
    path('reset/', SimulationResetView.as_view(), name='simulation_reset'),
    path('events/', SimulationEventsView.as_view(), name='simulation_events'),
    path('provenance/<str:entity_type>/<str:entity_id>/', DataProvenanceDetailView.as_view(), name='data_provenance'),
]
