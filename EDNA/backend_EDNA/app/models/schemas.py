from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any

class UploadResponse(BaseModel):
    run_id: str
    saved_files: List[str]

class RunRequest(BaseModel):
    run_id: str
    marker: Literal["16S","18S","COI"]
    read_type: Literal["short","long"] = "short"
    options: Dict[str, Any] = {}

class RunResponse(BaseModel):
    run_id: str
    started: bool
    message: str

class StatusResponse(BaseModel):
    run_id: str
    status: Literal["queued","running","completed","failed","unknown"]
    progress: float = 0.0
    message: str | None = None

class SummaryMetric(BaseModel):
    label: str
    value: str

class NoveltyRow(BaseModel):
    id: str
    noveltyScore: str
    vaeloss: str
    faissDist: str
    epaAnnotation: str
    diamondHit: str
    abundance: str
    depth: str
    location: str


class Artifact(BaseModel):
    filename: str
    url: str

class ResultsResponse(BaseModel):
    run_id: str
    summaryMetrics: List[SummaryMetric]
    noveltyTable: List[NoveltyRow]
    artifacts: List[Artifact]
