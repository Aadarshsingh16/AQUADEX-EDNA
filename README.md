# AQUADEX-EDNA: AI-Powered Deep Sea eDNA Analysis Platform

![AQUADEX Platform](Screenshot%202025-09-28%20133325.png)

**AQUADEX-EDNA** is an end-to-end bioinformatics and machine learning platform designed for environmental DNA (eDNA) processing, taxonomic classification, and novel species candidate detection across oceanographic sampling locations.

The platform pairs a high-performance **FastAPI backend** orchestrating bioinformatic pipelines with a sleek **React (Vite) frontend** featuring interactive Nivo charts, Leaflet discovery maps, and pre-analyzed deep-sea demo test cases.

---

## 🌊 Key Features & Capabilities

- 🧬 **eDNA Sequence Processing**: Supports short-read (Illumina) and long-read (Oxford Nanopore/PacBio) FASTQ/FASTA files for **16S rRNA**, **18S rRNA**, and **COI** marker genes.
- 🤖 **AI-Driven Novelty Detection**: Combines Variational Autoencoders (VAE) reconstruction loss with FAISS vector similarity search to highlight uncultured and novel microbial/metazoan candidates.
- 🔬 **Taxonomic Classification & Alignment**: Integrates EPA-ng phylogenetic placement and DIAMOND alignment verification against reference databases.
- 📊 **Rich Interactive Visualizations**:
  - **Quality Control (QC)**: Read retention pie charts, Q20/Q30 scores, and GC% distribution.
  - **Diversity Metrics**: Alpha diversity (Shannon & Simpson indices) and Beta diversity (PCoA scatter plots & Bray-Curtis distance heatmaps).
  - **Taxonomy Flow**: Interactive Sankey flow diagrams and stacked relative abundance bar charts.
- 🗺️ **Geospatial Discovery Map**: Map rendering of sampling coordinates, novel ASV locations, historical species data, and Marine Protected Areas (MPAs).
- 🧪 **Pre-Analyzed Test Cases**: Includes 3 ready-to-explore deep-sea datasets (**Abyssal Plain 4,000m**, **Mariana Hydrothermal Vent**, and **Mesopelagic Twilight Zone**) for instant interactive exploration without needing to upload sequence files.

---

## 📁 Repository Structure

```text
AQUADEX-main/
├── README.md                               # Project documentation
├── package.json / package-lock.json        # Root workspace configuration
├── render.yaml                             # Deployment manifest for Render.com
├── Screenshot *.png                        # Platform preview screenshots
├── EDNA/
│   ├── backend_EDNA/                       # FastAPI Backend
│   │   ├── app/
│   │   │   ├── main.py                     # FastAPI entry point & CORS configuration
│   │   │   ├── api/
│   │   │   │   └── routes.py               # API route definitions (/upload, /run, /results)
│   │   │   ├── core/
│   │   │   │   └── config.py               # Environment variable settings
│   │   │   ├── models/
│   │   │   │   └── schemas.py              # Pydantic data schemas & response models
│   │   │   ├── services/
│   │   │   │   ├── pipeline.py             # Pipeline execution & status tracking
│   │   │   │   ├── results.py              # Result parser & demo dataset provider
│   │   │   │   └── storage.py              # Local directory & file storage manager
│   │   │   └── utils/
│   │   │       └── run_id.py               # Unique run ID generator
│   │   ├── requirements.txt                # Python dependencies
│   │   ├── Dockerfile                      # Containerization recipe for backend
│   │   └── .env.example                    # Sample environment variables
│   │
│   └── frontend_EDNA/                      # React + Vite Frontend
│       ├── src/
│       │   ├── App.jsx                     # Root React component & page router
│       │   ├── main.jsx                    # Vite DOM mount point
│       │   ├── index.css                   # Global styles & design tokens
│       │   ├── components/
│       │   │   ├── Header.jsx              # Navigation header with login modal trigger
│       │   │   ├── Footer.jsx              # Platform footer
│       │   │   ├── FeaturesSection.jsx     # Platform features showcase
│       │   │   ├── SolutionCard.jsx        # Solution workflow cards
│       │   │   └── WhyChoose.jsx           # Platform advantages
│       │   ├── pages/
│       │   │   ├── Home.jsx                # Landing page with video hero & demo launcher
│       │   │   ├── Run.jsx                 # Sequence upload & pipeline configuration
│       │   │   ├── Results.jsx             # Results dashboard (QC, Diversity, Taxonomy, Novelty)
│       │   │   └── mappage.jsx             # Interactive Leaflet discovery map
│       │   └── utils/
│       │       ├── config.js               # API base URL configuration
│       │       └── demoDatasets.js         # Pre-configured test cases data
│       ├── package.json                    # Frontend dependencies & scripts
│       └── vite.config.js                  # Vite configuration
└── .edna_data/                             # Local runtime storage directory (Git ignored)
    ├── in/                                 # Uploaded sequence input files
    ├── out/                                # Generated pipeline outputs & reports
    ├── db/                                 # Reference databases
    └── tmp/                                # Temporary execution files
```

