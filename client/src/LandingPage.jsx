import React from 'react';
import { SignInButton } from "@clerk/clerk-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg rotate-12 shadow-[0_0_20px_rgba(37,99,235,0.5)]"></div>
          <span className="text-xl font-black italic tracking-tighter">UNIFIED INTELLIGENCE</span>
        </div>
        <SignInButton mode="modal">
          <button className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full text-sm font-bold border border-white/10 transition-all">
            Operator Login
          </button>
        </SignInButton>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Next-Gen Gemini 2.5 Flash Triage
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-[0.9]">
          COMMAND THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">CHAOS.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
          The world's first AI-native incident response platform. 
          Automate triage, analyze sentiment, and resolve tickets with **Gemini 2.5 Flash** intelligence.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-1">
              DEPLOY SYSTEM NOW
            </button>
          </SignInButton>
          <button className="px-12 py-5 rounded-2xl font-black text-lg text-slate-400 hover:text-white transition-all">
            Watch Technical Demo
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 border-t border-white/5 pt-16">
          {[
            { label: 'Latency', val: '< 400ms' },
            { label: 'AI Accuracy', val: '99.9%' },
            { label: 'SLA Boost', val: '4.5x' },
            { label: 'Security', val: 'Clerk-Shield' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-black mb-1">{stat.val}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;