# Fruit Quality Check Web App

This is a full-stack project using:
- 🎯 FastAPI backend (ML model for fruit freshness)
- ⚛️ ReactJS frontend (UI to upload and visualize results)

## Structure

- `/backend`: FastAPI + Keras model
- `/frontend`: ReactJS with chart visualization



## Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000 

### Frontend

cd client
npm install
npm run dev


### create virtual environment in python 3.10
py -3.10 -m venv venv

### Activate virtual environment
venv\Scripts\activate 


pip install --upgrade pip

pip install fastapi uvicorn tensorflow pillow python-multipart