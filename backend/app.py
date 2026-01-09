from main import app

# This file exists to provide a clean import path for uvicorn
# Run with: uvicorn app:app --reload

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)