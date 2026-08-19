import subprocess, threading, time, json, shutil
from pathlib import Path
from typing import Optional
from ..core.config import settings
from .storage import out_dir

_processes: dict[str, subprocess.Popen] = {}
_status: dict[str, dict] = {}

def _write_status(run_id: str, status: str, progress: float = 0.0, message: Optional[str] = None):
    _status[run_id] = {"status": status, "progress": progress, "message": message}
    od = out_dir(run_id)
    od.mkdir(parents=True, exist_ok=True)
    (od / "status.json").write_text(json.dumps(_status[run_id], indent=2))

def get_status(run_id: str) -> dict:
    p = out_dir(run_id) / "status.json"
    if p.exists():
        try:
            return json.loads(p.read_text())
        except Exception:
            pass
    return _status.get(run_id, {"status": "unknown", "progress": 0.0, "message": None})

def start_pipeline(run_id: str, marker: str, read_type: str, options: dict) -> bool:
    if run_id in _processes and _processes[run_id].poll() is None:
        return True

    def demo_runner():
        try:
            od = out_dir(run_id)
            od.mkdir(parents=True, exist_ok=True)
            (od / "logs").mkdir(parents=True, exist_ok=True)
            log_file = od / "logs" / "pipeline.log"
            log_file.write_text("Starting eDNA analysis pipeline...\n")

            steps = [
                (0.1, "Initializing pipeline..."),
                (0.2, "Reading input files..."),
                (0.3, "Quality control and trimming..."),
                (0.4, "ASV inference..."),
                (0.5, "Taxonomic classification..."),
                (0.6, "Novelty detection..."),
                (0.7, "Generating visualizations..."),
                (0.8, "Creating reports..."),
                (0.9, "Finalizing results..."),
                (1.0, "Pipeline completed successfully!"),
            ]
            for progress, message in steps:
                _write_status(run_id, "running", progress, message)
                with open(log_file, "a") as f:
                    f.write(f"[{progress*100:.0f}%] {message}\n")
                time.sleep(0.65)

            _create_demo_outputs(run_id)
            _write_status(run_id, "completed", 1.0, "Pipeline completed successfully!")
        except Exception as e:
            _write_status(run_id, "failed", 1.0, f"exception: {e}")
        finally:
            if run_id in _processes:
                del _processes[run_id]

    threading.Thread(target=demo_runner, daemon=True).start()
    return True

