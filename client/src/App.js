import React, { useState, useEffect } from 'react';

function App() {
  // 1. DEFENSIVE STATE REHYDRATION: Ensuring 'complaints' is ALWAYS an array
  const [complaints, setSetComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem("unified_complaints");
      const parsed = saved ? JSON.parse(saved) : [];
      // If the data exists but isn't an array (the cause of your crash), return []
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Storage corrupted, resetting to empty array.");
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. AUTOMATIC PERSISTENCE: Syncing to LocalStorage on every change
  useEffect(() => {
    localStorage.setItem("unified_complaints", JSON.stringify(complaints));
  }, [complaints]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      // Note: Ensure your Vercel Environment Variables (GEMINI_API_KEY) are set
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      
      if (!response.ok) throw new Error("API Error");
      
      const data = await response.json();
      // Safety: Only add to state if 'data' is a valid object
      if (data) {
        setSetComplaints((prev) => [data, ...prev]);
      }
      setInput("");
    } catch (err) {
      console.error("Analysis failed", err);
      alert("Analysis failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear all complaints from the dashboard?")) {
      localStorage.removeItem("unified_complaints");
      setSetComplaints([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Unified Intelligence</h1>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {complaints.length} Active Issues
          </span>
        </div>

        <div className="space-y-4">
          <textarea 
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            rows="4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the customer complaint or technical issue here..."
          />
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAnalyze} 
              disabled={loading || !input.trim()}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
            >
              {loading ? "Processing with Gemini..." : "Analyze with Gemini"}
            </button>
            
            <button 
              onClick={handleClear}
              className="px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
              title="Clear Dashboard"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Analysis Results</h2>
          {complaints.length === 0 ? (
            <p className="text-gray-400 text-center py-8 italic">No complaints analyzed yet. Type something above to start.</p>
          ) : (
            complaints.map((item, index) => (
              <div key={index} className="p-5 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg shadow-sm animate-fade-in">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {item.category || "General Triage"}
                  </span>
                  <span className="text-gray-400 text-xs">Recently Added</span>
                </div>
                <p className="text-gray-800 leading-relaxed">
                  {item.analysis || item.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;