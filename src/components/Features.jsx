import React from 'react';
import { Zap, Shield, Cpu, Users, GitBranch, Terminal, Radio, Lock, History, LayoutGrid, CheckCircle } from 'lucide-react';

const FEATURES = [
  {
    title: 'WebSocket Sub-5ms Synchronization',
    description: 'Instant state synchronization between host and student nodes using binary WebSocket frames and optimized diff compression.',
    icon: Zap,
    gradient: 'from-indigo-500 to-cyan-500',
    tag: 'Real-time Protocol'
  },
  {
    title: 'Isolated Copy-on-Connect Engine',
    description: 'Every student automatically receives a sandboxed copy upon joining. No student can accidentally overwrite a classmate’s work.',
    icon: Shield,
    gradient: 'from-cyan-500 to-emerald-500',
    tag: 'Zero Crosstalk'
  },
  {
    title: 'Master Host Monitor & Takeover',
    description: 'Instructors view live thumbnails of every student screen. Click any student to instantly attach dual-cursor co-editing.',
    icon: Users,
    gradient: 'from-purple-500 to-indigo-500',
    tag: 'Host Control'
  },
  {
    title: 'CRDT Conflict-Free State',
    description: 'Operational transformation ensures concurrent edits between host and student never produce merge conflicts or lost data.',
    icon: GitBranch,
    gradient: 'from-pink-500 to-rose-500',
    tag: 'State Engine'
  },
  {
    title: 'Integrated Browser Terminal',
    description: 'Run Python scripts, React apps, C++ binaries, or SQL queries directly in the browser with live stdout/stderr streams.',
    icon: Terminal,
    gradient: 'from-emerald-500 to-teal-500',
    tag: 'Zero-Setup IDE'
  },
  {
    title: 'Auto-Snapshot & LMS Export',
    description: 'Continuous snapshotting records the exact timeline of every student’s edits. Export directly to Canvas, Blackboard, or GitHub.',
    icon: History,
    gradient: 'from-amber-500 to-orange-500',
    tag: 'Grading Ready'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Built for <span className="gradient-text">High-Scale Classrooms</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Purpose-built to solve the friction of traditional screensharing and file distribution in education.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-7 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${feat.gradient} text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-full font-semibold">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-indigo-400 group-hover:text-cyan-400 transition-colors">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Enterprise Grade Architecture</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
