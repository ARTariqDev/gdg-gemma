import React, { useState, useEffect } from 'react';
import { Sparkles, X, UserCheck, GraduationCap, Lightbulb, Code2, Bot, RefreshCw, SendHorizontal } from 'lucide-react';
import { socket } from '../socket';

export default function GemmaAiSidebar({ isOpen, onClose, currentFile, initialRole }) {
  const [role, setRole] = useState(initialRole || 'teacher');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiAnswers, setAiAnswers] = useState([]);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    const handleAiResponse = (data) => {
      setIsGenerating(false);
      setAiAnswers(prev => [data, ...prev]);
    };

    socket.on('ai-response', handleAiResponse);

    return () => {
      socket.off('ai-response', handleAiResponse);
    };
  }, []);

  const handleAskGemma = (questionText) => {
    const promptText = questionText || customPrompt || (role === 'teacher'
      ? 'Analyze student error patterns, time/space complexity, and pedagogical hint questions for this code.'
      : 'Provide step-by-step guidance, logic hints, and debugging checkpoints without giving direct solutions.');

    setIsGenerating(true);

    socket.emit('ask-ai', {
      roomId: 'CS-204',
      question: promptText,
      role: role,
      document: currentFile ? currentFile.content : undefined
    });

    if (customPrompt) setCustomPrompt('');
  };

  const teacherSuggestions = [
    {
      type: 'Pedagogical Tip',
      title: 'Guide Recursion Base Case',
      desc: '30% of students struggle with the base condition `if root is None: return Node(key)`. Ask them what happens when searching an empty subtree rather than giving the solution.'
    },
    {
      type: 'Common Pitfall',
      title: 'Off-By-One In Binary Search',
      desc: 'Watch out for Maya’s copy: she typed `left <= right` but forgot `right = mid - 1`, causing an infinite loop during odd-length array tests.'
    },
    {
      type: 'Discussion Prompt',
      title: 'Time & Space Complexity',
      desc: 'Prompt the room: "What is the worst-case space complexity of binary tree insertion when the tree becomes degenerate (unbalanced)?"'
    }
  ];

  const studentSuggestions = [
    {
      type: 'Step-by-Step Hint',
      title: 'Understanding Pointer Updating',
      desc: 'Notice how `root.left = insert_node(root.left, key)` updates the left child link. Make sure your function returns the modified node back to the caller.'
    },
    {
      type: 'Debugging Checkpoint',
      title: 'Handling Null/None Roots',
      desc: 'Before accessing `root.val`, verify `root` is not null. Your current code handles this on Line 2—great job!'
    },
    {
      type: 'Practice Challenge',
      title: 'Try Implementing Deletion',
      desc: 'Once insertion works, try writing a `delete_node` function. Remember to handle nodes with two children using the in-order successor.'
    }
  ];

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 right-0 h-full w-full sm:w-[450px] z-50 bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Gemma 4 AI Assistant</h3>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
                Model: Gemma-4
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Contextual Real-Time Suggestions</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 bg-slate-900/40 border-b border-slate-800/80">
        <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-2">
          Select User Role (Passed to Gemma 4 Prompt)
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setRole('teacher')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teacher / Host</span>
          </button>

          <button
            onClick={() => setRole('student')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'student'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student</span>
          </button>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-900/20 border-b border-slate-800/60 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5 truncate">
          <Code2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">{currentFile ? currentFile.name : 'binary_tree_lab.py'}</span>
        </span>
        <button
          onClick={() => handleAskGemma()}
          disabled={isGenerating}
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] shrink-0 font-bold"
        >
          <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Querying Gemma 4...' : 'Ask Gemma 4'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskGemma();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder={role === 'teacher' ? 'Ask Gemma 4 teacher insights...' : 'Ask Gemma 4 student debugging hint...'}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
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

        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-xs text-indigo-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            {role === 'teacher'
              ? 'Gemma 4 is tailoring prompts for Instructor Insights: pedagogical hints, classroom error trends, and question triggers.'
              : 'Gemma 4 is tailoring prompts for Student Guidance: step-by-step logic hints and non-spoiler debugging steps.'}
          </span>
        </div>

        {aiAnswers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
              Live Gemma 4 Socket Responses ({aiAnswers.length})
            </h4>
            {aiAnswers.map((ans, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/50 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono border-b border-indigo-900/80 pb-2">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" /> Gemma 4 ({ans.role.toUpperCase()})
                  </span>
                  <span className="text-slate-400">{ans.time}</span>
                </div>
                <div className="text-xs font-semibold text-white">Q: "{ans.question}"</div>
                <p className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                  {ans.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider pt-2">
          {role === 'teacher' ? 'Recommended Pedagogical Insights' : 'Guided Learning Checkpoints'}
        </h4>

        {(role === 'teacher' ? teacherSuggestions : studentSuggestions).map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleAskGemma(item.title + ': ' + item.desc)}
            className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-slate-900 text-indigo-300 border border-slate-800 px-2 py-0.5 rounded font-bold">
                {item.type}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 group-hover:underline">Ask Gemma →</span>
            </div>

            <h4 className="text-xs font-bold text-white flex items-center gap-1">
              {item.title}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
