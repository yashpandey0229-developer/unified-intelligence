import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  const [complaints, setComplaints] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => setComplaints(Array.isArray(data) ? data : []))
      .catch(() => console.log("Database Syncing..."));
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
      setComplaints(prev => [data, ...prev]);
      setInput("");
    } catch (err) { alert("AI Handshake Failed"); }
    setLoading(false);
  };

  const handleResolve = async (id) => {
    if (!window.confirm("Archive this issue permanently?")) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
      if (res.ok) setComplaints(complaints.filter(c => c._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6">
          <h1 className="text-4xl font-black italic mb-8 border-b-4 border-blue-600 pb-2">Unified Intelligence</h1>
          <SignInButton className="bg-blue-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 shadow-2xl transition-all" />
          <p className="mt-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Enterprise Auth Required</p>
        </div>
      </SignedOut>

      <SignedIn>
        <nav className="max-w-4xl mx-auto flex justify-between items-center p-4 bg-white mt-4 rounded-2xl border shadow-sm">
          <span className="font-black italic text-slate-300 text-[10px] tracking-widest">ACTIVE SESSION</span>
          <UserButton afterSignOutUrl="/" />
        </nav>

        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white mb-10 shadow-2xl">
            <h1 className="text-3xl font-black italic tracking-tighter">Unified Intelligence</h1>
            <p className="text-blue-400 text-[10px] uppercase tracking-[0.3em] mt-2 font-black">SLA Triage Command</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-10">
            <textarea className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl mb-4 min-h-[150px] outline-none text-slate-700" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter issue..."/>
            <button onClick={handleAnalyze} disabled={loading || !input.trim()} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-lg hover:bg-blue-700 transition-all">
              {loading ? "GEMINI 2.5 FLASH ANALYZING..." : "ANALYZE WITH GEMINI"}
            </button>
          </div>

          <div className="space-y-6">
            {complaints.map((c) => (
              <div key={c._id} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <span className={`px-3 py-1 rounded text-[10px] font-black uppercase ${c.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {c.priority} Priority
                  </span>
                  <span className="text-[10px] font-black text-slate-300 uppercase">SLA: {c.sla}</span>
                </div>
                <p className="text-slate-700 font-medium mb-8 leading-relaxed">"{c.text}"</p>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <button onClick={() => setSelectedCase(c)} className="text-blue-600 text-xs font-black hover:underline uppercase">360° VIEW</button>
                  <div className="flex gap-3">
                    <button onClick={() => handleResolve(c._id)} className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-5 py-2 rounded-xl text-[10px] font-black hover:bg-emerald-600 hover:text-white transition-all">RESOLVE</button>
                    <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black">ESCALATE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </SignedIn>

      {selectedCase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-2xl">
            <h3 className="text-2xl font-black mb-6">AI Deep Analysis</h3>
            <p className="bg-slate-50 p-6 rounded-2xl text-slate-600 mb-8 italic">"{selectedCase.analysis}"</p>
            <div className="bg-emerald-50 p-6 rounded-2xl mb-10">
               <p className="text-emerald-800 font-bold text-sm leading-relaxed">"{selectedCase.draftReply}"</p>
            </div>
            <button onClick={() => setSelectedCase(null)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">Back to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;