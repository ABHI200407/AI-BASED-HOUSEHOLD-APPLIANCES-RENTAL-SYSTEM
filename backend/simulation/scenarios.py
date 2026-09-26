"""
Scenarios configuration for RentAI Simulation.
Adjusts behavioral transition weights and event rates in a controlled, reproducible manner.
"""

SCENARIO_CONFIGS = {
    'normal': {
        'name': 'Normal Operation',
        'description': 'Standard empirically grounded customer browsing, steady rental lifecycles, and baseline maintenance rate.',
        'demand_multiplier': 1.0,
        'category_bias': {},
        'session_frequency_multiplier': 1.0,
        'maintenance_probability': 0.05,
        'early_return_probability': 0.08,
        'renewal_probability': 0.35,
    },
    'demand_spike': {
        'name': 'Summer Cooling Demand Spike',
        'description': 'Heatwave causes 3x surge in browsing and rental demand for Air Conditioners and Refrigerators.',
        'demand_multiplier': 2.8,
        'category_bias': {
            'AC': 3.5,
            'Refrigerator': 2.2,
        },
        'session_frequency_multiplier': 2.0,
        'maintenance_probability': 0.08,
        'early_return_probability': 0.03,
        'renewal_probability': 0.55,
    },
    'engagement_decline': {
        'name': 'Customer Engagement Decline',
        'description': 'Simulates platform inactivity, increased days between bookings, and reduced cart conversion to test churn alerts.',
        'demand_multiplier': 0.4,
        'category_bias': {},
        'session_frequency_multiplier': 0.3,
        'maintenance_probability': 0.04,
        'early_return_probability': 0.25,
        'renewal_probability': 0.10,
    },
    'product_failure': {
        'name': 'Hardware Defect & Failure Wave',
        'description': 'Sharp rise in maintenance requests and customer complaints on selected appliances (e.g., Washing Machines/Fans), leading to returns and higher churn risk.',
        'demand_multiplier': 0.8,
        'category_bias': {},
        'session_frequency_multiplier': 1.0,
        'maintenance_probability': 0.35,  # 35% of active rentals experience ticket
        'early_return_probability': 0.40,
        'renewal_probability': 0.05,
    }
}

def get_scenario_config(scenario_name='normal'):
    return SCENARIO_CONFIGS.get(scenario_name, SCENARIO_CONFIGS['normal'])
