# AI-Powered Household Appliance Rental Platform (SDC2 / RentAI)

A production-grade, enterprise full-stack platform for durable household appliance rentals with **Pure MongoDB (NoSQL) architecture**, **LightGBM-powered customer churn mitigation**, **tri-paradigm Collaborative Filtering recommendations**, and multi-tier temporal ecosystem simulation.

---

## 🏗️ Clean Project Directory Structure

```text
SDC2/
├── backend/                       # Pure MongoDB Django REST Backend & ML Engine
│   ├── appliances/                # Appliance catalog & specs (MongoEngine)
│   ├── bookings/                  # Rental orders, agreements, state machine
│   ├── core/                      # Settings (DATABASES={}), WSGI, ASGI, URLs
│   ├── datasets/                  # Kaggle & empirical datasets (churn, recommender, forecast)
│   ├── installations/             # Delivery scheduling & dispatching
│   ├── media/                     # Uploaded user/appliance media
│   ├── ml_churn/                  # LightGBM Churn Engine (model_lightgbm.pkl, metrics.json)
│   ├── ml_forecast/               # Multi-category ARIMA demand forecasting
│   ├── ml_recommend/              # Collaborative Filtering Engine (model.pkl, metrics.json)
│   ├── simulation/                # Multi-tier temporal simulation & event stream
│   ├── tests/                     # Automated test suite (test_all_endpoints.py)
│   ├── users/                     # User management, roles, KYC verification
│   ├── manage.py                  # Django CLI entrypoint
│   └── requirements.txt           # Python production dependencies
├── frontend/                      # React 19 + Vite Storefront & Admin Application
│   ├── public/                    # Static assets & catalog imagery (downloaded_images)
│   ├── src/                       # Components, Pages, State Contexts, Shaders
│   ├── package.json               # Node.js dependencies
│   └── vite.config.js             # Vite bundler configuration
├── docs/                          # Official Documentation & Academic Research
│   ├── pdf_deliverables/          # 20 Professional Publication-Quality PDF Documents
│   │   ├── software/              # 13 Software Engineering Deliverables (SRS, SDLC, UML, DB, API, etc.)
│   │   └── research/              # 7 Research & Capstone Deliverables (Paper, Proposal, Report, etc.)
│   ├── academic_docs/             # SRS, SDD & Database Design, Project Plan (.docx)
│   ├── research_papers/           # 10 Academic circular economy & leasing papers (.pdf)
│   ├── specifications/            # Architecture, Data Models, Technical Specs (.md)
│   ├── screenshots/               # UI & Admin Dashboard captures
│   ├── AI_REPLICATION_GUIDE.md    # Step-by-step reproduction guide
│   ├── EVALUATION_METRICS_AND_ALGORITHM_SPECIFICATION.md
│   └── simulation_and_data_provenance.md
├── presentations/                 # Academic & Industry Presentation Decks
│   ├── AI_Appliance_Rental_FinalPPT.pptx
│   ├── AI_Appliance_Rental_Presentation.pptx
│   ├── AI_Appliance_Rental_ProjectPlan.pptx
│   ├── AI_Appliance_Rental_TechnicalPlan.pptx
│   ├── Project_Proposal_Presentation.pptx
│   ├── Project_Presentation_Template.pptx
│   └── generate_ppt.py
├── reports/                       # Evaluation & Technical Audit Reports
│   ├── FULL_TECHNICAL_REPORT.md   # Complete system architecture and benchmark report
│   ├── EVALUATION_METRICS_SPECIFICATION.md # Mathematical formulations & metrics
│   ├── app_review_report.md       # Product and UI assessment
│   ├── creative_design_suggestions.md
│   └── upgrade_suggestions.md
├── scripts/                       # Seeding, Data Ingestion & Utility Scripts
│   ├── seeding/                   # Database seeding (IKEA, Kaggle, realistic catalog)
│   ├── scraping/                  # Image downloader, Kaggle dataset downloader
│   └── utilities/                 # Image validator, synthetic data generator
├── mongo_data/                    # Local MongoDB 8.3 storage engine directory
├── .gitignore                     # Git ignore rules for node_modules, mongo_data, etc.
├── LICENSE                        # MIT License
└── README.md                      # Project Documentation & Architecture Guide
```

---

## 🚀 Key Technological Highlights

### 1. Pure MongoDB NoSQL Architecture (Zero SQL)
* **Zero SQL Tables:** Runs without SQLite, MySQL, or PostgreSQL (`DATABASES = {}`).
* **ODM:** Connected directly via MongoEngine to `mongodb://localhost:27017/appliance_rental`.
* **Collections:**
  * `appliances`: 1,433 appliance listings across 52 categories
  * `users`: 54 tenant, owner, and admin accounts
  * `bookings`: Rental leases and state machine transitions
  * `churn_scores`: Explainable customer risk scores logged in real-time
  * `data_provenance`: Lineage tracking for empirical vs. simulated records

