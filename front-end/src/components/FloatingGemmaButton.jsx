import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, X, Code2, RefreshCw, SendHorizontal, Lightbulb, CheckCircle2, Zap } from 'lucide-react';
import { socket } from '../socket';

export default function FloatingGemmaButton({ activeDocument = '', activeFileName = 'binary_tree_lab.py', role = 'teacher' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [aiHistory, setAiHistory] = useState([]);

  // Frontend cache indexed by role + filename + document prefix
  const [frontendCache, setFrontendCache] = useState(new Map());

  // Listen for socket AI response
  useEffect(() => {
    const handleAiResponse = (data) => {
      setIsGenerating(false);
      const newResponse = {
        question: data.question,
        answer: data.answer,
        time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiHistory(prev => [newResponse, ...prev]);

      const cacheKey = `${role}:${activeFileName}:${activeDocument.slice(0, 80)}`;
      setFrontendCache(prev => new Map(prev).set(cacheKey, newResponse));
    };

    socket.on('ai-response', handleAiResponse);
    return () => socket.off('ai-response', handleAiResponse);
  }, [role, activeFileName, activeDocument]);

  const handleFetchQuickSuggestions = (promptText = '') => {
    const cacheKey = `${role}:${activeFileName}:${activeDocument.slice(0, 80)}`;

    if (!promptText && frontendCache.has(cacheKey)) {
      console.log('⚡ Instant frontend cached Gemma 4 analysis hit');
      const cached = frontendCache.get(cacheKey);
      setAiHistory(prev => (prev.find(p => p.question === cached.question) ? prev : [cached, ...prev]));
      return;
    }

    setIsGenerating(true);
    const query = promptText || (role === 'teacher'
      ? 'Summarize this file code, identify common student syntax pitfalls, and suggest 2 pedagogical questions.'
      : 'Explain this code step-by-step, highlight key logic checkpoints, and give non-spoiler debugging hints.');

    socket.emit('ask-ai', {
      roomId: 'CS-204',
      question: query,
      role: role,
      document: activeDocument
    });

    if (customQuestion) setCustomQuestion('');
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (aiHistory.length === 0) {
      handleFetchQuickSuggestions();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-2xl shadow-cyan-500/40 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group ring-4 ring-cyan-400/30 animate-bounce"
        title="Ask Gemma AI (Reads Active Open Editor Code)"
      >
        <Bot className="w-6 h-6 text-cyan-200 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold font-mono tracking-wider hidden sm:inline pr-1">
          Ask Gemma AI
        </span>
        <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
      </button>

      {/* Floating Interactive AI Assistant Drawer Modal with Transparent Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-4 bg-transparent pointer-events-none animate-fade-in">
          <div className="pointer-events-auto glass-panel w-full sm:w-[460px] max-h-[80vh] rounded-3xl border border-cyan-500/50 shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-2xl bg-slate-950/95">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    Gemma 4 Live Assistant
                    <span className="text-[9px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
                      {role} Mode
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-[240px]">
                    Active File: <strong className="text-indigo-300">{activeFileName}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Code Context Bar */}
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 truncate">
                <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{activeDocument ? `${activeDocument.slice(0, 40)}...` : 'Empty Editor'}</span>
              </span>
              <button
                onClick={() => handleFetchQuickSuggestions()}
                disabled={isGenerating}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 shrink-0"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Analyzing...' : 'Re-Analyze'}</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Question Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFetchQuickSuggestions(customQuestion);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder={role === 'teacher' ? 'Ask Gemma 4 about code complexity, bugs...' : 'Ask Gemma 4 logic hints...'}
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow flex items-center gap-1"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Gemma AI Answers List */}
              {aiHistory.length > 0 ? (
                <div className="space-y-3">
                  {aiHistory.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono border-b border-indigo-900/80 pb-1.5">
                        <span className="text-cyan-300 font-bold flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5" /> Gemma 4 ({role.toUpperCase()})
                        </span>
                        <span className="text-slate-400">{item.time}</span>
                      </div>
                      <div className="text-xs font-semibold text-white">Q: "{item.question}"</div>
                      <p className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                  <Lightbulb className="w-6 h-6 text-cyan-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-mono">
                    Gemma 4 is inspecting <strong className="text-indigo-300">{activeFileName}</strong>... Click "Re-Analyze" or type a prompt above.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-2">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Gemma 4 AI Engine • Non-Blocking Transparent Overlay</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
