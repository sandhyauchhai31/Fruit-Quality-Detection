import axios from 'axios'
import './index.css'
import { useState } from 'react'
import FruitUpload from './components/FruitUpload'

function App() {
  // const [file, setFile] = useState(null);
  // const [result, setResult] = useState(null);

  // const handleUpload = async () => {
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await axios.post("http://localhost:8000/predict", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     console.log("Prediction response:", response.data);
  //     setResult(response.data.freshness); // Save freshness value

  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <FruitUpload/>
      {/* <h1>Fruit Freshness Detector</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Predict</button>

      {result !== null && (
        <div>
          <h2>Prediction Result:</h2>
          <p>Freshness: {(result * 100).toFixed(2)}%</p>
        </div>
      )} */}
    </div>
  )
}

export default App
