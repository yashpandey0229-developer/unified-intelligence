import React, { useState, useEffect } from 'react';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  // Load from MongoDB on Startup
  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(err => console.error("Fetch Error:", err));
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setComplaints([data, ...complaints]);
      setInput("");
    } catch (err) { alert("Analysis Error"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      {/* 360° AI Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Gen-AI 360° Analysis</h3>
            <p className="bg-slate-50 p-4 rounded-xl text-slate-700 mb-6">{selected.analysis}</p>
            <p className="text-emerald-700 italic font-medium mb-8">"{selected.draftReply}"</p>
            <button onClick={() => setSelected(null)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">Back</button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white mb-8 shadow-xl">
          <h1 className="text-3xl font-black italic">Unified Intelligence</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Enterprise SLA Control</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-8">
          <textarea className="w-full p-6 bg-slate-50 border rounded-2xl mb-4 min-h-[140px]" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter issue..."/>
          <button onClick={handleAnalyze} disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-lg">
            {loading ? "PRO ENGINE ANALYZING..." : "ANALYZE WITH GEMINI"}
          </button>
        </div>

        <div className="space-y-6">
          {complaints.map((c, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded uppercase">{c.priority} Priority</span>
                <span className="text-[10px] font-bold text-slate-400">SLA: {c.sla}</span>
              </div>
              <p className="text-slate-700 font-medium mb-6 leading-relaxed">"{c.text}"</p>
              <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                <button onClick={() => setSelected(c)} className="text-blue-600 text-xs font-black hover:underline">View 360° Reply</button>
                <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black">ESCALATE</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;