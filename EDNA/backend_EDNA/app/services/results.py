import csv, json
from pathlib import Path
from typing import List
from ..core.config import settings
from .storage import out_dir

DEMO_METRICS = {
    "demo-abyssal": [
        {"label": "% ASVs assigned per rank", "value": "94.2%"},
        {"label": "Shannon Diversity", "value": "4.82"},
        {"label": "Simpson Diversity", "value": "0.94"},
        {"label": "# Novel ASVs detected", "value": "14"}
    ],
    "demo-hydrothermal": [
        {"label": "% ASVs assigned per rank", "value": "89.6%"},
        {"label": "Shannon Diversity", "value": "3.45"},
        {"label": "Simpson Diversity", "value": "0.81"},
        {"label": "# Novel ASVs detected", "value": "28"}
    ],
    "demo-coral-twilight": [
        {"label": "% ASVs assigned per rank", "value": "97.1%"},
        {"label": "Shannon Diversity", "value": "5.12"},
        {"label": "Simpson Diversity", "value": "0.96"},
        {"label": "# Novel ASVs detected", "value": "8"}
    ]
}

DEMO_NOVELTY = {
    "demo-abyssal": [
        {"id": "ASV_ABYSSAL_001", "noveltyScore": "0.94", "vaeloss": "0.88", "faissDist": "0.92", "epaAnnotation": "Uncultured Deep-Sea Archaeon", "diamondHit": "No", "abundance": "342", "depth": "4120", "location": "Pacific CCZ Station A1"},
        {"id": "ASV_ABYSSAL_007", "noveltyScore": "0.87", "vaeloss": "0.79", "faissDist": "0.84", "epaAnnotation": "Piezophilic Gammaproteobacterium nov.", "diamondHit": "No", "abundance": "215", "depth": "4150", "location": "Pacific CCZ Station A2"},
        {"id": "ASV_ABYSSAL_012", "noveltyScore": "0.82", "vaeloss": "0.74", "faissDist": "0.79", "epaAnnotation": "Novel Euryarchaeota Marine Group II", "diamondHit": "No", "abundance": "189", "depth": "4090", "location": "Pacific CCZ Station A1"},
        {"id": "ASV_ABYSSAL_025", "noveltyScore": "0.61", "vaeloss": "0.55", "faissDist": "0.58", "epaAnnotation": "Alphaproteobacteria deep clade", "diamondHit": "Yes", "abundance": "512", "depth": "4120", "location": "Pacific CCZ Station A3"},
        {"id": "ASV_ABYSSAL_041", "noveltyScore": "0.44", "vaeloss": "0.38", "faissDist": "0.41", "epaAnnotation": "Actinomycetota candidate", "diamondHit": "Yes", "abundance": "920", "depth": "4100", "location": "Pacific CCZ Station A2"}
    ],
    "demo-hydrothermal": [
        {"id": "ASV_VENT_101", "noveltyScore": "0.96", "vaeloss": "0.92", "faissDist": "0.95", "epaAnnotation": "Chemolithoautotrophic Sulfur Oxidizer nov.", "diamondHit": "No", "abundance": "1420", "depth": "2750", "location": "Mariana Chimney Alpha"},
        {"id": "ASV_VENT_108", "noveltyScore": "0.91", "vaeloss": "0.86", "faissDist": "0.89", "epaAnnotation": "Hyperthermophilic Methanogenic Archaeon", "diamondHit": "No", "abundance": "890", "depth": "2750", "location": "Mariana Chimney Alpha"},
        {"id": "ASV_VENT_204", "noveltyScore": "0.88", "vaeloss": "0.81", "faissDist": "0.85", "epaAnnotation": "Deep Vent Tubeworm Symbiont Clade", "diamondHit": "No", "abundance": "670", "depth": "2780", "location": "Mariana Vent Plume B"},
        {"id": "ASV_VENT_219", "noveltyScore": "0.74", "vaeloss": "0.69", "faissDist": "0.71", "epaAnnotation": "Campylobacterota vent candidate", "diamondHit": "Yes", "abundance": "1100", "depth": "2750", "location": "Mariana Chimney Beta"},
        {"id": "ASV_VENT_302", "noveltyScore": "0.52", "vaeloss": "0.48", "faissDist": "0.50", "epaAnnotation": "Aquificae thermophile", "diamondHit": "Yes", "abundance": "2300", "depth": "2740", "location": "Mariana Vent Plume A"}
    ],
    "demo-coral-twilight": [
        {"id": "ASV_MESO_004", "noveltyScore": "0.89", "vaeloss": "0.83", "faissDist": "0.87", "epaAnnotation": "Cryptic Siphonophore candidate clade", "diamondHit": "No", "abundance": "145", "depth": "650", "location": "Coral Sea Station T1"},
        {"id": "ASV_MESO_019", "noveltyScore": "0.84", "vaeloss": "0.78", "faissDist": "0.81", "epaAnnotation": "Deep Eukaryotic Radiolaria nov.", "diamondHit": "No", "abundance": "310", "depth": "680", "location": "Coral Sea Station T2"},
        {"id": "ASV_MESO_033", "noveltyScore": "0.68", "vaeloss": "0.62", "faissDist": "0.65", "epaAnnotation": "Novel Ctenophore deep lineage", "diamondHit": "Yes", "abundance": "580", "depth": "640", "location": "Coral Sea Station T1"},
        {"id": "ASV_MESO_050", "noveltyScore": "0.55", "vaeloss": "0.49", "faissDist": "0.51", "epaAnnotation": "Bioluminescent Dinoflagellate symbiont", "diamondHit": "Yes", "abundance": "1250", "depth": "650", "location": "Coral Sea Station T3"}
    ]
}

def _safe_read_json(p: Path, default):
    try:
        if p.exists():
            return json.loads(p.read_text())
    except Exception:
        pass
    return default

def build_summary(run_id: str):
    if run_id in DEMO_METRICS:
        return DEMO_METRICS[run_id]
    if run_id.startswith("demo-"):
        return DEMO_METRICS["demo-abyssal"]
        
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
    if run_id in DEMO_NOVELTY:
        return DEMO_NOVELTY[run_id]
    if run_id.startswith("demo-"):
        return DEMO_NOVELTY["demo-abyssal"]

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
                    "abundance": str(row.get("abundance") or row.get("Abundance") or row.get("abundance_count") or ""),
                    "depth": str(row.get("depth") or row.get("Depth") or row.get("depth_m") or ""),
                    "location": str(row.get("location") or row.get("site") or ""),
                })
    return rows

def list_artifacts(run_id: str) -> List[dict]:
    if run_id.startswith("demo-"):
        return [
            {"filename": "abundance.csv", "url": "#"},
            {"filename": "novelty_candidates.csv", "url": "#"},
            {"filename": "taxonomy_assignments.tsv", "url": "#"},
            {"filename": "report.html", "url": "#"}
        ]
        
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