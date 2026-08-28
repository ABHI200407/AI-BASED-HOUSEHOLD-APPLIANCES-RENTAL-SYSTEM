# Household Appliances Rental Management System — Project Brief

## What this is
A web platform for renting household appliances (AC, fridge, washing machine, microwave, etc.)
instead of buying them, with three AI-driven modules layered on top of a standard rental CRUD app.

## Actors
- **Admin** — manages users, appliance catalog, views BI dashboard, views churn-risk list
- **Owner/Vendor** — lists appliances, sets price/availability, sees their own bookings
- **Tenant/Customer** — searches, browses, rents, views recommendations, tracks orders

## Core Modules (non-AI)
1. Auth (JWT, 3 roles)
2. Appliance listing (CRUD, images, category, price, availability)
3. Booking/rental flow (request → approve → active → returned)
4. Payments (mock/COD acceptable for academic scope)
5. Admin panel (manage users, listings)

## AI Modules (the differentiator — do not simplify these away)
1. **Recommendation Engine** — hybrid: content-based (scikit-learn cosine similarity on
   category/price/brand) as primary, collaborative filtering (Surprise library, SVD) as
   secondary once enough interaction data exists. Surfaces "Recommended for you" on tenant home.
2. **Business Intelligence / Demand Forecasting** — Prophet time-series model forecasting
   rental demand per appliance category per week/month. Feeds an admin dashboard with charts
   (revenue trend, category demand, occupancy rate) plus a forecast-driven stock suggestion.
3. **Churn Prediction** — scikit-learn Random Forest classifier trained on tenant
   recency/frequency/monetary features, outputs a churn-risk score (Low/Medium/High) per
   tenant, surfaced in an admin "At-risk customers" list.

## Do NOT change without going back to the architect (me, Claude)
- Backend framework: Django
- Database: MongoDB via MongoEngine (not Djongo, not raw pymongo)
- API layer: Django REST Framework + djangorestframework-simplejwt
- Frontend: React (separate app, calls REST API)
- ML libraries: scikit-learn, Surprise, Prophet — as specified per module above
- Image storage: local media storage (no cloud service)
- Retraining: Django management commands (manual/cron-ready), not Celery

If a task seems to require deviating from this list, STOP and flag it rather than
silently choosing an alternative.

## Training data sources (Phase 5, ML modules)
- Churn: Kaggle "Online Retail Customer Churn Dataset" (hassaneskikri)
- Demand forecasting: Kaggle "Retail Store Inventory and Demand Forecasting" (atomicd)
- Recommendation: Kaggle "Personalized Recommendation Systems Dataset" (alfarisbachmid)
- All three need category relabeling to appliance types (documented in ML_MODULES.md)
