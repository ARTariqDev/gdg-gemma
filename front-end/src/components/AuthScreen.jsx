import React from 'react';
import { GraduationCap, UserCheck, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function AuthScreen({ onSelectRole }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full glass-panel rounded-3xl border border-slate-800 p-8 sm:p-12 shadow-2xl relative z-10 backdrop-blur-2xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>EduSync & Google Gemma 4</span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Welcome to <span className="gradient-text">EduSync</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Real-time collaborative classroom with Gemma 4 AI chat, automated file summaries, and live code sync.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Teacher Auth Option */}
          <button
            onClick={() => onSelectRole('teacher')}
            className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900/80 border border-indigo-500/30 hover:border-indigo-400 hover:scale-[1.02] transition-all group shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Sign in as Teacher
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Host classrooms, broadcast files, monitor student sandboxes, and guide discussion.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
              <span>Continue as Educator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Student Auth Option */}
          <button
            onClick={() => onSelectRole('student')}
            className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 hover:scale-[1.02] transition-all group shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Sign in as Student
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Join session rooms, receive file copies, chat live, and get Gemma 4 AI hints.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
              <span>Continue as Student</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure WebSocket
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Gemma 4 Powered
          </span>
        </div>
      </div>
    </div>
  );
}
