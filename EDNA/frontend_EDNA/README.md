# eDNA Frontend (React + Vite)

Modern React frontend for the eDNA analysis pipeline.

## Quick Start

1. Install dependencies:
npm install

2. Create environment file (copy from example):
cp .env.local.example .env.local

3. Edit .env.local if needed:
VITE_API_BASE=http://localhost:8000/api

4. Start development server:
npm run dev


5. Open http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- **Upload**: Multi-file FASTQ upload with drag & drop
- **Configure**: Select marker genes (16S/18S/COI) and read types  
- **Monitor**: Real-time pipeline status with progress
- **Results**: Interactive results with UMAP visualization, novelty tables, and downloads

## API Integration

The frontend connects to the FastAPI backend. Configure the backend URL in `.env.local`:

VITE_API_BASE=http://localhost:8000/api


Alternatively, the Vite dev server includes a proxy to avoid CORS issues during development.
