import React from 'react';
import { Code2, Radio, Globe, MessageSquare, Terminal, Share2, FileCode } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">EduSync</span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Next-generation real-time file collaboration platform for students and instructors. Powered by sub-millisecond WebSockets and automated isolated copy sandboxes.
            </p>

            {/* Live WS Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>WebSocket Relay Nodes: 100% Operational</span>
            </div>
          </div>

          {/* Links (7 Cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><a href="#demo" className="hover:text-white transition-colors">Live Simulator</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Workflow</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#architecture" className="hover:text-white transition-colors">WS Engine</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-4">Developers</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WebSocket API Spec</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CRDT State Protocol</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Canvas LMS Plugin</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Repository</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-4">Security</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">FERPA Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sandbox Isolation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Dashboard</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 EduSync Inc. Real-Time Student Collaboration Engine. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
