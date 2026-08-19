# eDNA Backend (FastAPI)

This backend pairs with the eDNA frontend and orchestrates the Nextflow + Docker volumes pipeline.

## Quick Start

1. Create virtual environment:
   python -m venv .venv
   .venv\\Scripts\\activate # Windows
   or
   source .venv/bin/activate # Linux/Mac
2. Install dependencies:
   pip install -r requirements.txt
3. Create environment file (copy from .env.example):
   cp .env.example .env
4. Edit .env file with your local paths (Windows example):
   DATA\_IN=C:/data/in
   DATA\_OUT=C:/data/out
   DATA\_DB=C:/data/db
   DATA\_TMP=/data/tmp
5. Run the server:
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
6. Test: Open http://localhost:8000/health
7. \## API Endpoints
   - `POST /api/upload` - Upload FASTQ files
   - `POST /api/run` - Start pipeline
   - `GET /api/status/{run\_id}` - Check run status
   - `GET /api/results/{run\_id}` - Get results
   - `GET /api/artifacts/{run\_id}/{path}` - Download files

   ## Environment Variables

   - `DATA\_IN`: Input directory path
   - `DATA\_OUT`: Output directory path  
   - `DATA\_DB`: Database directory path
   - `DATA\_TMP`: Temporary directory path
   - `PIPELINE\_CMD`: Nextflow command template
   - `ARTIFACT\_BASE\_URL`: Base URL for downloads (default: /api/artifacts)
