# RentAI — AI Agent Replication & Reproduction Blueprint

> **Repository:** [https://github.com/ABHI200407/AI-BASED-HOUSEHOLD-APPLIANCES-RENTAL-SYSTEM](https://github.com/ABHI200407/AI-BASED-HOUSEHOLD-APPLIANCES-RENTAL-SYSTEM)  
> **Target Audience:** AI Coding Assistants (Cursor, Windsurf, Claude Code, Antigravity, Copilot, ChatGPT) & Human Developers.  
> **Goal:** Run, verify, and reproduce the exact production-ready state of the RentAI platform with zero errors, zero synthetic placeholders, and full Ollama RAG integration.

---

## 📋 Copy-Paste Prompt for Any AI Coding Assistant

If you are giving this repository to an AI agent (Cursor, Windsurf, Claude, ChatGPT, etc.), copy and paste the block below:

```markdown
You are an expert full-stack AI engineer. You are tasked with running, verifying, and maintaining the RentAI Household Appliances Rental System located in this repository.

Here is the architectural context and non-negotiable rules for this project:

1. ARCHITECTURE STACK:
   - Backend: Django 5 (running on port 8000) using PyMongo for direct MongoDB integration.
   - Frontend: Vite + React 18 + Tailwind CSS (running on port 5173).
   - Database: MongoDB running locally on port 27017 (database name: `rentova` / `SDC2`).
   - Local AI RAG: Ollama running on port 11434 using the ultra-lightweight `qwen2.5:0.5b` model (or `llama3.2:1b`), configured with CPU execution (`num_gpu: 0`) and context length capped at 1024 to prevent memory crashes on standard laptops.
   - Image Architecture: Real commercial appliance photography (900+ images) is stored in `frontend/public/downloaded_images/` and served directly through Vite and Django (`backend/core/urls.py`).

2. CRITICAL DATABASE SEEDING RULE:
   - NEVER run legacy scripts like `seed_comprehensive_dataset.py` which generated synthetic placeholder items like "Smart TV #212".
   - ALWAYS run: `python backend/seed_curated_realistic_catalog.py`
   - This populates exactly 40 authentic commercial models (LG, Samsung, Bosch, Whirlpool, Daikin, Dyson, Sony, Philips, Haier, Panasonic) with 1:1 verified image cutouts and realistic rental prices, specs, and stock.

3. OLLAMA SAFETY RULES:
   - Do NOT attempt to load large 8B+ models like `llama3:8b` unless the host machine has at least 8 GB of free VRAM/RAM.
   - The default model configured in `backend/core/views_chat.py` is `qwen2.5:0.5b`. If it's missing, install it with: `ollama pull qwen2.5:0.5b`.
   - On Windows or machines with integrated GPUs (Intel Iris Xe), Ollama must be launched with CPU fallback:
     In PowerShell:
     $env:OLLAMA_LLM_LIBRARY="cpu"; $env:OLLAMA_NUM_PARALLEL="1"; $env:GGML_VK_DISABLE="1"; ollama serve

4. YOUR EXECUTION STEPS:
   Step 1: Check MongoDB service on localhost:27017.
   Step 2: Activate Python virtual environment and install backend requirements (`pip install -r backend/requirements.txt`).
   Step 3: Run `python backend/seed_curated_realistic_catalog.py`.
   Step 4: Ensure Ollama is running and has `qwen2.5:0.5b` pulled.
   Step 5: Start Django: `python backend/manage.py runserver 8000`.
   Step 6: In `frontend/`, run `npm install` and start Vite: `npm run dev`.
   Step 7: Verify all core routes:
     - Home (`http://localhost:5173/`)
     - Catalog (`http://localhost:5173/appliances`) -> ensure all 40 products show authentic titles, badges, and high-res images.
     - Delivery & Installations (`http://localhost:5173/installations`) -> verify real delivery photos and smooth scrolling to tracking.
     - Owner Dashboard (`http://localhost:5173/owner`) -> verify fleet analytics, health scores, and ROI metrics.
     - Admin Dashboard (`http://localhost:5173/admin`) -> verify platform operations.
     - AI Assistant / Chatbot -> send a message like "Recommend a 1.5 ton inverter AC for a master bedroom" and verify grounding in the database catalog.

Please verify the system status and report back confirming each component is green.
```

---

## 🛠️ Step-by-Step Manual Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Python 3.10 - 3.14**
- **Node.js 18+ & npm**
- **MongoDB Community Server** (running on port `27017`)
- **Ollama** ([https://ollama.com/download](https://ollama.com/download))

---

### 2. MongoDB Initialization
Ensure your MongoDB daemon is running:
```powershell
# Windows
net start MongoDB
# Or run mongod directly
mongod --dbpath="C:\data\db"
```

---

### 3. Backend Setup & Curated Seeding
Open a terminal in the project root:

```powershell
# Navigate to backend
cd backend

# Create & activate a virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# SEED THE CURATED 40-PRODUCT CATALOG (DO NOT RUN LEGACY SEEDERS)
python seed_curated_realistic_catalog.py

# Start Django backend server
python manage.py runserver 8000
```
> The Django API will be live at `http://localhost:8000/`.

---

### 4. Ollama Local AI Setup
Open a separate terminal window:

```powershell
# Set CPU safety environment variables (especially important for laptops / integrated GPUs)
$env:OLLAMA_LLM_LIBRARY = "cpu"
$env:OLLAMA_NUM_PARALLEL = "1"
$env:GGML_VK_DISABLE = "1"

# Pull the lightweight model (only ~397 MB)
ollama pull qwen2.5:0.5b

# (Optional backup model - 1.3 GB)
ollama pull llama3.2:1b

# Start the Ollama server
ollama serve
```
> Ollama API will be live at `http://localhost:11434/`.

---

### 5. Frontend Setup
Open another terminal window:

```powershell
# Navigate to frontend
cd frontend

# Install npm packages
npm install

# Start Vite dev server
npm run dev
```
> Frontend will be live at `http://localhost:5173/`.

---

## 📁 Key File Locations & Role Reference

| Path | Purpose |
| :--- | :--- |
| `backend/seed_curated_realistic_catalog.py` | **Single Source of Truth** for database catalog. Seeds 40 authentic commercial appliances with verified photo mappings. |
| `backend/core/views_chat.py` | RAG Chatbot endpoint. Interfaces with Ollama API, extracts user intent, retrieves DB appliances, and constructs grounded prompts. |
| `backend/core/views_analytics.py` | Calculates owner ROI, fleet health scores, depreciation, and customer utilization. |
| `backend/core/views_simulation.py` | Monte-Carlo simulation engine for market demand forecasting and rental churn. |
| `backend/core/urls.py` | URL router with dual image proxy serving `/downloaded_images/` directly to any client. |
| `frontend/public/downloaded_images/` | 918 high-resolution authentic appliance photos and real delivery story photography. |
| `frontend/public/images/` | High-quality appliance cutout imagery for category highlights. |
| `frontend/src/pages/OwnerDashboard.jsx` | Specialized business intelligence dashboard for appliance owners/investors. |
| `frontend/src/pages/Installations.jsx` | Doorstep delivery and technician tracking with step-by-step dispatch workflow. |
| `frontend/src/components/DeliveryStoryView.jsx` | Visual photo carousel documenting professional warehouse testing and assembly. |
| `frontend/src/components/ChatAssistant.jsx` | Interactive AI consultation widget with instant suggestions and live appliance links. |

---

## 🧪 Verification & Health Check

Run these simple checks to verify everything is operating properly:

1. **Catalog API Health:**
   ```bash
   curl http://localhost:8000/api/appliances/
   # Should return 40 realistic appliances (LG, Samsung, Bosch, etc.)
   ```

2. **Ollama Chatbot RAG Health:**
   ```bash
   curl -X POST http://localhost:8000/api/chat/ -H "Content-Type: application/json" -d '{"message": "I want to rent an AC for summer"}'
   # Should return grounded suggestions referencing Daikin, LG, or Samsung models in catalog.
   ```

3. **Image Serving:**
   Open in browser:
   `http://localhost:5173/downloaded_images/delivery_002_pid5933476.jpg`
   `http://localhost:8000/downloaded_images/delivery_002_pid5933476.jpg`
   Both should render clean commercial photos without 404s.

---

## ⚠️ Common Pitfalls & What NOT To Do

1. **DO NOT run `backend/seed_comprehensive_dataset.py`:**  
   This was an older script that created 356 automated placeholder items with names like `"Dishwasher #189"`. The current system relies on `seed_curated_realistic_catalog.py`.
2. **DO NOT change Ollama to `llama3:8b` on machines with limited RAM:**  
   `llama3:8b` requires 4GB+ of continuous free RAM and causes `llama-server` process exit crashes on laptops with integrated Intel Iris/UHD graphics. Stick to `qwen2.5:0.5b` or `llama3.2:1b`.
3. **DO NOT commit `.env` or root `downloaded_images/`:**  
   The canonical images are safely tracked inside `frontend/public/downloaded_images/`.
