from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from typing import List, Optional
from pathlib import Path
from ..models.schemas import UploadResponse, RunRequest, RunResponse, StatusResponse, ResultsResponse
from ..core.config import settings
from ..services.storage import ensure_run_dirs, out_dir, in_dir
from ..services.pipeline import start_pipeline, get_status
from ..services import results as results_svc

router = APIRouter(prefix="/api")

@router.post("/upload", response_model=UploadResponse)
async def upload_files(files: List[UploadFile] = File(...), run_id: Optional[str] = Form(None)):
    if not run_id:
        from ..utils.run_id import new_run_id
        run_id = new_run_id()
    inp, _ = ensure_run_dirs(run_id)
    saved = []
    for f in files:
        dest = inp / f.filename
        with dest.open("wb") as w:
            w.write(await f.read())
        saved.append(f.filename)
    return UploadResponse(run_id=run_id, saved_files=saved)

@router.post("/run", response_model=RunResponse)
async def run_pipeline(req: RunRequest):
    ok = start_pipeline(req.run_id, req.marker, req.read_type, req.options)
    if not ok:
        raise HTTPException(status_code=400, detail="Failed to start pipeline; check PIPELINE_CMD")
    return RunResponse(run_id=req.run_id, started=True, message="Pipeline launched")

@router.get("/status/{run_id}", response_model=StatusResponse)
async def status(run_id: str):
    s = get_status(run_id)
    return StatusResponse(run_id=run_id, status=s.get("status","unknown"), progress=float(s.get("progress",0.0)), message=s.get("message"))

@router.get("/results/{run_id}", response_model=ResultsResponse)
async def results(run_id: str):
    summary = results_svc.build_summary(run_id)
    novelty = results_svc.read_novelty_csv(run_id)
    artifacts = results_svc.list_artifacts(run_id)
    return ResultsResponse(run_id=run_id, summaryMetrics=summary, noveltyTable=novelty, artifacts=artifacts)

@router.get("/artifacts/{run_id}/{path:path}")
async def artifact(run_id: str, path: str):
    base = out_dir(run_id)
    file_path = (base / path).resolve()
    if not str(file_path).startswith(str(base.resolve())):
        raise HTTPException(status_code=400, detail="Invalid path")
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(str(file_path))
