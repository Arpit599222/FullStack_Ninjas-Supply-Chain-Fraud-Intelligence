# 🔍 Supply Chain Fraud Intelligence

### Graph-Powered Fraud Detection for E-Commerce Supply Chains

![Snowflake](https://img.shields.io/badge/Snowflake-29B5E8?style=for-the-badge&logo=snowflake&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j-4581C3?style=for-the-badge&logo=neo4j&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

> **Detect. Analyze. Prevent.** A real-time fraud intelligence dashboard that maps seller networks, identifies fraud rings, and surfaces high-risk entities using graph-based analysis.

🌐 **Live Demo**: [supply-chain-fraud-inte.vercel.app](https://supply-chain-fraud-inte.vercel.app/)

---

## 🚀 What Makes This Different

| Feature | Description |
|---|---|
| 🕸️ **Neo4j Graph Engine** | Powers deep-link relationship analysis & community detection |
| ❄️ **Snowflake Warehouse** | Scales fraud logic across millions of supply chain records |
| 🧠 **PageRank Analytics** | Identify top-tier threat actors using centrality algorithms |
| 👁️ **Louvain Communities** | Clusters coordinated fraud rings using modularity optimization |
| 🧑‍⚖️ **Human-in-the-Loop** | Admin override system for analyst review |
| 📊 **Interactive Dashboard** | Real-time analytics with cross-platform comparison |
| 🔄 **Mock Data Engine** | 100% UI stability even without live database connections |

---

## 🧩 Core Features

### 🕸️ 1. Network Graph (Seller → Warehouse)
- Interactive graph visualizing relationships between **sellers** and **warehouses**
- **Node size** = influence score (PageRank-style logic)
- **Node color** = real-time risk level:
  - 🔴 **Red** — High Risk
  - 🟡 **Yellow** — Medium Risk
  - 🟢 **Green** — Low Risk
- Zoom, pan, and explore the full supply chain visually

### 🕵️ 2. Fraud Ring Detection
- Automatically identifies **suspicious seller clusters**
- Detects groups sharing abnormal transaction patterns or network connections
- Surfaces **coordinated fraud activity** hiding within normal-looking data

### 📊 3. Analytics Dashboard
- Risk distribution across all sellers
- **Platform-wise comparison** (Flipkart, Amazon, Meesho)
- High-risk vs. low-risk segmentation
- Visual charts for instant trend recognition

### 🧠 4. PageRank Analysis
- Applies **Neo4j PageRank Centrality** to the seller-warehouse graph
- Identifies the **most influential** nodes in the supply chain
- Combines **Graph Centrality + Risk Metrics** to surface professional fraud actors

### 📋 5. Risk Table

| Column | Description |
|---|---|
| Seller Name | Registered seller identity |
| Risk Score | Computed 0–100 fraud score |
| Risk Level | 🔴 High / 🟡 Medium / 🟢 Low |
| Fraud Status | Flagged / Clean |
| Investigate | Action button for analyst review |

> Filter by **platform** or **risk level** · Export to CSV/Excel/PDF

### 🛡️ 6. Admin Override (Human-in-the-Loop)
- ✏️ Manually adjust risk level
- 🚩 Remove or confirm fraud flag
- 📝 Add custom explanation for audit trail

---

## 🧮 Risk Score Formula

```
Risk Score = (Return Behavior × 30) + (Network Influence × 20) + (Fraud Indicators × 50)
```

| Factor | Weight | What It Measures |
|---|---|---|
| 📦 Return Behavior | 30% | Abnormal return/refund activity |
| 🔗 Network Influence | 20% | Connections to other flagged entities |
| ⛳ Fraud Indicators | 50% | Suspicious transaction patterns |

| Risk Level | Score Range | Meaning |
|---|---|---|
| 🔴 HIGH | > 60 | High fraud probability — immediate review |
| 🟡 MEDIUM | 30–60 | Suspicious activity — monitor closely |
| 🟢 LOW | ≤ 30 | Normal behavior — no action needed |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| ⚛️ **Frontend** | React + Vite |
| 🎨 **Styling** | Vanilla CSS |
| ❄️ **Database** | Snowflake (Primary Data Warehouse) |
| 🕸️ **Graph Engine** | Neo4j (Native Graph Analytics) |
| 🐍 **Backend** | Django (REST API) |
| 🔧 **Algorithms** | PageRank, Louvain Community Detection, WCC |

---

## 🏁 Getting Started (Local Setup)

### Prerequisites
- Node.js >= 18.x
- Python >= 3.9
- Git

### ⚡ Frontend Only (Recommended — works without any database)

```bash
# 1. Clone the repository
git clone https://github.com/Arpit599222/FullStack_Ninjas-Supply-Chain-Fraud-Intelligence.git

# 2. Navigate to frontend
cd FullStack_Ninjas-Supply-Chain-Fraud-Intelligence/react-frontend

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

> App will be live at **http://localhost:5173** — fully functional with built-in mock data.

---

### 🐍 Full Stack Setup (Django Backend)

```bash
# From the project root
cd FullStack_Ninjas-Supply-Chain-Fraud-Intelligence

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install django django-cors-headers django-environ gunicorn whitenoise requests openai snowflake-connector-python

# Apply database migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

> Backend API will be at **http://127.0.0.1:8000**

---

### 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Snowflake Configuration
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USER=your_user
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema
SNOWFLAKE_WAREHOUSE=your_warehouse

# Neo4j Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password

# Optional: OpenAI for AI-powered investigation
OPENAI_API_KEY=your_openai_key
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## 📂 Project Structure

```
FullStack_Ninjas-Supply-Chain-Fraud-Intelligence/
├── api/                        # Intelligence API (Django App)
│   ├── views.py                # Fast-Fetch Endpoints (Snowflake/Neo4j)
│   ├── urls.py                 # API Route Definitions
│   └── snowflake_utils.py      # Snowflake/Neo4j Connector & Graph Logic
├── backend/                    # Django Project Settings
│   ├── settings.py             # App Configuration & Auth
│   └── urls.py                 # Main Routing
├── db/                         # Database Engineering
│   └── setup_snowflake_neo4j.sql
├── scripts/                    # Automation & Setup
│   └── setup_snowflake.py
├── react-frontend/             # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # UI Modules (NetworkGraph, Analytics, etc.)
│   │   ├── utils/              # API Bridges & Mock Data Engine
│   │   └── App.jsx             # Main Interface Controller
│   ├── package.json
│   └── vite.config.js
├── manage.py                   # Django CLI Utility
├── requirements.txt            # Python Dependencies
├── Procfile                    # Deployment config
├── .env                        # Credentials (not committed)
└── README.md
```

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd react-frontend
npm run build
vercel --prod
```

Or connect the GitHub repo directly to Vercel for automatic deploys on every push.

### Backend (Heroku / Railway)
```bash
# Uses Procfile for deployment
# Ensure environment variables are set in dashboard
```

---

## 🏗️ Technical Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React + Vite  │────►│  Django REST API  │────►│   Snowflake DB  │
│   (Frontend)    │     │   (Backend)       │     │  (Data Warehouse)│
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │      Neo4j       │
                         │  (Graph Engine)  │
                         │  PageRank        │
                         │  Louvain         │
                         │  WCC             │
                         └──────────────────┘
```

1. **Data Ingestion**: Raw supply chain data stored in **Snowflake**
2. **Graph Analysis**: Relationships analyzed via **Neo4j GDS** algorithms
3. **Intelligence API**: **Django** serves as the bridge with REST endpoints
4. **Real-time Dashboard**: **React** visualizes insights with interactive graphs

---

## 🎨 UI/UX Highlights

- 🌙 **Dark + Light Mode** — seamless theme switching
- 📱 **Fully Responsive** — mobile, tablet, and desktop
- ✨ **Smooth Animations** — micro-interactions on every component
- ⚡ **Fast** — Vite-powered instant load times

---

## 👥 Team — FullStack Ninjas

| Name | GitHub |
|---|---|
| Arpit Raj | [@Arpit599222](https://github.com/Arpit599222) |
| Richa Grover | [@RichaACN](https://github.com/RichaACN) |
| Paras Jain | [@ParasJain03](https://github.com/ParasJain03) |

> Built with 🔥 as part of the **Google Solution Challenge** — fighting fraud with graph intelligence.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<<<<<<< Updated upstream
## 🏗️ Technical Architecture

The platform utilizes a modern, cloud-native stack designed for massive scalability:
1. **Data Ingestion**: Raw supply chain data (Orders, Sellers, Warehouses) is stored and processed in **Snowflake**.
2. **Graph Analysis**: Relationships are analyzed using **Neo4j Graph Data Science (GDS)** algorithms.
3. **Advanced Algorithms**:
   - **PageRank**: Measures the relative influence of nodes in the supply chain network.
   - **Louvain**: Detects hidden communities (fraud rings) based on shared infrastructure.
   - **WCC**: Resolves multiple disparate accounts to a single real-world identity.
4. **Intelligence API**: A **Django** backend serves as the bridge, executing high-performance Snowflake/Neo4j queries and delivering results via REST.
5. **Real-time Dashboard**: A **React** frontend visualizes these insights using interactive WebGL graphs and premium analytics charts.

---

## 🗄️ Reliability & Portability
- **Enterprise-Ready**: Fully configured to connect to live **Snowflake** and **Neo4j** instances via environment variables.
- **Failover Bridge**: Includes a high-fidelity **Mock Data Engine** to ensure 100% UI stability during presentations and evaluation periods.

---

## 👤 Author

**Richa Grover**

[![GitHub](https://img.shields.io/badge/GitHub-RichaACN-181717?style=flat-square&logo=github)](https://github.com/RichaACN)

**Arpit Raj**

[![GitHub](https://img.shields.io/badge/GitHub-Arpit599222-181717?style=flat-square&logo=github)](https://github.com/Arpit599222)

**Paras Jain**

[![GitHub](https://img.shields.io/badge/GitHub-ParasJain03-181717?style=flat-square&logo=github)](https://github.com/ParasJain03)

> Built with 🔥 as part of the **Google Solution Challenge** — fighting fraud with graph intelligence.

---

<div align="center">

=======
>>>>>>> Stashed changes
⭐ **Star this repo** if you find it useful · 🐛 **Open an issue** for bugs · 🤝 **PRs welcome**
