import csv, json
from pathlib import Path
from typing import List
from ..core.config import settings
from .storage import out_dir

def _safe_read_json(p: Path, default):
    try:
        if p.exists():
            return json.loads(p.read_text())
    except Exception:
        pass
    return default

def _num(val):
    try:
        if val is None:
            return None
        s = str(val).strip()
        if s == '':
            return None
        return float(s) if ('.' in s or 'e' in s.lower()) else int(s)
    except Exception:
        return val

def build_summary(run_id: str):
    metrics = _safe_read_json(out_dir(run_id) / "metrics" / "metrics.json", {})
    summary = []
    if metrics:
        if "assigned_pct" in metrics:
            summary.append({"label": "% ASVs assigned per rank", "value": f"{metrics['assigned_pct']}%"})
        if "shannon" in metrics:
            summary.append({"label": "Shannon Diversity", "value": str(metrics["shannon"])})
        if "simpson" in metrics:
            summary.append({"label": "Simpson Diversity", "value": str(metrics["simpson"])})
        if "novel_count" in metrics:
            summary.append({"label": "# Novel ASVs detected", "value": str(metrics["novel_count"])})
    return summary

def read_novelty_csv(run_id: str) -> List[dict]:
    path = out_dir(run_id) / "novelty" / "novelty.csv"
    rows: List[dict] = []
    if path.exists():
        with path.open(newline='', encoding='utf-8') as f:
            r = csv.DictReader(f)
            for row in r:
                dh_raw = (row.get("diamondHit") or row.get("diamond_hit") or "").strip()
                dh = "Yes" if dh_raw.lower() in ("yes", "y", "1", "true") else "No" if dh_raw else ""
                rows.append({
                    "id": row.get("id") or row.get("ASV_ID") or row.get("asv_id") or "",
                    "noveltyScore": row.get("noveltyScore") or row.get("novelty_score") or "",
                    "vaeloss": row.get("vaeloss") or row.get("vae_loss") or "",
                    "faissDist": row.get("faissDist") or row.get("faiss_dist") or "",
                    "epaAnnotation": row.get("epaAnnotation") or row.get("epa_annotation") or "",
                    "diamondHit": dh,
                    "abundance": row.get("abundance") or row.get("Abundance") or row.get("abundance_count"),
                    "depth": row.get("depth") or row.get("Depth") or row.get("depth_m"),
                    "location": row.get("location") or row.get("site") or "",
                })
    return rows

def list_artifacts(run_id: str) -> List[dict]:
    outp = out_dir(run_id)
    mapping = []
    candidates = [
        ("abundance.csv", outp / "asvs" / "abundance.csv"),
        ("clusters.csv", outp / "clusters" / "clusters.csv"),
        ("novel_candidates.csv", outp / "final" / "novel_candidates.csv"),
        ("DIAMOND.tsv", outp / "alignment" / "diamond.tsv"),
        ("EPA-ng.jplace", outp / "phylo" / "placement.jplace"),
        ("umap.png", outp / "clusters" / "umap.png"),
        ("heatmap.png", outp / "clusters" / "heatmap.png"),
        ("report.html", outp / "reports" / "report.html"),
        ("timeline.html", outp / "reports" / "timeline.html"),
    ]
    base = settings.ARTIFACT_BASE_URL.rstrip("/")
    for name, p in candidates:
        if p.exists():
            rel = str(p.relative_to(outp)).replace("\\", "/")
            mapping.append({"filename": name, "url": f"{base}/{run_id}/{rel}"})
    return mapping