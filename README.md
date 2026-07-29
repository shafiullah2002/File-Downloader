# File Download Portal

A simple FastAPI project where you place PDF, DOCX, Excel, PowerPoint, ZIP or text files inside the `files` folder. Visitors can then download any file with one click.

## Setup

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open:

```text
http://127.0.0.1:8000
```

## Add files

Copy your files into:

```text
file-download-portal/files/
```

Then refresh the website.
