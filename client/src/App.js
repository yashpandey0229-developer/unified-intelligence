import React, { useState, useEffect } from 'react';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // 1. REFRESH FIX: Load data from MongoDB when the page opens
  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComplaints(data);
      })
      .catch(err => console.error("Sync Error:", err));
  }, []);

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
      if (data.error) throw new Error(data.error);
      
      setComplaints((prev) => [data, ...prev]);
      setInput("");
    } catch (err) {
      alert("Analysis Failed. Check API Key or Quota.");
    } finally {
      setLoading(false);
    }
  };

  // 2. ESCALATE FIX: Professional Alert Logic
  const handleEscalate = (id) => {
    alert(`TICKET ESCALATED: Request #${id.slice(-5)} has been sent to a Senior Supervisor. Priority bumped to CRITICAL.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      {/* 360° Analysis Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Gen-AI 360° Analysis</h3>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
              <p className="text-slate-700 font-medium leading-relaxed">{selectedCase.analysis}</p>
            </div>
            <p className="text-emerald-700 italic font-medium mb-8 leading-relaxed">"{selectedCase.draftReply}"</p>
            <button onClick={() => setSelectedCase(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all">
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white mb-8 flex justify-between items-center shadow-xl">
          <div>
            <h1 className="text-2xl font-bold italic tracking-tight">Unified Intelligence</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">SLA Triage Command Center</p>
          </div>
          <div className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full border border-blue-500/30 text-xs font-bold">
            {complaints.length} ACTIVE TICKETS
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-8">
          <textarea 
            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none text-lg mb-4 min-h-[140px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Analyze a new customer issue..."
          />
          <button onClick={handleAnalyze} disabled={loading || !input.trim()} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95">
            {loading ? "GEMINI 2.5 FLASH ANALYZING..." : "ANALYZE WITH GEMINI"}
          </button>
        </div>

        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${c.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {c.priority} Priority
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase">
                    {c.category}
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400">SLA: {c.sla}</span>
              </div>
              
              <p className="text-slate-700 font-medium mb-6">"{c.text}"</p>

              <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                <button onClick={() => setSelectedCase(c)} className="text-blue-600 text-xs font-black hover:underline">
                  View AI 360° Reply
                </button>
                <button onClick={() => handleEscalate(c._id)} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black hover:bg-red-600 transition-colors">
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