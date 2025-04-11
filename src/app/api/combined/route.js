// /app/api/combined/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';
import { stringify } from 'csv-stringify/sync';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

function generateRandomCoordinates(count = 2) {
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

const locations = generateRandomCoordinates(2); // Default count

function extractLayerValue(layers, layerName, depthLabel) {
  const layer = layers.find(l => l.name === layerName);
  const depth = layer?.depths.find(d => d.label === depthLabel);
  return {
    mean: depth?.values?.mean ?? null,
    uncertainty: depth?.values?.uncertainty ?? null,
  };
}

function timeoutFetch(url, timeout = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function GET() {
  const results = [];

  for (const { lat, lon } of locations) {
    try {
      const [soilRes, nasaRes, weatherRes] = await Promise.all([
        timeoutFetch(`https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}`),
        axios.get(`https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN,RH2M,WS2M&community=ag&longitude=${lon}&latitude=${lat}&format=JSON`),
        Promise.allSettled([
          timeoutFetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
          timeoutFetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
          timeoutFetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`)
        ])
      ]);

      const soilData = await soilRes.json();
      const climateData = nasaRes.data?.properties?.parameter;

      const [currentRes, forecastRes, airRes] = weatherRes;
      const current = currentRes.status === 'fulfilled' ? await currentRes.value.json() : {};
      const forecast = forecastRes.status === 'fulfilled' ? await forecastRes.value.json() : {};
      const air = airRes.status === 'fulfilled' ? await airRes.value.json() : {};

      const layers = soilData?.properties?.layers ?? [];

      results.push({
        lat,
        lon,
        temperature: current?.main?.temp ?? null,
        humidity: current?.main?.humidity ?? null,
        pressure: current?.main?.pressure ?? null,
        wind_speed: current?.wind?.speed ?? null,
        aqi: air?.list?.[0]?.main?.aqi ?? null,
        rainfall: climateData?.PRECTOTCORR?.ANN ?? null,
        solar_radiation: climateData?.ALLSKY_SFC_SW_DWN?.ANN ?? null,
        rh: climateData?.RH2M?.ANN ?? null,
        wind_climate: climateData?.WS2M?.ANN ?? null,
        temp_climate: climateData?.T2M?.ANN ?? null,

        ph: extractLayerValue(layers, 'phh2o', '0-5cm').mean,
        ph_uncertainty: extractLayerValue(layers, 'phh2o', '0-5cm').uncertainty,

        oc: extractLayerValue(layers, 'ocd', '0-5cm').mean,
        oc_uncertainty: extractLayerValue(layers, 'ocd', '0-5cm').uncertainty,

        soc: extractLayerValue(layers, 'soc', '0-5cm').mean,
        soc_uncertainty: extractLayerValue(layers, 'soc', '0-5cm').uncertainty,

        nitrogen: extractLayerValue(layers, 'nitrogen', '0-5cm').mean,
        nitrogen_uncertainty: extractLayerValue(layers, 'nitrogen', '0-5cm').uncertainty,

        sand: extractLayerValue(layers, 'sand', '0-5cm').mean,
        silt: extractLayerValue(layers, 'silt', '0-5cm').mean,
        clay: extractLayerValue(layers, 'clay', '0-5cm').mean,

        cec: extractLayerValue(layers, 'cec', '0-5cm').mean,
        cec_uncertainty: extractLayerValue(layers, 'cec', '0-5cm').uncertainty,

        wv0033: extractLayerValue(layers, 'wv0033', '0-5cm').mean,
        wv1500: extractLayerValue(layers, 'wv1500', '0-5cm').mean,
        wv0010: extractLayerValue(layers, 'wv0010', '0-5cm').mean
      });
    } catch (error) {
      results.push({ lat, lon, error: error.message });
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
      'Content-Disposition': 'attachment; filename="combined_data.csv"'
    }
  });
}