### 2. Production LightGBM Churn Prediction Engine
* **Artifact:** `backend/ml_churn/model_lightgbm.pkl` (Pipeline: model + 15 feature extractors)
* **API:** `/api/churn/at-risk/` (live tenant scoring) and `/api/churn/metrics/` (formal evaluation)
* **Engineered Behavioral Features:** Inactivity-to-tenure ratio, delinquency rate, early return rate, spend per tenure, dissatisfaction index, engagement index, cart friction.
* **Evaluation Scores:**
  * **Test Accuracy:** `95.67%` (5-Fold Stratified CV: `94.27%`)
  * **ROC-AUC:** `0.9893` (5-Fold Stratified CV: `0.9863`)
  * **Recall:** `92.31%`
  * **Precision:** `88.24%`
  * **F1-Score:** `90.23%`
  * **Log Loss:** `0.1189`

### 3. Tri-Paradigm Collaborative Filtering Recommender
* **Artifact:** `backend/ml_recommend/model.pkl`
* **API:** `/api/recommend/{tenant_id}/?type=model_based` and `/api/recommend/metrics/`
* **Supported Paradigms:**
  1. **User-Based CF (UBCF):** Cosine vector similarity across peer tenant rental cohorts.
  2. **Item-Based CF (IBCF):** Appliance cross-rental affinity projections.
  3. **Model-Based CF (Biased FunkSVD):** Latent factor matrix decomposition ($k=20$) with stochastic gradient descent (SGD):
     $$\hat{r}_{ui} = \mu + b_u + b_i + \mathbf{p}_u^T \mathbf{q}_i$$
* **Evaluation Scores (Evaluated on 8,924 test interactions):**
  * **Test RMSE:** `1.2015`
  * **Test MAE:** `1.0254`
  * **Precision @ 10:** `75.00%`
  * **Precision @ 5:** `74.53%`
  * **Recall @ 10:** `96.65%`
  * **Catalog Coverage:** `100%`

---

## ⚡ Quickstart Guide

### 1. Start MongoDB
Ensure MongoDB is running locally on port 27017:
```powershell
mongod --dbpath "C:\Users\coding\Desktop\PROJECT\SDC2\mongo_data"
```

### 2. Backend Setup & Test Suite
```powershell
cd backend
python -m pip install -r requirements.txt

# Run the complete test suite (tests all 9 core and ML endpoints)
python tests/test_all_endpoints.py

# Start Django backend server
python manage.py runserver 8000
```

### 3. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📊 Retraining Machine Learning Models

From the `backend/` directory:
```powershell
# Retrain LightGBM Churn Pipeline with 5-Fold Stratified Cross-Validation
python manage.py train_churn

# Retrain Biased FunkSVD Collaborative Filtering Recommendation Engine
python manage.py train_recommender

# Retrain Multi-Category ARIMA Demand Forecasting
python manage.py train_forecast
```

---

## 📄 Documentation & Reports Reference

### 🎓 20 Standard Engineering & Research PDF Deliverables (`docs/pdf_deliverables/`)

| # | Software Engineering Deliverables (`software/`) | # | Research & Academic Deliverables (`research/`) |
|---|------------------------------------------------|---|------------------------------------------------|
| 1 | `01_Software_Requirements_Specification_SRS.pdf` | 1 | `01_Research_Paper.pdf` |
| 2 | `02_Software_Development_Life_Cycle_SDLC.pdf` | 2 | `02_Research_Proposal.pdf` |
| 3 | `03_Feasibility_Study.pdf` | 3 | `03_Project_Report.pdf` |
| 4 | `04_Project_Proposal.pdf` | 4 | `04_User_Documentation.pdf` |
| 5 | `05_Literature_Review.pdf` | 5 | `05_Technical_Documentation.pdf` |
| 6 | `06_System_Design_Document_SDD.pdf` | 6 | `06_Security_Documentation.pdf` |
| 7 | `07_UML_Documentation.pdf` | 7 | `07_Deployment_Documentation.pdf` |
| 8 | `08_Database_Design_Document.pdf` | | |
| 9 | `09_API_Documentation.pdf` | | |
| 10 | `10_Software_Design_Document_LLD.pdf` | | |
| 11 | `11_Test_Plan.pdf` | | |
| 12 | `12_Test_Report.pdf` | | |
| 13 | `13_AIML_Specific_Document.pdf` | | |

* **Full Technical Report:** [`reports/FULL_TECHNICAL_REPORT.md`](file:///reports/FULL_TECHNICAL_REPORT.md)
* **Algorithm & Metric Specification:** [`reports/EVALUATION_METRICS_SPECIFICATION.md`](file:///reports/EVALUATION_METRICS_SPECIFICATION.md)
* **Architecture Design:** [`docs/specifications/ARCHITECTURE.md`](file:///docs/specifications/ARCHITECTURE.md)
* **Data Models:** [`docs/specifications/DATA_MODELS.md`](file:///docs/specifications/DATA_MODELS.md)
* **Academic Papers:** [`docs/research_papers/`](file:///docs/research_papers/)
* **Presentations:** [`presentations/`](file:///presentations/)

