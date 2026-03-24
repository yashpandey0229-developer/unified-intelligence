import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  const [complaints, setComplaints] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null); // State for 360 View

  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => setComplaints(Array.isArray(data) ? data : []))
      .catch(() => console.log("Syncing..."));
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
    } catch (err) { alert("AI Error"); }
    setLoading(false);
  };

  const handleResolve = async (id) => {
    if (!window.confirm("Delete this resolved ticket?")) return;
    try {
      await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
      setComplaints(complaints.filter(c => c._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  // NEW: Escalate Functionality
  const handleEscalate = (id) => {
    alert(`🚨 CASE #${id.slice(-4).toUpperCase()} ESCALATED TO SENIOR MANAGEMENT`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
          <h1 className="text-3xl font-black italic mb-8">Unified Intelligence</h1>
          <SignInButton className="bg-blue-600 px-8 py-4 rounded-xl font-bold" />
        </div>
      </SignedOut>

      <SignedIn>
        <nav className="p-4 flex justify-between bg-white border-b max-w-4xl mx-auto mt-4 rounded-2xl shadow-sm">
          <h2 className="font-black italic text-slate-400">COMMAND CENTER</h2>
          <UserButton afterSignOutUrl="/" />
        </nav>

        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border mb-8">
            <textarea className="w-full p-4 bg-slate-50 rounded-2xl mb-4 h-32 border outline-none text-slate-700" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Analyze issue with Gemini 2.5 Flash..."/>
            <button onClick={handleAnalyze} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black tracking-widest uppercase text-xs">
              {loading ? "GEMINI 2.5 ANALYZING..." : "ANALYZE WITH AI"}
            </button>
          </div>

          <div className="space-y-4">
            {complaints.map(c => (
              <div key={c._id} className="bg-white p-7 rounded-[2rem] border shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${c.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {c.priority} Priority
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">SLA: {c.sla}</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed mb-6">"{c.text}"</p>
                <div className="flex justify-between border-t pt-5">
                  {/* FIX: Set selectedCase to open the 360 View Modal */}
                  <button onClick={() => setSelectedCase(c)} className="text-blue-600 text-[10px] font-black uppercase tracking-tighter hover:underline">360° AI VIEW</button>
                  <div className="flex gap-2">
                    <button onClick={() => handleResolve(c._id)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-[10px] font-black hover:bg-emerald-700">RESOLVE</button>
                    {/* FIX: Trigger Escalate Alert */}
                    <button onClick={() => handleEscalate(c._id)} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase">ESCALATE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </SignedIn>

      {/* 360° VIEW MODAL - Isse "360 degree view" kaam karega */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black italic tracking-tighter uppercase">AI Intelligence Report</h3>
               <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1 rounded-full font-black uppercase">{selectedCase.sentiment}</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Internal Analysis</p>
                <p className="bg-slate-50 p-4 rounded-2xl text-slate-600 italic text-sm leading-relaxed border border-slate-100">"{selectedCase.analysis}"</p>
              </div>
              
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Suggested Resolution Reply</p>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                   <p className="text-emerald-800 font-bold text-sm leading-relaxed">"{selectedCase.draftReply}"</p>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedCase(null)} className="w-full mt-10 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-colors">
              Close Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;