from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

# Resolve .env placed in the backend root, regardless of CWD
ENV_FILE = str(Path(__file__).resolve().parents[2] / ".env")


class Settings(BaseSettings):
    # Use v2 config style and keep env keys case-sensitive so DATA_IN, etc. match
    # Allow extra keys to avoid ValidationError if .env contains unrelated values
    model_config = SettingsConfigDict(env_file=ENV_FILE, case_sensitive=True, extra='allow')

    DATA_IN: str = "/data/in"
    DATA_OUT: str = "/data/out"
    DATA_DB: str = "/data/db"
    DATA_TMP: str = "/data/tmp"

    # e.g., 'nextflow run /pipeline/main.nf --run_id {run_id} --marker {marker} --input /data/in/{run_id} --outdir /data/out/{run_id}'
    PIPELINE_CMD: str | None = None

    # where downloads resolve from (frontend can use `/api/artifacts/...` by default)
    ARTIFACT_BASE_URL: str = "/api/artifacts"


settings = Settings()
