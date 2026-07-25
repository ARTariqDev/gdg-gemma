import React, { useState } from 'react';
import { KeyRound, GraduationCap, UserCheck, ArrowRight, ArrowLeft, Radio } from 'lucide-react';

export default function RoomEntryScreen({ role, onEnterRoom, onBackToAuth }) {
  const [roomKey, setRoomKey] = useState('CS-204');
  const [username, setUsername] = useState(role === 'teacher' ? 'Dr. Vance (Teacher)' : 'Alex Rivers (Student)');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomKey.trim()) return;
    onEnterRoom({
      roomId: roomKey.trim().toUpperCase(),
      username: username.trim(),
      role
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full glass-panel rounded-3xl border border-slate-800 p-8 shadow-2xl relative z-10 backdrop-blur-2xl space-y-6">
        <button
          onClick={onBackToAuth}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Switch Role</span>
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            {role === 'teacher' ? <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> : <UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
            <span>Role: <strong className="capitalize text-white">{role}</strong></span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            {role === 'teacher' ? 'Open Classroom Session' : 'Join Classroom Session'}
          </h2>
          <p className="text-xs text-slate-400">
            Enter room key to open the global classroom chatroom.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5 flex items-center justify-between">
              <span>Session / Room Key</span>
              <span className="text-[10px] text-cyan-400">Any key works</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. CS-204, GEMMA-2026"
                value={roomKey}
                onChange={(e) => setRoomKey(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white font-mono uppercase tracking-wider focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:scale-[1.01] text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <Radio className="w-4 h-4 animate-pulse text-cyan-300" />
            <span>Enter Global Chatroom</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 font-mono">
            💡 Default Preset Room Key: <span className="text-cyan-300 font-bold">CS-204</span>
          </p>
        </div>
      </div>
    </div>
  );
}
