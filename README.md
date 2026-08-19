# AQUADEX / eDNA Platform

Quickstart guide to run the backend (FastAPI) and the frontend (Vite + React).

Prerequisites
- Windows: Python 3.11+ (recommended via python.org installer) and PowerShell 5+ (default on modern Windows)
- Linux/Mac: Python 3.11+, bash
- Frontend (optional): Node.js 18+ (for Vite dev server)

One-command backend (recommended)
- Windows: run scripts/start-backend.ps1 (Right-click > Run with PowerShell, or execute from a PowerShell terminal.)
- Linux/Mac: run scripts/start-backend.sh (make it executable if needed).

What the script does
- Creates a Python virtual environment under EDNA/backend_EDNA/.venv
- Installs backend dependencies from EDNA/backend_EDNA/requirements.txt
- Creates EDNA/backend_EDNA/.env pointing to project-local data folders under .edna_data (in the repo root)
- Ensures those folders exist
- Starts the FastAPI dev server with auto-reload at http://localhost:8000

Verify backend is running
- Open http://localhost:8000/health and you should see: {"ok": true}

Manual backend setup (if you prefer)
1) Create and activate a virtual environment in EDNA/backend_EDNA
2) Install dependencies from requirements.txt
3) Copy .env.example to .env, then set these paths to anywhere writable on your machine, e.g. the repo-local .edna_data folders:
   DATA_IN=<repo>/.edna_data/in
   DATA_OUT=<repo>/.edna_data/out
   DATA_DB=<repo>/.edna_data/db
   DATA_TMP=<repo>/.edna_data/tmp
   PIPELINE_CMD=echo "Pipeline command goes here"
4) Start the dev server from the repo root using the same virtual environment: run devserver.py

Frontend (optional)
- Go to EDNA/frontend_EDNA and install dependencies (npm ci or npm install), then start the dev server (npm run dev)
- The frontend defaults to the backend API at http://localhost:8000/api (see EDNA/frontend_EDNA/src/utils/config.js). To override, create EDNA/frontend_EDNA/.env.local with VITE_API_BASE=http://localhost:8000/api

Troubleshooting
- If the port 8000 is in use, stop other services using that port or change the port in devserver.py
- If Python version mismatches, ensure you are using Python 3.11+ inside the virtual environment
- If PowerShell blocks scripts, run: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned (then re-run)

Repository structure (key parts)
- devserver.py — launches the backend dev server (FastAPI + uvicorn) with reload
- EDNA/backend_EDNA — backend source code, requirements, and .env example
- EDNA/frontend_EDNA — React + Vite frontend


