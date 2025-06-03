import axios from 'axios'
import '../index.css'
import { useState } from 'react'
import LoadingSpinner from "./LoadingSpinner";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function FruitUpload() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    
    const getChartData = () => ({
      labels: ['Fresh', 'Rotten'],
        datasets: [
          {
            data: [result?.fresh || 0, result?.rotten || 0],
            backgroundColor: ['#22c55e', '#ef4444'],
            borderWidth: 1,
          },
        ],
      });

    
    const handleImageChange = (e) => {
        const file = e.target.files[0];     
        setResult(null);
        setError('');

        if(file){
          const isImage = file.type.startsWith('image/');
          const isTooBig = file.size > 5 * 1024 * 1024; // 5MB limit

          if (!isImage) return setError('Only image files are allowed.');
          if (isTooBig) return setError('File size must be less than 5MB.');

          setImage(file);
          setPreview(URL.createObjectURL(file));
        }
    };
    
    const handleUpload = async () => {
        console.log("Upload button clicked");
        if (!image) return;
        // setResult({ fresh: 80, rotten: 20 });
        setLoading(true);
        setError('');
    
        const formData = new FormData();
        formData.append("file", image);

        try {
        // setLoading(true);
        const res = await axios.post("http://localhost:8000/predict", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        
        // const freshnessPercent = res.data.freshness;
        // const fresh = parseFloat((freshness * 100).toFixed(2));
        // const rottenPercent = 100 - freshnessPercent;

        const freshness = res.data.freshness;
        const fresh = parseFloat(freshness.toFixed(2));
        const rotten = parseFloat((100 - fresh).toFixed(2));

         setResult({ fresh, rotten });

        // setResult({
        //   fresh: freshnessPercent,
        //   rotten: rottenPercent,
        // });
        

        } catch (err) {
          console.error("Prediction failed", err);
          setError('Failed to upload or process the image.');
        } finally {
          setLoading(false);
        }
    };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg space-y-5">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          🍎 Fruit Quality Checker
        </h1>

        <label className="block w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-green-500">
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <span className="text-gray-500">{image ? image.name : 'Click to upload a fruit image'}</span>
        </label>

        {/* {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Fruit preview"
            className="w-full h-56 object-cover rounded-lg"
          />
        )} */}

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-56 object-cover rounded-lg shadow"
          />
        )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={!image || loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition disabled:opacity-50"
        >
          {loading ? <LoadingSpinner /> : 'Upload & Predict'}
        </button>

        {result && (
          <div className="mt-4 space-y-3 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Prediction Results</h2>
            <div className="w-48 mx-auto">
              <Pie data={getChartData()} />
            </div>
            <p className="text-green-600 font-medium"> Fresh: {result.fresh}%</p>
            <p className="text-red-500 font-medium"> Rotten: {result.rotten}%</p>
          </div>
        )}
      </div>
    </div>

  )
}

export default FruitUpload