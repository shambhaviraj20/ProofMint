export async function analyzeIdea(title, description, existingTexts) {
  console.log("🧪 ANALYZE PAYLOAD:", {
    title,
    description,
    existing_texts: existingTexts,
  });

  const res = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      existing_texts: existingTexts || [],
    }),
  });

  return res.json();
}
