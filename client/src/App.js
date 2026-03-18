import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);

  // 💡 TEMP FIX: Changed back to localhost for your local testing
  const API_BASE_URL = "/api/complaints";

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      await axios.post(API_BASE_URL, { text: inputText });
      setInputText('');
      fetchComplaints();
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/${id}`, { 
        status: 'Escalated', 
        severity: 'Critical' 
      });
      fetchComplaints();
    } catch (err) {
      console.error("Escalation failed:", err);
    }
  };

  const handleResolve = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchComplaints();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Unified Intelligence</h1>
          <p className="text-slate-500 font-medium italic">Enterprise Gen-AI Triage & SLA Dashboard</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-slate-700">{complaints.length} Active Issues</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] shadow-xl border border-white h-fit">
          <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><span>🤖</span> AI Simulator</h2>
          <textarea 
            className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Type a complaint..."
            rows="6"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            onClick={handleProcess}
            disabled={loading}
            className={`w-full mt-4 py-4 rounded-2xl font-bold text-white shadow-lg ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
          >
            {loading ? "Analyzing..." : "Analyze with Gemini"}
          </button>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {complaints.map((item) => {
            const deadlineDate = new Date(item.deadline);
            const isOverdue = deadlineDate < new Date();
            return (
              <div key={item._id} className={`bg-white p-6 rounded-[2rem] border transition-all ${isOverdue ? 'border-red-200' : 'border-slate-100'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] px-2 py-1 rounded bg-slate-100 font-black">{item.severity}</span>
                      {item.status === 'Escalated' && <span className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded font-black">ESCALATED</span>}
                    </div>
                    <h3 className="font-bold text-slate-800">{item.summary}</h3>
                    <p className="text-xs text-slate-400 italic mt-1 truncate max-w-md">{item.text}</p>
                    <p className={`text-[11px] font-bold mt-2 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                      SLA: {deadlineDate.toLocaleString()} {isOverdue && "(BREACHED)"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setSelectedReply(item)} className="px-4 py-2 text-[10px] font-black text-blue-600 bg-blue-50 rounded-lg">VIEW AI REPLY</button>
                    <button onClick={() => handleEscalate(item._id)} className="px-4 py-2 text-[10px] font-black text-orange-600 border border-orange-100 rounded-lg">ESCALATE</button>
                    <button onClick={() => handleResolve(item._id)} className="px-4 py-2 text-[10px] font-black text-slate-400 hover:text-red-500">RESOLVE</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedReply && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl">
            <h2 className="text-2xl font-black mb-4 text-slate-800">Review Draft</h2>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6 italic text-slate-700">"{selectedReply.suggestedReply}"</div>
            <div className="flex gap-4">
              <button onClick={() => { alert("Sent!"); setSelectedReply(null); }} className="flex-1 bg-blue-600 py-4 rounded-2xl text-white font-black shadow-lg shadow-blue-100">APPROVE</button>
              <button onClick={() => setSelectedReply(null)} className="flex-1 bg-slate-100 py-4 rounded-2xl text-slate-500 font-bold">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;