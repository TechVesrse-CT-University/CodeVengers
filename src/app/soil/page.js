'use client';

import { useEffect, useState } from 'react';

export default function SoilProfile() {
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded coordinates for testing (Chandigarh)
  const lat = 30.74;
  const lon = 76.79;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/soil?lat=30.74&lon=76.79`);
        const data = await res.json();
        setSoilData(data);
      } catch (err) {
        console.error('Failed to fetch soil data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading soil data...</div>;
  if (!soilData) return <div className="text-sm text-red-600">No soil data found.</div>;

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold text-green-800 mb-3">🌱 Soil Profile</h2>
      <ul className="space-y-2 text-sm text-green-900">
        <li><span className="font-semibold">pH (0–5 cm):</span> {soilData.ph}</li>
        <li><span className="font-semibold">Organic Carbon:</span> {soilData.organicCarbon} g/kg</li>
        <li><span className="font-semibold">Nitrogen:</span> {soilData.nitrogen} g/kg</li>
        <li><span className="font-semibold">Clay:</span> {soilData.clay} %</li>
        <li><span className="font-semibold">Sand:</span> {soilData.sand} %</li>
      </ul>
    </div>
  );
}
