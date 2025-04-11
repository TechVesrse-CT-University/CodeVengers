// /app/api/weather-export/route.js

import { NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

function generateRandomCoordinates(count = 200) {
  const coordinates = new Set();
  while (coordinates.size < count) {
    const lat = +(Math.random() * (37 - 8) + 8).toFixed(4);
    const lon = +(Math.random() * (97 - 68) + 68).toFixed(4);
    coordinates.add(`${lat},${lon}`);
  }
  return Array.from(coordinates).map(c => {
    const [lat, lon] = c.split(',').map(Number);
    return { lat, lon };
  });
}

const locations = generateRandomCoordinates(200); // can increase this later

export async function GET() {
  const results = [];

  for (const { lat, lon } of locations) {
    try {
      const [currentRes, forecastRes, airRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
        fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`)
      ]);

      const [current, forecast, air] = await Promise.all([
        currentRes.json(),
        forecastRes.json(),
        airRes.json()
      ]);

      results.push({
        lat,
        lon,
        temperature: current?.main?.temp ?? null,
        humidity: current?.main?.humidity ?? null,
        pressure: current?.main?.pressure ?? null,
        wind_speed: current?.wind?.speed ?? null,
        aqi: air?.list?.[0]?.main?.aqi ?? null,
      });

    } catch (err) {
      results.push({ lat, lon, error: err.message });
    }
  }

  const csv = stringify(results, {
    header: true,
    columns: Object.keys(results[0] || {})
  });

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="weather_data.csv"'
    }
  });
}