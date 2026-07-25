import React, { useState, useEffect } from 'react';
import { Play, Check, X, ArrowRight, ArrowLeft, Sparkles, Bot, Eye, Lock, MessageSquare } from 'lucide-react';

const TEACHER_TOUR_STEPS = [
  {
    step: 1,
    title: 'Teacher Session Room',
    desc: 'You are signed in as Dr. Vance. You enter room CS-204 and land in the Global Class Chatroom.',
    action: 'switch-chat-tab'
  },
  {
    step: 2,
    title: 'Gemma 4 AI Assistant Chatbot',
    desc: 'Ask Gemma 4 questions directly in the chatroom to get instructor insights and error trends.',
    action: 'open-ai-sidebar-teacher'
  },
  {
    step: 3,
    title: 'Transmitting Master Files',
    desc: 'Switch to Code Workspace to select and transmit master code files to all student sandboxes.',
    action: 'broadcast-file'
  },
  {
    step: 4,
    title: 'Force Edit Lock',
    desc: 'Lock a student editor to take control over WebSockets during live 1-on-1 collaboration.',
    action: 'toggle-teacher-lock'
  }
];

const STUDENT_TOUR_STEPS = [
  {
    step: 1,
    title: 'Student Session Room',
    desc: 'Signed in as Student. You enter room CS-204 and join the Global Class Chatroom.',
    action: 'switch-chat-tab'
  },
  {
    step: 2,
    title: 'Gemma 4 Hints & Guidance',
    desc: 'Gemma 4 provides step-by-step logic hints and non-spoiler debugging steps.',
    action: 'open-ai-sidebar-student'
  },
  {
    step: 3,
    title: 'Watch Teacher Live Stream',
    desc: 'Observe the instructor’s live code edits in real-time over WebSockets.',
    action: 'switch-live-teacher-tab'
  }
];

export default function GuidedTourDriver({ isActive, role = 'teacher', onClose, onExecuteTourStep }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const steps = role === 'student' ? STUDENT_TOUR_STEPS : TEACHER_TOUR_STEPS;

  useEffect(() => {
    if (isActive && steps[currentStepIdx]) {
      onExecuteTourStep(steps[currentStepIdx].action, role);
    }
  }, [isActive, currentStepIdx, role]);

  if (!isActive) return null;

  const stepObj = steps[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full glass-panel rounded-2xl border border-cyan-500/40 p-5 shadow-2xl backdrop-blur-2xl animate-fade-in space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase font-mono">
            Guided Demo Tour ({role.toUpperCase()})
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        <div className="text-xs font-bold text-cyan-300">
          Step {currentStepIdx + 1} of {steps.length}: {stepObj.title}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{stepObj.desc}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1"
        >
          {currentStepIdx === steps.length - 1 ? 'Finish Tour' : 'Next Step'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
