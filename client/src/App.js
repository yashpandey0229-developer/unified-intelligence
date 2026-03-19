import React, { useState, useEffect } from 'react';

function App() {
  // 1. Load data from browser memory on startup with safety check
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem("unified_complaints");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Automatically save to memory whenever 'complaints' changes
  useEffect(() => {
    localStorage.setItem("unified_complaints", JSON.stringify(complaints));
  }, [complaints]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      
      setComplaints((prev) => [data, ...prev]);
      setInput("");
    } catch (err) {
      console.error("Analysis failed", err);
      alert("Analysis failed. Check Vercel logs for API Key issues.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Reset the dashboard?")) {
      localStorage.removeItem("unified_complaints");
      setComplaints([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Unified Intelligence</h1>
            <p className="text-slate-400 text-sm">Enterprise AI Triage & SLA Dashboard</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase">{complaints.length} Issues</span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Issue Description</label>
            <textarea 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all min-h-[120px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'Customer received a damaged package and is requesting a refund...'"
            />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleAnalyze} 
              disabled={loading || !input.trim()}
              className="flex-[3] bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-300 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              {loading ? "Processing via Gemini AI..." : "Analyze & Categorize"}
            </button>
            <button 
              onClick={handleClear} 
              className="flex-1 bg-white border border-slate-200 text-slate-400 py-4 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 transition-all"
            >
              Reset
            </button>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              Recent Triages
            </h2>
            
            <div className="space-y-4">
              {complaints.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                  <p className="text-slate-400 italic">No active issues detected. Awaiting input...</p>
                </div>
              ) : (
                complaints.map((c, i) => (
                  <div key={i} className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded">
                        {c.category || "AI_TRIAGE_PENDING"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm">{c.analysis || c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;