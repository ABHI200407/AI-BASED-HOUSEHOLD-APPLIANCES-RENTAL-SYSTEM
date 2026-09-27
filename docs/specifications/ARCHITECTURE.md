# Architecture

## Repo layout (monorepo, two top-level folders)

```
appliance-rental-system/
├── backend/                    # Django project
│   ├── manage.py
│   ├── core/                   # Django project settings
│   ├── users/                  # auth app (JWT, 3 roles: admin/owner/tenant)
│   ├── appliances/             # appliance catalog CRUD app
│   ├── bookings/               # rental/booking flow app
│   ├── ml_recommend/           # recommendation engine app
│   ├── ml_forecast/            # demand forecasting / BI app
│   ├── ml_churn/                # churn prediction app
│   ├── media/                  # local appliance images
│   └── requirements.txt
├── frontend/                   # React app (create-react-app or Vite)
│   ├── src/
│   │   ├── pages/               # Login, TenantHome, OwnerDashboard, AdminDashboard, etc.
│   │   ├── components/
│   │   ├── api/                 # axios calls to Django REST endpoints
│   │   └── App.jsx
│   └── package.json
└── specs/                       # this folder — read-only reference, do not delete
```

## Backend app responsibilities
- `users`: custom User model (role field: admin/owner/tenant), JWT login/register endpoints
- `appliances`: Appliance MongoEngine document (category, price, owner_id, images, availability)
- `bookings`: Booking document (tenant_id, appliance_id, status, start_date, end_date, amount)
- `ml_recommend`: reads bookings+appliances, exposes `/api/recommend/<tenant_id>/`
- `ml_forecast`: reads bookings, exposes `/api/forecast/<category>/` and `/api/bi/dashboard/`
- `ml_churn`: reads bookings+users, exposes `/api/churn/<tenant_id>/` and `/api/churn/at-risk/`

## Data flow (important — do not build ML as a separate service)
All ML modules live inside the same Django project as regular Django apps. They read from
MongoDB via MongoEngine queries, run scikit-learn/Prophet/Surprise code in plain Python
functions or Django management commands, and expose results via DRF endpoints like any other
app. There is no separate microservice, no message queue, no Celery — keep it simple.

## Auth flow
1. Register/login → DRF endpoint issues JWT access + refresh token (simplejwt)
2. React stores access token, attaches as `Authorization: Bearer <token>` header
3. Role-based permissions enforced via DRF permission classes checking `request.user.role`

## Environment
- Python 3.11+, Django 5.x, djangorestframework, mongoengine, django-cors-headers
- Node 18+, React 18, axios, react-router-dom
- MongoDB running locally (or MongoDB Atlas free tier) — do not assume a specific
  connection string, read it from a `.env` file
