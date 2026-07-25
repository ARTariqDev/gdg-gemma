import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How does EduSync handle file distribution when an instructor selects a file?',
    a: 'When an instructor launches a session and picks a master file, EduSync generates an isolated, independent working copy for each connected student endpoint. This copy is transmitted via persistent low-latency WebSockets directly to each student sandbox.'
  },
  {
    q: 'Can students overwrite each other’s code or files?',
    a: 'No. Each student operates in a separate sandbox isolated by unique WebSocket channels. Students cannot alter their peers’ files. However, the host/instructor has master privileges and can jump into any student’s copy at any time.'
  },
  {
    q: 'How does the host (instructor) collaborate with a specific student?',
    a: 'The instructor dashboard displays live status cards of every student. Clicking "Collaborate" on any student card establishes an instant dual-cursor co-editing session. Both the instructor and student can type, highlight, debug, and run code together in real-time.'
  },
  {
    q: 'Why use WebSockets instead of traditional video screensharing?',
    a: 'Video screensharing consumes up to 5-10 Mbps per student and causes noticeable input lag. WebSockets transmit lightweight code diffs (a few kilobytes), using 99% less bandwidth and providing instant sub-5ms synchronization.'
  },
  {
    q: 'What happens if a student loses internet connection during class?',
    a: 'EduSync maintains local IndexedDB buffer queues. Edits made while offline are queued and seamlessly merged via CRDT operational transformation as soon as the WebSocket reconnects.'
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-24 bg-slate-900/40 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400 text-base">
            Everything you need to know about real-time classroom collaboration on EduSync.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
