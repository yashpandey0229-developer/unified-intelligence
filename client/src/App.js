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
  const [selectedAI, setSelectedAI] = useState(null);

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
      const data = await response.json();
      setComplaints((prev) => [data, ...prev]);
      setInput("");
    } catch (err) {
      alert("AI Analysis Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      {/* AI INSIGHT MODAL */}
      {selectedAI && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg text-white text-xl">✨</div>
              <h3 className="text-2xl font-bold text-slate-900">Gen-AI 360° Analysis</h3>
            </div>
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-6 whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
              {selectedAI.analysis}
            </div>
            <button onClick={() => setSelectedAI(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all">
              Close Insight
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white mb-8 flex justify-between items-center shadow-2xl">
          <div>
            <h1 className="text-3xl font-bold mb-1">Unified Communication Dashboard</h1>
            <p className="text-slate-400 font-medium">Gen-AI Powered Complaint Triage & SLA Tracking</p>
          </div>
          <div className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full border border-emerald-500/30 font-bold">
            {complaints.length} ACTIVE CASES
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-10">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">New Complaint Entry</h2>
          <textarea 
            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all text-lg mb-6 min-h-[150px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the customer issue here..."
          />
          <div className="flex gap-4">
            <button onClick={handleAnalyze} disabled={loading || !input.trim()} className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:bg-slate-300">
              {loading ? "GENERATING AI INSIGHTS..." : "ANALYZE & CATEGORISE"}
            </button>
            <button onClick={() => setComplaints([])} className="px-8 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all">
              RESET
            </button>
          </div>
        </div>

        {/* RECENT CASES */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 ml-2">Recent Triages</h2>
          {complaints.map((c, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${c.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {c.severity} Severity
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase">
                  {c.category}
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${c.sentiment === 'Negative' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {c.sentiment} Sentiment
                </span>
                <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase">SLA: {c.sla}</span>
              </div>
              
              <p className="text-slate-700 font-medium mb-6 leading-relaxed">"{c.text}"</p>

              <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                <button onClick={() => setSelectedAI(c)} className="text-blue-600 text-sm font-black flex items-center gap-2 hover:underline">
                  View 360° AI Reply
                </button>
                <button onClick={() => alert("Manager Notified")} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-red-600 transition-colors">
                  ESCALATE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;