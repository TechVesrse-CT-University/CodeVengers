export async function POST(req, res) {
  const body = await req.json();
  const { features } = body;

  console.log("features : ", features);

  const flaskRes = await fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features: features }),
  });

  const prediction = await flaskRes.json();

  if (prediction) {
    return new Response(JSON.stringify({ prediction }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "prediction failed" }), {
    status: 400,
  });
}
