from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import io
import tensorflow as tf
import time

app = FastAPI()

# Allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("model/fruit_freshness_model.h5")

# Prewarm model with dummy input
dummy_input = np.zeros((1, 100, 100, 3))
model.predict(dummy_input)

# image Preprocess function
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((100, 100))  # Match model input size
    img_array = np.array(image) / 255.0  
    img_array = np.expand_dims(img_array, axis=0)  
    return img_array

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    start_total = time.time()

    contents = await file.read()
    
    start_pre = time.time()

    image = preprocess_image(contents)

    print("Preprocessing time:", round(time.time() - start_pre, 3), "seconds")

    start_pred = time.time()
    
    prediction = model.predict(image)[0][0]  # float value between 0 and 1
    print("Prediction time:", round(time.time() - start_pred, 3), "seconds")
    
    rotten_percent = round(float(prediction) * 100, 2)
    fresh_percent = round(100 - rotten_percent, 2)

    fresh_percent = max(0.0, min(100.0, fresh_percent))
    rotten_percent = 100 - fresh_percent

    print("Total time:", round(time.time() - start_total, 3), "seconds")
    print("Prediction value:", fresh_percent)

    return JSONResponse(content={
    "freshness": fresh_percent
})