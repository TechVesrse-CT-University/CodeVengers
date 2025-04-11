// /app/combined/page.js

'use client';
import React, { useState } from 'react';

export default function CombinedDataPage() {
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setFetching(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch('/api/combined');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.message || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch');
    }

    setFetching(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fetch Combined Climate, Soil, and Weather Data</h1>
      <button
        onClick={fetchData}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
        disabled={fetching}
      >
        {fetching ? 'Fetching...' : 'Fetch Data'}
      </button>

      {error && <p className="mt-4 text-red-600">❌ {error}</p>}

      {data && (
        <div className="mt-6 max-h-[70vh] overflow-y-auto border p-4 rounded bg-gray-100 text-sm">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
