"use client";
import { useSearchParams } from 'next/navigation';

export default function CropPredictor() {

  const searchParams = useSearchParams();
  const data = searchParams.get('data');


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold mb-6">🌾 KisaanMitra: Crop Recommendation</h1>

      {data && (
        <div className="mt-6 text-xl text-green-800 font-semibold">
          ✅ Best Crop for You: <span className="underline">{data}</span>
        </div>
      )}

    </div>
  );
}
