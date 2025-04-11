// app/weather/page.js
'use client';

import { useEffect, useState } from 'react';

export default function WeatherPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const res = await fetch(`/api/weather?lat=28.61&lon=77.20`);
      const json = await res.json();
      console.log(json);
      setData(json);
    };
    fetchWeather();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">🌤 Weather Info</h1>
      {data && data.success ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
