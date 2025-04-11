export default async function handler(req, res) {
    const { lat, lon } = req.body;
  
    try {
      // Step 1: Fetch all features
      const features = await fetchCombinedFeatures(lat, lon); // your existing function
      
      // Extract values in the correct order
      const featureValues = [
        features.temperature,
        features.humidity,
        features.pressure,
        features.wind_speed,
        features.aqi,
        features.temp_climate,
        features.rainfall,
        features.solar_radiation,
        features.rh,
        features.wind_climate,
        features.ph,
        features.oc,
        features.soc,
        features.nitrogen,
        features.cec,
        features.sand,
        features.silt,
        features.clay
      ];
  
      // Step 2: Send to Flask
      const flaskRes = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featureValues })
      });
  
      const prediction = await flaskRes.json();
      return res.status(200).json(prediction);
  
    } catch (error) {
      console.error("Prediction error:", error);
      return res.status(500).json({ error: error.message });
    }
  }
  