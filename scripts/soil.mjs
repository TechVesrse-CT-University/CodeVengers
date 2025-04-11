// fetchSoilData.mjs

import fs from 'fs/promises';
import { Parser } from 'json2csv';

const stateBoundingBoxes = {
    AndhraPradesh: { minLat: 12.6, maxLat: 19.1, minLon: 76.7, maxLon: 84.7 },
    ArunachalPradesh: { minLat: 26.0, maxLat: 29.5, minLon: 91.5, maxLon: 97.3 },
    Assam: { minLat: 24.0, maxLat: 27.9, minLon: 89.7, maxLon: 96.1 },
    Bihar: { minLat: 24.0, maxLat: 27.5, minLon: 83.0, maxLon: 88.0 },
    Chhattisgarh: { minLat: 17.8, maxLat: 24.0, minLon: 80.2, maxLon: 84.2 },
    Goa: { minLat: 14.9, maxLat: 15.8, minLon: 73.7, maxLon: 74.3 },
    Gujarat: { minLat: 20.0, maxLat: 24.7, minLon: 68.4, maxLon: 74.5 },
    Haryana: { minLat: 27.4, maxLat: 30.9, minLon: 74.5, maxLon: 77.5 },
    HimachalPradesh: { minLat: 30.4, maxLat: 33.2, minLon: 75.8, maxLon: 79.0 },
    Jharkhand: { minLat: 22.2, maxLat: 24.8, minLon: 83.0, maxLon: 87.9 },
    Karnataka: { minLat: 11.5, maxLat: 18.5, minLon: 74.0, maxLon: 78.5 },
    Kerala: { minLat: 8.1, maxLat: 12.8, minLon: 74.8, maxLon: 77.6 },
    MadhyaPradesh: { minLat: 21.2, maxLat: 26.9, minLon: 74.0, maxLon: 82.5 },
    Maharashtra: { minLat: 15.6, maxLat: 22.1, minLon: 72.6, maxLon: 80.9 },
    Manipur: { minLat: 23.8, maxLat: 25.7, minLon: 93.5, maxLon: 94.9 },
    Meghalaya: { minLat: 25.0, maxLat: 26.3, minLon: 89.5, maxLon: 92.5 },
    Mizoram: { minLat: 21.9, maxLat: 24.1, minLon: 92.2, maxLon: 93.3 },
    Nagaland: { minLat: 25.3, maxLat: 27.0, minLon: 93.4, maxLon: 95.2 },
    Odisha: { minLat: 18.0, maxLat: 22.7, minLon: 81.5, maxLon: 87.5 },
    Punjab: { minLat: 29.5, maxLat: 32.5, minLon: 73.8, maxLon: 76.9 },
    Rajasthan: { minLat: 23.3, maxLat: 30.1, minLon: 69.3, maxLon: 76.5 },
    Sikkim: { minLat: 27.0, maxLat: 28.1, minLon: 88.0, maxLon: 88.9 },
    TamilNadu: { minLat: 8.1, maxLat: 13.4, minLon: 76.1, maxLon: 80.2 },
    Telangana: { minLat: 15.8, maxLat: 19.6, minLon: 77.0, maxLon: 81.2 },
    Tripura: { minLat: 23.5, maxLat: 24.5, minLon: 91.2, maxLon: 92.5 },
    UttarPradesh: { minLat: 23.5, maxLat: 30.3, minLon: 77.0, maxLon: 84.7 },
    Uttarakhand: { minLat: 28.4, maxLat: 31.3, minLon: 77.5, maxLon: 81.2 },
    WestBengal: { minLat: 21.5, maxLat: 27.1, minLon: 85.8, maxLon: 89.9 },
  };
  

function extractLayerValue(layers, property, depth) {
  const layer = layers[property];
  if (!layer || !layer.depths) return { mean: null, uncertainty: null };

  const depthLayer = layer.depths.find(d => d.range === depth);
  return {
    mean: depthLayer?.values?.mean ?? null,
    uncertainty: depthLayer?.values?.uncertainty ?? null,
  };
}

const output = [];

for (const [lat, lon] of coordinates) {
  try {
    const res = await fetch(`https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}`);
    const data = await res.json();
    const layers = data?.properties?.layers;

    if (!layers) {
      console.warn(`No layers for [${lat}, ${lon}]`);
      continue;
    }

    output.push({
      lat,
      lon,
      ph: extractLayerValue(layers, 'phh2o', '0-5cm').mean,
      organic_carbon: extractLayerValue(layers, 'ocd', '0-5cm').mean,
      nitrogen: extractLayerValue(layers, 'nitrogen', '0-5cm').mean,
      bulk_density: extractLayerValue(layers, 'bdod', '0-5cm').mean,
      cation_exchange: extractLayerValue(layers, 'cec', '0-5cm').mean,
      sand: extractLayerValue(layers, 'sand', '0-5cm').mean,
      silt: extractLayerValue(layers, 'silt', '0-5cm').mean,
      clay: extractLayerValue(layers, 'clay', '0-5cm').mean,
    });

    console.log(`Fetched for [${lat}, ${lon}]`);
  } catch (error) {
    console.error(`Failed for [${lat}, ${lon}]`, error);
  }
}

const parser = new Parser();
const csv = parser.parse(output);

await fs.writeFile('soil_data.csv', csv);
console.log('CSV file created: soil_data.csv');
