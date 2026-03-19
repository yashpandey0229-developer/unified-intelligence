import React, { useState, useEffect } from 'react';

function App() {
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem("unified_complaints");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAIResponse, setSelectedAIResponse] = useState(null); // For the Modal

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
      
      // Ensure data includes priority and sla from backend
      setComplaints((prev) => [data, ...prev]);
      setInput("");
    } catch (err) {
      console.error("Analysis failed", err);
      alert("Analysis failed. Ensure backend returns priority/sla fields.");
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

  const handleElevate = (id) => {
    alert(`Issue ${id} has been escalated to a Senior Human Agent. Priority: CRITICAL.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans text-slate-900">
      {/* AI Reply Modal */}
      {selectedAIResponse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-blue-600">✨</span> AI Full Response
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {selectedAIResponse}
            </p>
            <button 
              onClick={() => setSelectedAIResponse(null)}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Close Insight
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
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
          {/* Input Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Issue Description</label>
            <textarea 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all min-h-[120px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'Customer received a damaged package...'"
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
            <button onClick={handleClear} className="flex-1 bg-white border border-slate-200 text-slate-400 py-4 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 transition-all">
              Reset
            </button>
          </div>

          {/* Results Area */}
          <div className="pt-8 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Triages</h2>
            
            <div className="space-y-6">
              {complaints.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                  <p className="text-slate-400 italic">No active issues detected.</p>
                </div>
              ) : (
                complaints.map((c, i) => {
                  const issueId = Math.random().toString(36).substr(2, 6).toUpperCase();
                  return (
                    <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-[10px] font-black rounded uppercase ${
                            c.priority === 'High' ? 'bg-red-100 text-red-600' : 
                            c.priority === 'Moderate' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {c.priority || 'Moderate'} Priority
                          </span>
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase">
                            {c.category || 'General'}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                          SLA: {c.sla || '24 Hours'}
                        </div>
                      </div>

                      <p className="text-slate-700 text-sm mb-5 leading-relaxed">
                        <span className="font-bold text-slate-400 mr-2">#{issueId}</span>
                        {c.text}
                      </p>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                        <button 
                          onClick={() => setSelectedAIResponse(c.analysis || "AI processed this issue successfully.")}
                          className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          View AI Reply
                        </button>
                        <button 
                          onClick={() => handleElevate(issueId)}
                          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
                        >
                          Elevate to Human
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;