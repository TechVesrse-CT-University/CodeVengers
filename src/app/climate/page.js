'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function WeatherPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const [climateData, setClimateData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClimate = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/climate?lat=28.61&lon=77.20`, {
          cache: 'no-store',
        });
        const data = await res.json();

        if (data.success) {
          setClimateData(data.climateData);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClimate();
  }, [baseUrl]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📈 Climate Charts</h1>

      {error && <p className="text-red-500">❌ Error: {error}</p>}

      {climateData.length > 0 && (
        <div className="grid gap-12">
          {/* Temperature Chart */}
          <ChartCard title="🌡 Temperature (°C)">
            <LineChart data={climateData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="temperature" stroke="#ff7f50" />
            </LineChart>
          </ChartCard>

          {/* Rainfall Chart */}
          <ChartCard title="🌧 Rainfall (mm/day)">
            <LineChart data={climateData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="rainfall" stroke="#1e90ff" />
            </LineChart>
          </ChartCard>

          {/* Radiation Chart */}
          <ChartCard title="☀️ Solar Radiation (kWh/m²/day)">
            <LineChart data={climateData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="radiation" stroke="#f4a261" />
            </LineChart>
          </ChartCard>

          {/* Wind Speed Chart */}
          <ChartCard title="💨 Wind Speed (m/s)">
            <LineChart data={climateData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="wind" stroke="#2a9d8f" />
            </LineChart>
          </ChartCard>

          {/* Humidity Chart */}
          <ChartCard title="💧 Relative Humidity (%)">
            <LineChart data={climateData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="humidity" stroke="#6a4c93" />
            </LineChart>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
