from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="File Download Portal")

BASE_DIR = Path(__file__).resolve().parent
FILES_DIR = BASE_DIR / "files"
STATIC_DIR = BASE_DIR / "static"

FILES_DIR.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt", ".xlsx", ".pptx", ".zip"}


@app.get("/")
def home():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/files")
def get_files():
    try:
        files = []
        for file_path in sorted(FILES_DIR.iterdir()):
            if file_path.is_file() and file_path.suffix.lower() in ALLOWED_EXTENSIONS:
                files.append(
                    {
                        "name": file_path.name,
                        "size": file_path.stat().st_size,
                        "extension": file_path.suffix.lower(),
                        "download_url": f"/download/{file_path.name}",
                    }
                )
        return {"files": files}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/download/{filename}")
def download_file(filename: str):
    safe_name = Path(filename).name
    file_path = FILES_DIR / safe_name

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    if file_path.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=403, detail="File type not allowed")

    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type="application/octet-stream",
    )
