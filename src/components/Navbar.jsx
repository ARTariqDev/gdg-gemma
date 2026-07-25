import React, { useState } from 'react';
import { Radio, Users, Sparkles, ArrowRight, X, Terminal, Code2 } from 'lucide-react';

export default function Navbar({ onOpenDemo }) {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      alert(`Connecting to WebSocket instance room: ${roomCode.toUpperCase()}...`);
      setIsJoinOpen(false);
      onOpenDemo();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <nav className="glass-panel rounded-2xl px-5 py-3.5 flex items-center justify-between border border-slate-800/80 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-white">EduSync</span>
                  <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
                    v2.4 Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">Real-Time Classroom Collaboration</p>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#demo" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                Live Demo
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#architecture" className="hover:text-white transition-colors">
                WS Engine
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
            </div>

            {/* CTA Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsJoinOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all"
              >
                <Users className="w-4 h-4 text-indigo-400" />
                Join Room
              </button>

              <button
                onClick={onOpenDemo}
                className="relative group overflow-hidden rounded-xl p-[1px] font-medium text-sm focus:outline-none"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl group-hover:opacity-100 transition-opacity opacity-80 blur-[2px]"></span>
                <span className="relative px-4 py-2 rounded-xl bg-slate-950 flex items-center gap-2 text-white group-hover:bg-slate-900 transition-colors">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Launch Session</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Join Room Modal */}
      {isJoinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsJoinOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Join Classroom Room</h3>
                <p className="text-xs text-slate-400">Enter room code generated by your instructor</p>
              </div>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Room Access Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS-4091-LIVE"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-indigo-500 uppercase placeholder:text-slate-600 placeholder:normal-case placeholder:tracking-normal placeholder:text-sm"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-300 flex items-start gap-2">
                <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                <span>
                  Joining will instantly establish a sub-5ms WebSocket connection and pull your allocated file copy.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                >
                  Connect WebSocket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
