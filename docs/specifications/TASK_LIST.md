# Task List — execute in this order, pause after each phase for review

## Phase 0 — Project scaffolding
- Create backend/ (Django project `core`) and frontend/ (React app) per ARCHITECTURE.md
- Set up MongoEngine connection via .env (MONGO_URI)
- Install dependencies listed in ARCHITECTURE.md
- Confirm Django runs and React runs, even with empty pages

## Phase 1 — Auth
- Implement User model (users app) per DATA_MODELS.md
- Register/Login endpoints with JWT (simplejwt)
- Role-based permission classes (IsAdmin, IsOwner, IsTenant)
- React: Login/Register pages, store token, protected routes by role

## Phase 2 — Appliance catalog
- Appliance model + CRUD endpoints (owner can create/edit own, tenant can view/search/filter)
- Image upload to local media/
- React: Appliance listing page, appliance detail page, owner "add appliance" form

## Phase 3 — Booking flow
- Booking model + endpoints (request, approve/reject by owner, mark returned)
- React: booking request flow, tenant "my bookings", owner "manage bookings"

## Phase 4 — Admin panel
- Admin endpoints: list/deactivate users, remove listings
- React: admin dashboard shell (charts/AI panels added in Phase 5)

## Phase 5 — AI modules (build after core app works end-to-end)
### 5a. Recommendation engine
- Download Kaggle "Personalized Recommendation Systems Dataset", relabel categories to
  appliance types (documented mapping in a comment/README)
- Train content-based model (scikit-learn cosine similarity) as a management command
  `train_recommender.py`, save model artifact
- Add collaborative filtering (Surprise SVD) as secondary signal
- Endpoint `/api/recommend/<tenant_id>/`, React "Recommended for you" section

### 5b. Demand forecasting / BI
- Download Kaggle "Retail Store Inventory and Demand Forecasting", relabel categories
- Train Prophet model per category as management command `train_forecast.py`
- Endpoint `/api/forecast/<category>/` and `/api/bi/dashboard/` (aggregated stats)
- React: admin BI dashboard with charts (use recharts or chart.js)

### 5c. Churn prediction
- Download Kaggle "Online Retail Customer Churn Dataset", adapt fields to rental context
  (documented mapping)
- Feature engineering: recency/frequency/monetary from Booking data
- Train Random Forest classifier as management command `train_churn.py`, report
  accuracy/precision/recall/F1 in a saved metrics file
- Endpoint `/api/churn/at-risk/`, React admin "At-risk customers" list

## Phase 6 — Polish
- Basic styling pass, error handling, loading states
- README with setup instructions for both backend and frontend

## Rules for every phase
- After finishing a phase, produce a short summary of what was built and any deviations
  from specs/ — do not silently skip AI modules or replace a library without flagging it.
- If blocked (e.g., dataset download fails, package conflict), report the blocker instead
  of silently substituting a different approach.
