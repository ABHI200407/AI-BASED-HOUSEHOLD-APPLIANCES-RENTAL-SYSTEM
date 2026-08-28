# AI-Powered Appliance Rental Platform

Welcome to the AI-Powered Appliance Rental Platform! This full-stack application connects appliance owners with tenants looking to rent appliances on a daily basis. 

What sets this platform apart is its deep integration with **Machine Learning** models trained on real-world Kaggle datasets to drive business intelligence, customer retention, and personalized user experiences.

---

## 🚀 Features

- **Role-Based Access**: Secure JWT authentication for Tenants, Owners, and Admins.
- **Tenant Experience**: Browse appliances, filter by category/search, and see personalized AI recommendations.
- **Owner Experience**: Easily list new appliances, upload images, and manage incoming rental requests.
- **Admin Dashboard**: Oversee the entire platform, deactivate users, force-remove listings, and view advanced AI Business Intelligence.
- **AI Recommendation Engine**: Content-based and Collaborative Filtering (SVD) to suggest appliances to users based on real Kaggle data (`alfarisbachmid/personalized-recommendation-systems-dataset`).
- **Demand Forecasting**: 30-day demand predictions using Prophet on real retail forecasting data (`atomicd/retail-store-inventory-and-demand-forecasting`).
- **Churn Prediction**: Random Forest classification to identify at-risk customers using recency, frequency, and monetary metrics (`hassaneskikri/online-retail-customer-churn-dataset`).

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django & Django REST Framework (DRF)
- **Database**: MongoDB (via MongoEngine)
- **Authentication**: SimpleJWT (Customized for MongoEngine)
- **Machine Learning**: `scikit-learn`, `prophet`, `pandas`, `scikit-surprise`

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017/`

### 1. Backend Setup
Navigate to the `backend` directory and set up your Python environment:
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Start the Django development server:
```bash
python manage.py runserver
```

### 2. Frontend Setup
In a new terminal window, navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The React app will be available at `http://localhost:5173`.

---

## 🧠 AI Modules & Retraining

The machine learning models are already pre-trained and saved as `.pkl` artifacts. If you wish to retrain them on new data, you can run the following custom Django management commands from the `backend` directory:

```bash
# 1. Retrain the Recommendation Engine (Cosine Similarity + SVD)
python manage.py train_recommender

# 2. Retrain the 30-Day Demand Forecasting Models (Prophet)
python manage.py train_forecast

# 3. Retrain the Customer Churn Prediction Model (Random Forest)
python manage.py train_churn
```

---

## 📝 License
This project is built for educational and demonstration purposes.
