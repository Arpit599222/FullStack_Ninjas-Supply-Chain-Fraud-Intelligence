<div align="center">

# 🔍 Supply Chain Fraud Intelligence

### Graph-Powered Fraud Detection for E-Commerce Supply Chains

[![Snowflake](https://img.shields.io/badge/Snowflake-29B5E8?style=for-the-badge&logo=snowflake&logoColor=white)](https://www.snowflake.com/)
[![Neo4j](https://img.shields.io/badge/Neo4j-4581C3?style=for-the-badge&logo=neo4j&logoColor=white)](https://neo4j.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://vitejs.dev/)

> **Detect. Analyze. Prevent.** A real-time fraud intelligence dashboard that maps seller networks, identifies fraud rings, and surfaces high-risk entities using graph-based analysis.

---

</div>

## 🚀 What Makes This Different

| Feature | Description |
|---|---|
| 🕸️ **Neo4j Graph Engine** | Powers deep-link relationship analysis & community detection |
| ❄️ **Snowflake Warehouse** | Scales fraud logic across millions of supply chain records |
| 🧠 **PageRank Analytics** | Identify top-tier threat actors using centrality algorithms |
| 👁️ **Louvain Communities** | Clusters coordinated fraud rings using modularity optimization |
| 🧑‍⚖️ **Human-in-the-Loop** | Admin override system for analyst review |
| 📊 **Interactive Dashboard** | Real-time analytics with cross-platform comparison |

---

## 📸 Demo Preview

> Dark mode · Light mode · Mobile responsive · Smooth animations

```
[ Network Graph ] ──► [ Fraud Ring Detection ] ──► [ Risk Table ] ──► [ Analytics ]
```

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

---

### 🕵️ 2. Fraud Ring Detection
- Automatically identifies **suspicious seller clusters**
- Detects groups sharing abnormal transaction patterns or network connections
- Surfaces **coordinated fraud activity** hiding within normal-looking data

---

### 📊 3. Analytics Dashboard
- Risk distribution across all sellers
- **Platform-wise comparison** (e.g., Flipkart, Amazon, Meesho)
- High-risk vs. low-risk segmentation
- Visual charts for instant trend recognition

---

### 🧠 4. PageRank Analysis
- Applies **Neo4j PageRank Centrality** to the seller-warehouse graph
- Identifies the **most influential** and widespread nodes in the supply chain
- Combines **Graph Centrality + Risk Metrics** to surface professional fraud actors

---

### 📋 5. Risk Table
Full seller database with advanced filtering:

| Column | Description |
|---|---|
| Seller Name | Registered seller identity |
| Risk Score | Computed 0–100 fraud score |
| Risk Level | 🔴 High / 🟡 Medium / 🟢 Low |
| Fraud Status | Flagged / Clean |
| Investigate | Action button for analyst review |

> Filter by **platform** or **risk level** · Export to CSV/Excel/PDF

---

### 🔬 6. Investigation System *(In Development)*
- **"Investigate"** button on every seller row
- Planned: AI-generated fraud explanation per seller
- Provides natural language reasoning for each fraud flag
- Helps analysts make **faster, confident decisions**

---

### 🛡️ 7. Admin Override *(Concept — Human-in-the-Loop)*
Designed for analyst-level control:
- ✏️ Manually adjust risk level
- 🚩 Remove or confirm fraud flag
- 📝 Add custom explanation for audit trail
- Keeps **humans in control** of automated decisions

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

### Risk Levels

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
| 🎨 **Styling** | Vanilla CSS (Premium Design System) |
| ❄️ **Database** | **Snowflake** (Primary Data Warehouse) |
| 🕸️ **Graph Engine** | **Neo4j** (Native Graph Analytics) |
| 🐍 **Backend** | Django (REST API + Snowflake Connector) |
| 🔧 **Algorithms** | PageRank, Louvain Community Detection, WCC |

---

## 🎨 UI/UX Highlights

- 🌙 **Dark + Light Mode** — seamless theme switching
- 📱 **Fully Responsive** — works on mobile, tablet, and desktop
- ✨ **Smooth Animations** — micro-interactions on every component
- 🧼 **Premium Minimal UI** — clean, distraction-free design
- ⚡ **Fast** — Vite-powered instant load times

---

## 🏁 Getting Started

### Prerequisites
```bash
node >= 18.x
npm >= 9.x
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Arpit599222/Supply-Chain-Fraud-Intelligence.git

# Navigate to frontend
cd Supply-Chain-Fraud-Detection-main/react-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

> App will be live at `http://localhost:5173`

---

## 📂 Project Structure

```
Supply-Chain-Fraud-Detection-Intelligence/
├── core/                       # Django Project Settings
│   ├── settings.py             # App Configuration & Snowflake Auth
│   └── urls.py                 # Main Routing (Admin + API)
├── api/                        # Intelligence API (Django App)
│   ├── views.py                # Fast-Fetch Endpoints (Snowflake/Neo4j)
│   ├── urls.py                 # API Route Definitions
│   └── snowflake_utils.py      # Snowflake/Neo4j Connector & Graph Logic
├── db/                         # Database Engineering
│   └── setup_snowflake_neo4j.sql # Production-Grade SQL & Cypher Setup
├── scripts/                    # Automation & Maintenance
│   └── setup_snowflake.py      # Automated Warehouse Initializer
├── react-frontend/             # Real-time Visual Intelligence (Vite)
│   ├── src/
│   │   ├── components/         # High-Performance UI Modules (NetworkGraph, Analytics)
│   │   ├── utils/              # API Bridges & Reliable Demo Engines
│   │   └── App.jsx             # Main Interface Controller
│   ├── package.json
│   └── vite.config.js
├── manage.py                   # Django Command Line Utility
├── requirements.txt            # Backend Python Dependencies
├── .env                        # Secure Credentials (Snowflake, API Keys)
└── README.md                   # Enterprise Documentation
```

---

## 🌐 Deployment

This project is deployed on **Vercel** for zero-config, production-grade hosting.

```bash
# Build for production
npm run build

# Deploy via Vercel CLI
vercel --prod
```

Or connect your GitHub repo directly to Vercel for **automatic deploys on push**.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

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

[![GitHub](https://img.shields.io/badge/GitHub-Arpit599222-181717?style=flat-square&logo=github)](https://github.com/RichaACN)

**Arpit Raj**

[![GitHub](https://img.shields.io/badge/GitHub-Arpit599222-181717?style=flat-square&logo=github)](https://github.com/Arpit599222)

**Paras Jain**

[![GitHub](https://img.shields.io/badge/GitHub-Arpit599222-181717?style=flat-square&logo=github)](https://github.com/ParasJain03)

> Built with 🔥 as part of the **Google Solution Challenge** — fighting fraud with graph intelligence.

---

<div align="center">

⭐ **Star this repo** if you find it useful · 🐛 **Open an issue** for bugs · 🤝 **PRs welcome**

</div>
