from datetime import datetime, timedelta
from .models import SimulationRun

class SimulationClock:
    """Manages virtual simulation time independently of wall-clock time."""

    def __init__(self, run_id='default_run'):
        self.run_id = run_id
        self._load_or_create()

    def _load_or_create(self):
        run = SimulationRun.objects(simulation_run_id=self.run_id).first()
        if not run:
            now = datetime(2026, 9, 25, 9, 0, 0)
            run = SimulationRun(
                simulation_run_id=self.run_id,
                seed=20260925,
                status='idle',
                scenario='normal',
                start_sim_time=now,
                current_sim_time=now,
                speed=10,
                total_ticks=0,
                total_events=0
            ).save()
        self.run = run

    @property
    def current_time(self):
        self.run.reload()
        return self.run.current_sim_time

    def advance(self, days=1, hours=0):
        """Advances virtual clock by a specified duration."""
        self.run.reload()
        delta = timedelta(days=days, hours=hours)
        self.run.current_sim_time += delta
        self.run.total_ticks += 1
        self.run.updated_at = datetime.utcnow()
        self.run.save()
        return self.run.current_sim_time

    def set_time(self, new_dt):
        self.run.reload()
        self.run.current_sim_time = new_dt
        self.run.updated_at = datetime.utcnow()
        self.run.save()
        return self.run.current_sim_time

    def reset(self, start_dt=None, seed=20260925, scenario='normal'):
        self.run.reload()
        init_time = start_dt or datetime(2026, 9, 25, 9, 0, 0)
        self.run.start_sim_time = init_time
        self.run.current_sim_time = init_time
        self.run.seed = seed
        self.run.scenario = scenario
        self.run.status = 'idle'
        self.run.total_ticks = 0
        self.run.total_events = 0
        self.run.updated_at = datetime.utcnow()
        self.run.save()
        return self.run
