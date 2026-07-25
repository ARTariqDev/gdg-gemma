import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Copy, Radio, Users, CheckCircle2, ShieldCheck, Zap, Layers, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: '01',
    title: 'Host Instance & File Selection',
    subtitle: 'Instructor Launches the Room',
    description: 'The instructor initializes a meeting room instance (e.g. CS-101 Lab) and selects the assignment file or base template (Python, React, C++, Jupyter, Markdown).',
    icon: Layers,
    accent: 'from-indigo-500 to-purple-500',
    badge: 'Room Setup',
    details: ['Supports 500+ code & document formats', 'Custom read/write permission locks', 'Instant session link generation']
  },
  {
    number: '02',
    title: 'Automated Copy Generation',
    subtitle: 'WebSocket Transmission to Students',
    description: 'As students join the room, EduSync generates a distinct, isolated working copy for each student and streams it via low-latency WebSockets in sub-5ms.',
    icon: Copy,
    accent: 'from-cyan-500 to-blue-500',
    badge: 'Copy Engine',
    details: ['Zero copy delay per student node', 'Zero crosstalk between student files', 'Sub-millisecond WS packet sync']
  },
  {
    number: '03',
    title: 'Isolated Student Workspaces',
    subtitle: 'Independent Editing & Modification',
    description: 'Each student modifies their own dedicated copy of the file in real-time. Code execution and edits happen safely in isolated sandbox containers.',
    icon: ShieldCheck,
    accent: 'from-emerald-500 to-teal-500',
    badge: 'Student Sandbox',
    details: ['Independent undo/redo state trees', 'Embedded terminal and test runner', 'Real-time diff tracking']
  },
  {
    number: '04',
    title: 'Host Oversight & Pair Editing',
    subtitle: 'Host Access & 1-Click Collaboration',
    description: 'The instructor has master access to all student files in a live monitoring grid. Selecting any student seamlessly establishes a dual-cursor co-editing session.',
    icon: Users,
    accent: 'from-purple-500 to-pink-500',
    badge: 'Master Control',
    details: ['Live grid monitoring of all student screens', '1-click instructor takeover & audio chat', 'Automatic snapshot & grading exports']
  }
];

export default function Workflow() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.workflow-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="how-it-works" className="py-24 bg-slate-900/60 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Architecture & Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            How <span className="gradient-text">EduSync</span> Collaborates in Real-Time
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            From file selection to individual copy distribution and host takeover—engineered for seamless classroom performance over WebSockets.
          </p>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="workflow-card glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all duration-300"
              >
                {/* Number Watermark */}
                <span className="absolute -top-4 -right-4 text-7xl sm:text-8xl font-black text-slate-800/30 group-hover:text-indigo-500/10 transition-colors pointer-events-none font-mono">
                  {step.number}
                </span>

                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${step.accent} text-white shadow-lg shadow-indigo-500/20`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono uppercase bg-slate-900 border border-slate-800 text-indigo-300 px-3 py-1 rounded-full font-semibold">
                    {step.badge}
                  </span>
                </div>

                {/* Subtitle & Title */}
                <span className="text-xs font-semibold text-indigo-400 block mb-1 uppercase tracking-wider">
                  Step {step.number} :: {step.subtitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Details List */}
                <div className="space-y-2 pt-4 border-t border-slate-800/80">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
