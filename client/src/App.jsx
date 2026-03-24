import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  const [complaints, setComplaints] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    fetch('https://unified-intelligence.vercel.app/api/complaints')
      .then(res => res.json())
      .then(data => setComplaints(Array.isArray(data) ? data : []))
      .catch(() => console.log("Syncing..."));
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      // App.jsx mein fetch calls ko wapas normal kar do:
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

  return (
    <div className="min-h-screen bg-slate-50">
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
          <h1 className="text-3xl font-bold mb-8 italic">Unified Intelligence</h1>
          <SignInButton className="bg-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-700" />
        </div>
      </SignedOut>

      <SignedIn>
        <nav className="p-4 flex justify-between bg-white border-b max-w-4xl mx-auto mt-4 rounded-xl shadow-sm">
          <h2 className="font-black italic">COMMAND CENTER</h2>
          <UserButton afterSignOutUrl="/" />
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border mb-8">
            <textarea className="w-full p-4 bg-slate-50 rounded-xl mb-4 h-32 border outline-none" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Analyze customer issue..."/>
            <button onClick={handleAnalyze} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold transition-all hover:bg-blue-700">
              {loading ? "GEMINI 2.5 ANALYZING..." : "ANALYZE WITH AI"}
            </button>
          </div>
          <div className="space-y-4">
            {complaints.map(c => (
              <div key={c._id} className="bg-white p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase ${c.priority === 'High' ? 'text-red-600' : 'text-blue-600'}`}>{c.priority} Priority</span>
                  <span className="text-[10px] font-bold text-slate-400">SLA: {c.sla}</span>
                </div>
                <p className="text-slate-700 font-medium">"{c.text}"</p>
                <div className="flex justify-between border-t mt-5 pt-4">
                  <button onClick={() => setSelectedCase(c)} className="text-blue-600 text-xs font-black hover:underline">360° VIEW</button>
                  <div className="flex gap-2">
                    <button onClick={() => handleResolve(c._id)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-[10px] font-black hover:bg-emerald-700">RESOLVE</button>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-black">ESCALATE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </SignedIn>
    </div>
  );
}
export default App;