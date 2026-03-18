import React, { useState, useEffect } from 'react';

function App() {
  // 1. Load data from browser memory on startup
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem("unified_complaints");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Automatically save to memory whenever 'complaints' changes
  useEffect(() => {
    localStorage.setItem("unified_complaints", JSON.stringify(complaints));
  }, [complaints]);

  const handleAnalyze = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();
      setComplaints([data, ...complaints]); // Add new one to top
      setInput("");
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("unified_complaints");
    setComplaints([]);
  };

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Unified Intelligence Dashboard</h1>
      <textarea 
        className="w-full p-2 border rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a complaint..."
      />
      <div className="mt-4">
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Analyze with Gemini"}
        </button>
        <button 
          onClick={handleClear} 
          className="ml-4 text-gray-500 hover:text-red-500 underline"
        >
          Clear Dashboard
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {complaints.map((c, i) => (
          <div key={i} className="p-4 border rounded bg-gray-50 shadow-sm">
            <p className="font-semibold text-blue-700">{c.category || "General"}</p>
            <p>{c.analysis || c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;