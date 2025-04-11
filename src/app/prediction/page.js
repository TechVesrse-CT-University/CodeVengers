"use client"
import { useEffect, useState } from 'react';

export default function CropPredictor() {
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState('');
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ lat: null, lon: null });

  // Get user geolocation on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        (err) => {
          console.error(err);
          setError('Geolocation permission denied');
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  }, []);

  const handlePredict = async () => {
    if (!location.lat || !location.lon) {
      setError('Location not detected');
      return;
    }

    setLoading(true);
    setError('');
    setCrop('');

    try {
      const res = await fetch('/api/prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: location.lat, lon: location.lon }),
      });

      const data = await res.json();

      if (data.prediction) {
        setCrop(data.prediction);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold mb-6">🌾 KisaanMitra: Crop Predictor</h1>

      {location.lat && location.lon ? (
        <p className="mb-4 text-gray-700">
          📍 Your location: <strong>{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</strong>
        </p>
      ) : (
        <p className="mb-4 text-gray-500">Detecting location...</p>
      )}

      <button
        onClick={handlePredict}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
      >
        {loading ? 'Predicting...' : 'Predict Best Crop'}
      </button>

      {crop && (
        <div className="mt-6 text-xl text-green-800 font-semibold">
          ✅ Best Crop for You: <span className="underline">{crop}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600">{error}</div>
      )}
    </div>
  );
}
