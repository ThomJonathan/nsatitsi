# Nsatitsi Backend

FastAPI backend scaffold for the Nsatitsi learning materials platform.

## What is included
- FastAPI application factory in `app/main.py`
- SQLAlchemy models for users, materials, and download logs
- Central taxonomy for levels, classes, subjects, and material types
- Password hashing and signed access tokens using only the Python standard library
- Protected download endpoint that requires authentication
- Admin reporting endpoints for counts and summaries

## Local setup

1. Create a virtual environment or reuse `backend/myenv`.
2. Install dependencies:

```powershell
pip install -r backend/requirements.txt
```

3. Copy `.env.example` to `.env` and adjust values as needed.
4. Run the API:

```powershell
uvicorn app.main:app --reload --app-dir backend
```

By default the app uses SQLite for local development. Set `DATABASE_URL` to your Supabase Postgres connection string when you are ready.

## API highlights
- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/materials`
- `POST /api/v1/materials/{id}/download`
- `GET /api/v1/admin/stats`

## Notes
- Protected downloads require a valid bearer token.
- The Mega storage integration is structured behind `app/services/storage_service.py` so it can be connected later without changing route code.