---

## 🛠️ Prerequisites & Setup

### Requirements

- **Python**: 3.11+ (Python 3.12 recommended)
- **Node.js**: 18+ (Node.js 20+ recommended)
- **Git**: 2.30+

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Aadarshsingh16/AQUADEX-EDNA.git
cd AQUADEX-EDNA/AQUADEX-main
```

---

### 2. Set Up & Launch the Backend (FastAPI)

Navigate to the backend directory and set up a Python virtual environment:

```bash
# Windows
cd EDNA/backend_EDNA
python -m venv .venv
.venv\Scripts\activate

# Linux / macOS
cd EDNA/backend_EDNA
python3 -m venv .venv
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file from `.env.example`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```

Start the FastAPI backend server:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Verify backend health by visiting: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) (Response: `{"ok": true}`).

---

### 3. Set Up & Launch the Frontend (React + Vite)

Open a new terminal window and navigate to the frontend directory:

```bash
cd AQUADEX-main/EDNA/frontend_EDNA
npm install
npm run dev
```

The frontend application will start at: [http://localhost:5173](http://localhost:5173).

---

## 🧪 Pre-Configured Test Cases (Demo Mode)

The platform provides 3 pre-analyzed test cases that allow users to explore the complete interactive dashboard, taxonomy Sankey flows, alpha/beta diversity metrics, and novel candidate tables without requiring sequence upload:

| Test Case ID | Name | Depth | Location | Novel ASVs |
| :--- | :--- | :--- | :--- | :--- |
| **`demo-abyssal`** | Abyssal Plain 4,000m Survey | 4,120m | Clarion-Clipperton Zone, Pacific | 14 candidates |
| **`demo-hydrothermal`** | Mariana Hydrothermal Vent Microbiome | 2,750m | Mariana Arc Vent Field | 28 candidates |
| **`demo-coral-twilight`** | Mesopelagic Twilight Zone Biodiversity | 650m | Coral Sea Basin | 8 candidates |

These test cases can be triggered directly from:
- The **Home** page ("Explore Sample Results")
- The **Run** page ("Explore Pre-Analyzed Test Cases" cards)
- The **Results** page top Dataset Switcher toolbar

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check endpoint |
| `POST` | `/api/upload` | Upload `.fasta` / `.fastq` sequence files |
| `POST` | `/api/run` | Trigger pipeline analysis for a `run_id` |
| `GET` | `/api/status/{run_id}` | Poll execution progress and status |
| `GET` | `/api/results/{run_id}` | Fetch summary metrics, novelty table, and artifacts |
| `GET` | `/api/artifacts/{run_id}/{path}` | Download generated report files and CSV matrices |

---

## ⚙️ Environment Variables

### Backend (`EDNA/backend_EDNA/.env`)

```env
DATA_IN=c:/projects/AQUADEX-main/AQUADEX-main/.edna_data/in
DATA_OUT=c:/projects/AQUADEX-main/AQUADEX-main/.edna_data/out
DATA_DB=c:/projects/AQUADEX-main/AQUADEX-main/.edna_data/db
DATA_TMP=c:/projects/AQUADEX-main/AQUADEX-main/.edna_data/tmp
PIPELINE_CMD=echo Pipeline command goes here
ARTIFACT_BASE_URL=/api/artifacts
```

### Frontend (`EDNA/frontend_EDNA/.env.local` - Optional)

```env
VITE_API_BASE=http://localhost:8000/api
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
