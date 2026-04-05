<div align="center">

# 🔍 Supply Chain Fraud Intelligence

### Graph-Powered Fraud Detection for E-Commerce Supply Chains

[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)]()
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

> **Detect. Analyze. Prevent.** A real-time fraud intelligence dashboard that maps seller networks, identifies fraud rings, and surfaces high-risk entities using graph-based analysis.

---

</div>

## 🚀 What Makes This Different

| Feature | Description |
|---|---|
| 🕸️ **Graph-Based Detection** | Maps seller-warehouse relationships as a live network |
| 🧠 **PageRank Intelligence** | Identifies influential & dangerous sellers using graph scoring |
| 🔴 **Risk Classification** | Automated scoring across 3 threat levels |
| 👁️ **Fraud Ring Discovery** | Clusters coordinated fraud groups automatically |
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
- Applies PageRank-inspired scoring to the seller-warehouse graph
- Identifies the **most influential** nodes in the network
- Combines **influence + risk** to surface the most dangerous entities

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
| ⚛️ Frontend | React + Vite |
| 🎨 Styling | CSS / Tailwind |
| 📈 Visualization | Custom Graph Engine |
| ☁️ Deployment | Vercel |
| 🔧 Version Control | GitHub |

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
Supply-Chain-Fraud-Detection/
├── react-frontend/
│   ├── src/
│   │   ├── components/          # All UI components
│   │   │   ├── NetworkGraph.jsx     # Seller-Warehouse graph
│   │   │   ├── FraudRings.jsx       # Cluster detection view
│   │   │   ├── Analytics.jsx        # Dashboard charts
│   │   │   ├── PageRankGraph.jsx    # Influence analysis
│   │   │   └── RiskTable.jsx        # Seller risk table
│   │   ├── utils/
│   │   │   └── mockData.js          # Simulated seller data
│   │   └── App.jsx              # Root component + routing
│   ├── package.json
│   └── vite.config.js
└── README.md
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

<div align="center">

⭐ **Star this repo** if you find it useful · 🐛 **Open an issue** for bugs · 🤝 **PRs welcome**

</div>| **AI Orchestration** | Google AI Studio (Gemini 1.5 Flash / Latest) |
| **Analytics Engine** | Python, Graph Algorithms (PageRank, Louvain, WCC) |
| **Typography** | Inter |

---

## ⚙️ Architecture

```
┌─────────────────────────────────┐      ┌──────────────────────────────┐
│       React Frontend            │      │       Django Backend         │
│ (Vite, Tailwind, Plotly)        │◄────►│ (REST API, logic, Security)  │
└─────────────────────────────────┘      └──────────────┬───────────────┘
                                                       │
                                                       ▼
                                         ┌──────────────────────────────┐
                                         │      Google AI Studio        │
                                         │      (Gemini API)            │
                                         └──────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+


### 1. Backend Setup
```bash
# Navigate to the project root
cd Supply-Chain-Fraud-Intelligence

# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Create a .env file in the root
GEMINI_API_KEY=your_actual_key_here

# Run migrations (if any) and start the server
python manage.py runserver
```

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd react-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🧠 AI Integration

The system uses **Gemini 1.5 Flash** to analyze complex supply chain data points including:
- **Return Rate Anomalies**: High volume returns vs. industry benchmarks.
- **Graph Centrality**: PageRank scores indicating disproportionate network influence.
- **Community Clustering**: Louvain IDs revealing suspicious affiliation with known fraud rings.
- **Entity Resolution**: WCC components identifying shared financial infrastructure.

---

## 👤 Credits

**Fullstack Ninjas Team**
- **Arpit Raj** — [@Arpit599222](https://github.com/Arpit599222)
- **Richa Grover** — [@RichaACN](https://github.com/RichaACN)
- **Paras Jain** — [@ParasJain03](https://github.com/ParasJain03)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*Built with ❄️ Data · 🤖 Google Gemini · ⚛️ React*
