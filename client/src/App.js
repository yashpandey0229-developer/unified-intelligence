import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  const [complaints, setComplaints] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    fetch('/api/complaints').then(res => res.json()).then(data => setComplaints(data));
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
      setComplaints((prev) => [data, ...prev]);
      setInput("");
    } catch (err) { alert("Analysis Error"); }
    setLoading(false);
  };

  // NEW: Resolve & Delete Logic
  const handleResolve = async (id) => {
    if (!window.confirm("Mark as Resolved and delete from Database?")) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
      if (res.ok) setComplaints(complaints.filter(c => c._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="min-h-screen font-sans">
      <SignedOut>
        {/* Simple professional login screen */}
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6">
          <h1 className="text-3xl font-black italic mb-8">Unified Intelligence Login</h1>
          <SignInButton className="bg-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 shadow-xl" />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-slate-50 p-6">
          {/* Top Bar with Logout */}
          <nav className="max-w-4xl mx-auto flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border shadow-sm">
            <h1 className="font-black italic text-slate-900">COMMAND CENTER</h1>
            <UserButton afterSignOutUrl="/" />
          </nav>

          <div className="max-w-4xl mx-auto">
             {/* --- YOUR EXACT UI START --- */}
             <div className="bg-slate-900 rounded-[2rem] p-8 text-white mb-8 flex justify-between items-center shadow-xl">
               <div>
                 <h1 className="text-2xl font-bold italic tracking-tight">Unified Intelligence</h1>
                 <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Enterprise SLA Control</p>
               </div>
             </div>

             <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-8">
               <textarea className="w-full p-6 bg-slate-50 border rounded-2xl mb-4 min-h-[140px]" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter issue..."/>
               <button onClick={handleAnalyze} disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-lg">
                 {loading ? "ANALYZING..." : "ANALYZE WITH GEMINI 2.5 FLASH"}
               </button>
             </div>

             <div className="space-y-6">
               {complaints.map((c) => (
                 <div key={c._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <div className="flex justify-between mb-4">
                     <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded uppercase">{c.priority} Priority</span>
                     <span className="text-[10px] font-bold text-slate-400">SLA: {c.sla}</span>
                   </div>
                   <p className="text-slate-700 font-medium mb-6">"{c.text}"</p>
                   <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                     <button onClick={() => setSelectedCase(c)} className="text-blue-600 text-xs font-black hover:underline">View AI Reply</button>
                     <div className="flex gap-2">
                        <button onClick={() => handleResolve(c._id)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-emerald-700">RESOLVE</button>
                        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black">ESCALATE</button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             {/* --- YOUR EXACT UI END --- */}
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;