def _create_demo_outputs(run_id: str):
    od = out_dir(run_id)
    (od / "metrics").mkdir(exist_ok=True)
    (od / "novelty").mkdir(exist_ok=True)
    (od / "clusters").mkdir(exist_ok=True)
    (od / "asvs").mkdir(exist_ok=True)
    (od / "final").mkdir(exist_ok=True)
    (od / "alignment").mkdir(exist_ok=True)
    (od / "phylo").mkdir(exist_ok=True)
    (od / "reports").mkdir(exist_ok=True)

    metrics = {"assigned_pct": 87.3, "shannon": 4.2, "simpson": 0.89, "novel_count": 12}
    (od / "metrics" / "metrics.json").write_text(json.dumps(metrics, indent=2))

    novelty_csv = """id,noveltyScore,vaeloss,faissDist,epaAnnotation,diamondHit,abundance,depth,location
ASV_001,0.89,0.75,0.82,Novel species,No,156,150,Site A
ASV_002,0.67,0.45,0.58,Known species,Yes,89,200,Site B
ASV_003,0.92,0.88,0.91,Novel genus,No,234,100,Site C
ASV_004,0.34,0.23,0.31,Known species,Yes,45,300,Site A
ASV_005,0.78,0.65,0.72,Novel species,No,178,250,Site B
ASV_006,0.56,0.42,0.48,Known species,Yes,67,180,Site C
ASV_007,0.85,0.72,0.79,Novel species,No,198,120,Site A
ASV_008,0.43,0.31,0.37,Known species,Yes,34,280,Site B"""
    (od / "novelty" / "novelty.csv").write_text(novelty_csv)

    dummy_umap = Path(__file__).parent.parent.parent / "data_OP" / "dummy_umap_clusters.png"
    dummy_heatmap = Path(__file__).parent.parent.parent / "data_OP" / "dummy_braycurtis_heatmap.png"
    if dummy_umap.exists():
        shutil.copy2(dummy_umap, od / "clusters" / "umap.png")
    if dummy_heatmap.exists():
        shutil.copy2(dummy_heatmap, od / "clusters" / "heatmap.png")

    abundance_csv = """ASV_ID,abundance,relative_abundance
ASV_001,1250,0.15
ASV_002,980,0.12
ASV_003,750,0.09
ASV_004,650,0.08
ASV_005,580,0.07
ASV_006,520,0.06
ASV_007,480,0.06
ASV_008,420,0.05
ASV_009,380,0.05
ASV_010,350,0.04
ASV_011,320,0.04
ASV_012,290,0.03"""
    (od / "asvs" / "abundance.csv").write_text(abundance_csv)

    clusters_csv = """ASV_ID,cluster_id,coordinates_x,coordinates_y
ASV_001,1,0.25,0.75
ASV_002,1,0.30,0.80
ASV_003,2,0.15,0.20
ASV_004,2,0.20,0.25
ASV_005,3,0.80,0.30
ASV_006,3,0.85,0.35
ASV_007,1,0.28,0.78
ASV_008,2,0.18,0.22
ASV_009,3,0.82,0.32
ASV_010,2,0.22,0.28
ASV_011,1,0.32,0.82
ASV_012,3,0.78,0.28"""
    (od / "clusters" / "clusters.csv").write_text(clusters_csv)

    final_csv = """ASV_ID,novelty_score,confidence,taxonomic_assignment
ASV_001,0.95,High,Unassigned - Novel candidate
ASV_002,0.87,High,Unassigned - Novel candidate
ASV_003,0.92,High,Unassigned - Novel candidate
ASV_004,0.78,Medium,Unassigned - Novel candidate
ASV_005,0.89,High,Unassigned - Novel candidate
ASV_006,0.83,Medium,Unassigned - Novel candidate
ASV_007,0.91,High,Unassigned - Novel candidate
ASV_008,0.85,Medium,Unassigned - Novel candidate
ASV_009,0.88,High,Unassigned - Novel candidate
ASV_010,0.82,Medium,Unassigned - Novel candidate
ASV_011,0.90,High,Unassigned - Novel candidate
ASV_012,0.86,Medium,Unassigned - Novel candidate"""
    (od / "final" / "novel_candidates.csv").write_text(final_csv)

    diamond_tsv = """ASV_ID\tquery_id\tsubject_id\tidentity\talignment_length\tmismatches\tgap_opens\tqstart\tqend\tsstart\tsend\tevalue\tbit_score
ASV_001\tASV_001\tref_001\t85.2\t150\t22\t2\t1\t150\t1\t150\t1e-45\t180
ASV_002\tASV_002\tref_002\t82.1\t148\t26\t3\t1\t148\t1\t148\t1e-42\t175
ASV_003\tASV_003\tref_003\t88.5\t152\t18\t1\t1\t152\t1\t152\t1e-48\t185"""
    (od / "alignment" / "diamond.tsv").write_text(diamond_tsv)

    epa_jplace = """{"tree":"((ref1:0.1,ref2:0.2)0.9:0.3,ref3:0.4)0.8:0.5;","placements":[{"p":[[0,0.1,0.2,0.3,0.4]],"nm":[["ASV_001","ASV_002"]]}],"metadata":{"invocation":"epa-ng --tree ref.tree --query ASVs.fasta --outdir results"}}"""
    (od / "phylo" / "placement.jplace").write_text(epa_jplace)

    report_html = """<!DOCTYPE html>
<html>
<head><title>eDNA Analysis Report</title></head>
<body>
<h1>eDNA Analysis Report</h1>
<h2>Summary</h2>
<p>Total ASVs: 12</p>
<p>Novel candidates: 12</p>
<p>Classification rate: 87.3%</p>
<h2>Results</h2>
<p>Analysis completed successfully with high confidence novel taxa detection.</p>
</body>
</html>"""
    (od / "reports" / "report.html").write_text(report_html)

    timeline_html = """<!DOCTYPE html>
<html>
<head><title>Pipeline Timeline</title></head>
<body>
<h1>Pipeline Execution Timeline</h1>
<ul>
<li>00:00 - Pipeline started</li>
<li>00:01 - Quality control completed</li>
<li>00:02 - ASV inference completed</li>
<li>00:03 - Classification completed</li>
<li>00:04 - Novelty detection completed</li>
<li>00:05 - Visualizations generated</li>
<li>00:06 - Pipeline completed</li>
</ul>
</body>
</html>"""
    (od / "reports" / "timeline.html").write_text(timeline_html)