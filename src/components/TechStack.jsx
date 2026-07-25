import React, { useState, useEffect } from 'react';
import { Cpu, Radio, Shield, Zap, Terminal, Activity, ArrowUpRight, Server, Check } from 'lucide-react';

export default function TechStack() {
  const [packetCount, setPacketCount] = useState(14820);
  const [latency, setLatency] = useState(3.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount(p => p + Math.floor(Math.random() * 8) + 2);
      setLatency(+(3.1 + Math.random() * 0.6).toFixed(1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="architecture" className="py-24 bg-slate-900/80 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-purple-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Tech Explanation (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>WebSocket Architecture Deep-Dive</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Engineered for <span className="gradient-text">Sub-Millisecond Sync</span> across 1000+ Nodes
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Traditional classroom tools rely on heavy screensharing video encoding, consuming massive bandwidth. EduSync transmits raw text delta patches over bi-directional WebSocket connections—reducing bandwidth by 99.4%.
            </p>

            {/* Architecture Highlights */}
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Persistent Binary WebSockets</h4>
                  <p className="text-xs text-slate-400">
                    Full-duplex channels keep student sandboxes synchronized with zero HTTP handshake overhead.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">On-Demand Copy-on-Write Memory</h4>
                  <p className="text-xs text-slate-400">
                    Master files are stored as immutable reference buffers. Student copies inherit state until modified, ensuring instant spawning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live WS Telemetry Panel (6 Cols) */}
          <div className="lg:col-span-6">
            <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Cluster Telemetry</h3>
                    <p className="text-xs text-slate-400">WebSocket Node #08 (US-East)</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  HEALTHY
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-mono text-slate-400 block mb-1">Average Latency</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
                    {latency} <span className="text-xs text-cyan-400 font-sans">ms</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-mono text-slate-400 block mb-1">Frames Transmitted</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">
                    {packetCount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Latency Comparison Table */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">Latency Benchmark</span>
                
                <div className="space-y-2">
                  {/* EduSync WS */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1 font-semibold">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> EduSync WebSockets
                      </span>
                      <span className="font-mono text-emerald-400">3.4ms</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[8%]" />
                    </div>
                  </div>

                  {/* Standard HTTP Polling */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>HTTP REST Polling</span>
                      <span className="font-mono text-amber-400">250ms</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[45%]" />
                    </div>
                  </div>

                  {/* Video Screen Share */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Video Screenshare Stream</span>
                      <span className="font-mono text-rose-400">850ms</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
