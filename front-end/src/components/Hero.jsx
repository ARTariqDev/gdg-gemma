import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Radio, Sparkles, Play, Shield, Cpu, Code, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenDemo }) {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in badge & title
      gsap.from(badgeRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from(titleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
      });

      // Float hero code preview
      gsap.from(previewRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.96,
        duration: 1.2,
        delay: 0.4,
        ease: 'power3.out',
      });

      // Continuous float effect on floating badges
      gsap.to('.hero-float-1', {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.easeInOut',
      });
      gsap.to('.hero-float-2', {
        y: 12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.easeInOut',
        delay: 0.5,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Gradient Mesh & Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Real-time Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 shadow-inner mb-6 backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-200 tracking-wide">
              Ultra-Low Latency WebSocket Architecture
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Sub-5ms Delta Sync
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            Real-Time File Collaboration for{' '}
            <span className="gradient-text glow-text">Classrooms & Labs</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl leading-relaxed mb-10">
            Instructors launch live instances and select master files. EduSync instantly clones, isolates, and transmits dedicated working copies to every student over WebSockets—allowing host monitoring & 1-click pair editing.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span>Try Interactive Classroom Demo</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium text-base transition-all flex items-center justify-center gap-2.5 backdrop-blur-md"
            >
              <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              <span>See Workflow (2 Min)</span>
            </a>
          </div>

          {/* Key Value Props Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left mb-12">
            <div className="glass-card rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instant Copy-on-Dispatch</h4>
                <p className="text-[11px] text-slate-400">Unique sandbox per student</p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Bi-Directional WS Stream</h4>
                <p className="text-[11px] text-slate-400">Host oversight in real-time</p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">1-Click Host Takeover</h4>
                <p className="text-[11px] text-slate-400">Co-edit any student file</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Code & Workspace Teaser Window */}
        <div ref={previewRef} className="relative max-w-5xl mx-auto mt-4">
          {/* Floating Badge 1 - Host Indicator */}
          <div className="hero-float-1 absolute -top-6 -left-4 sm:left-4 z-20 glass-panel px-4 py-2 rounded-2xl border border-indigo-500/40 shadow-xl flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold block">Host / Instructor</span>
              <span className="text-xs font-semibold text-white">Dr. Vance (CS204)</span>
            </div>
            <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
              Broadcasting file.py
            </span>
          </div>

          {/* Floating Badge 2 - Live Sync Ping */}
          <div className="hero-float-2 absolute -bottom-6 -right-4 sm:right-4 z-20 glass-panel px-4 py-2 rounded-2xl border border-cyan-500/40 shadow-xl flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">WebSocket Stream</span>
                <span className="text-[10px] font-mono text-emerald-400">3.4ms</span>
              </div>
              <span className="text-[11px] text-slate-400">28 Active Student Sandboxes</span>
            </div>
          </div>

          {/* Main IDE Teaser Container */}
          <div className="glass-panel rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Window Header */}
            <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  EduSync Master Instance :: [Lab_3_BinarySearch.py]
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ws://edusync.internal/room-4091
                </span>
              </div>
            </div>

            {/* Split Screen Preview (Instructor left, Student right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/80 bg-slate-950/70 p-4 sm:p-6 font-mono text-xs sm:text-sm">
              {/* Left Column - Host Master File */}
              <div className="pr-0 md:pr-4 pb-4 md:pb-0 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 mb-3">
                  <span className="text-xs font-semibold text-indigo-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    Host Master Template (Broadcasted)
                  </span>
                  <span className="text-[10px] text-slate-500">Read-Only Source</span>
                </div>

                <div className="text-slate-400 space-y-1 leading-relaxed">
                  <p><span className="text-purple-400">def</span> <span className="text-blue-400">binary_search</span>(arr, target):</p>
                  <p className="pl-4 text-slate-500"># Instructor exercise template</p>
                  <p className="pl-4">left, right = <span className="text-amber-400">0</span>, len(arr) - <span className="text-amber-400">1</span></p>
                  <p className="pl-4"><span className="text-purple-400">while</span> left &lt;= right:</p>
                  <p className="pl-8">mid = (left + right) // <span className="text-amber-400">2</span></p>
                  <p className="pl-8"><span className="text-purple-400">if</span> arr[mid] == target:</p>
                  <p className="pl-12 text-emerald-400"><span className="text-purple-400">return</span> mid  <span className="text-slate-500"># Found index</span></p>
                  <p className="pl-8 text-cyan-400 flex items-center gap-1">
                    <span className="text-purple-400">elif</span> arr[mid] &lt; target:
                  </p>
                  <p className="pl-12">left = mid + <span className="text-amber-400">1</span></p>
                </div>
              </div>

              {/* Right Column - Live Student Copy with Co-Editing Cursor */}
              <div className="pt-4 md:pt-0 pl-0 md:pl-4 space-y-2 relative">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-xs font-semibold text-cyan-300">Maya's Sandbox (Copy #04)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    WS Live Sync
                  </span>
                </div>

                <div className="text-slate-300 space-y-1 leading-relaxed relative">
                  <p><span className="text-purple-400">def</span> <span className="text-blue-400">binary_search</span>(arr, target):</p>
                  <p className="pl-4">left, right = <span className="text-amber-400">0</span>, len(arr) - <span className="text-amber-400">1</span></p>
                  <p className="pl-4"><span className="text-purple-400">while</span> left &lt;= right:</p>
                  <p className="pl-8">mid = (left + right) // <span className="text-amber-400">2</span></p>

                  {/* Instructor Live Cursor Glow */}
                  <div className="pl-8 py-1 my-1 bg-indigo-500/10 border-l-2 border-indigo-400 rounded-r relative flex items-center justify-between">
                    <span className="text-white">right = mid - <span className="text-amber-400">1</span></span>
                    {/* Floating Instructor Tag */}
                    <span className="text-[9px] font-mono bg-indigo-600 text-white px-1.5 py-0.5 rounded shadow-md font-bold animate-pulse">
                      Dr. Vance (Host Editing)
                    </span>
                  </div>

                  <p className="pl-4"><span className="text-purple-400">return</span> -<span className="text-amber-400">1</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
