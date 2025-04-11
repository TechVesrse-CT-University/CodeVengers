import axios from "axios";
import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

const stateBoundingBoxes = {
  Ladakh: { minLat: 32.5, maxLat: 36.8, minLon: 76.5, maxLon: 80.0 },



};


// Output CSV path
const csvPath = path.join(process.cwd(), "climate_data.csv");

// Create CSV writer
const csvWriter = createObjectCsvWriter({
  path: csvPath,
  header: [
    { id: "state", title: "State" },
    { id: "month", title: "Month" },
    { id: "temperature", title: "Temperature (°C)" },
    { id: "rainfall", title: "Rainfall (mm)" },
    { id: "radiation", title: "Radiation (kWh/m²/day)" },
    { id: "humidity", title: "Humidity (%)" },
    { id: "windSpeed", title: "Wind Speed (m/s)" },
  ],
  append: false, // Overwrite file each run (set true to append)
});

async function fetchClimateDataForState(state, box) {
  const lat = (box.minLat + box.maxLat) / 2;
  const lon = (box.minLon + box.maxLon) / 2;

  const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN,RH2M,WS2M&community=ag&longitude=${lon}&latitude=${lat}&format=JSON`;

  try {
    const res = await axios.get(url);
    const data = res.data?.properties?.parameter;

    if (!data) {
      console.warn(`No data received for ${state}`);
      return [];
    }

    const temperature = data.T2M;
    const rainfall = data.PRECTOTCORR;
    const radiation = data.ALLSKY_SFC_SW_DWN || {};
    const humidity = data.RH2M || {};
    const windSpeed = data.WS2M || {};

    const monthlyData = Object.keys(temperature).map((month) => ({
      state,
      month,
      temperature: temperature[month],
      rainfall: rainfall[month],
      radiation: radiation[month] || null,
      humidity: humidity[month] || null,
      windSpeed: windSpeed[month] || null,
    }));

    return monthlyData;
  } catch (err) {
    console.error(`Error fetching data for ${state}:`, err?.response?.data || err.message);
    return [];
  }
}

async function main() {
  console.log("Fetching climate data for all states...");

  let allData = [];

  for (const [state, box] of Object.entries(stateBoundingBoxes)) {
    console.log(`→ Fetching data for ${state}`);
    const stateData = await fetchClimateDataForState(state, box);
    allData.push(...stateData);
  }
  console.log(allData);
  

  // await csvWriter.writeRecords(allData);
  console.log("✅ Data written to", csvPath);
}

main();
