import React, { useState, useEffect } from 'react';
import { MessageSquare, Bot, SendHorizontal, Sparkles, Monitor, ArrowLeft, Users, Zap, Code2, RefreshCw, Send, UserCheck, GraduationCap, LogOut } from 'lucide-react';
import { socket } from '../socket';

export default function CentralChatroom({
  roomId = 'CS-204',
  userRole = 'teacher',
  username = 'Dr. Vance',
  onOpenClassroom,
  onSignOut,
  onToggleGemmaSidebar
}) {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Dr. Vance (Teacher)', role: 'teacher', text: `Welcome to classroom session ${roomId}! I will be broadcasting binary_tree_lab.py shortly.`, time: '13:20' },
    { id: 2, sender: 'Alex Rivers (Student)', role: 'student', text: 'Hey Dr. Vance! Excited for today’s lab on binary search tree insertion.', time: '13:21' },
    { id: 3, sender: 'Maya Lin (Student)', role: 'student', text: 'Hi everyone! Ready with my Python environment.', time: '13:22' },
    {
      id: 4,
      isGemmaSummary: true,
      fileName: 'binary_tree_lab.py',
      summary: {
        keyConcept: 'Binary Search Tree Insertion',
        complexity: 'Time: O(log N) average, Space: O(H) call stack',
        explanation: 'Gemma 4 AI Summary: Demonstrates recursive node traversal. Base case creates a new Node when root is null. Left subtree handles smaller keys; right subtree handles larger keys.'
      },
      time: '13:24'
    },
    { id: 5, sender: 'Jordan Vance (Student)', role: 'student', text: 'The Gemma 4 summary card is super clear! Checking line 6 now.', time: '13:25' },
    { id: 6, sender: 'Chen Wei (Student)', role: 'student', text: 'Is space complexity O(H) due to call stack frames during recursion?', time: '13:26' },
    { id: 7, sender: 'Dr. Vance (Teacher)', role: 'teacher', text: 'Exactly Chen! In degenerate skewed trees, height H equals N.', time: '13:27' }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiChatResponses, setAiChatResponses] = useState([]);

  // Listen for socket events
  useEffect(() => {
    socket.emit('join-room', { roomId, username, role: userRole });

    const handleFileBroadcasted = (data) => {
      const gemmaMsg = data.message || {
        id: Date.now(),
        isGemmaSummary: true,
        fileName: data.fileName,
        summary: data.summary,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, gemmaMsg]);
    };

    const handleAiResponse = (data) => {
      setIsAskingAi(false);
      setAiChatResponses(prev => [data, ...prev]);
    };

    socket.on('file-broadcasted', handleFileBroadcasted);
    socket.on('ai-response', handleAiResponse);

    return () => {
      socket.off('file-broadcasted', handleFileBroadcasted);
      socket.off('ai-response', handleAiResponse);
    };
  }, [roomId, username, userRole]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: username || (userRole === 'student' ? 'Student Alex' : 'Dr. Vance (Teacher)'),
      role: userRole,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewMessage('');
  };

  const handleAskGemmaDirectly = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAskingAi(true);

    socket.emit('ask-ai', {
      roomId,
      question: aiPrompt.trim(),
      role: userRole
    });

    setAiPrompt('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Global Header Bar */}
      <div className="max-w-6xl w-full mx-auto mb-4 flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-black text-sm text-white">
            E
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Global Class Chatroom
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                Room: {roomId}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {userRole === 'teacher' ? <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> : <UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{username}</span>
            <span className="text-[9px] uppercase font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded">
              {userRole}
            </span>
          </div>

          <button
            onClick={onOpenClassroom}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 text-xs font-bold shadow flex items-center gap-1.5 transition-all"
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Code Workspace →</span>
          </button>

          <button
            onClick={onSignOut}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Global Chatroom Window */}
      <div className="max-w-6xl w-full mx-auto flex-1 glass-panel rounded-3xl border border-slate-800 p-6 flex flex-col shadow-2xl backdrop-blur-2xl">
        {/* Chat Header Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 text-xs text-indigo-200 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Global Room Stream ({roomId}):</strong> Transmitted files automatically render Gemma 4 AI summaries here. Ask questions directly to Gemma 4 below!
            </span>
          </div>
          <span className="text-[10px] font-mono bg-indigo-900/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold shrink-0">
            WebSocket Sub-5ms
          </span>
        </div>

        {/* Embedded Gemma 4 Chatbot Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-mono">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Gemma 4 AI Assistant Chatbot ({userRole.toUpperCase()} MODE)</span>
            </div>
            <button
              onClick={onToggleGemmaSidebar}
              className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Sidebar Suggestions →</span>
            </button>
          </div>

          <form onSubmit={handleAskGemmaDirectly} className="flex gap-2">
            <input
              type="text"
              placeholder={userRole === 'teacher' ? 'Ask Gemma 4 AI for pedagogical insights, student common errors...' : 'Ask Gemma 4 AI for step-by-step logic hints & debugging checkpoints...'}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isAskingAi}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAskingAi ? 'animate-spin' : ''}`} />
              <span>{isAskingAi ? 'Asking AI...' : 'Ask Gemma'}</span>
            </button>
          </form>

          {/* AI Chatbot Answers Feed */}
          {aiChatResponses.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              {aiChatResponses.map((res, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px] text-cyan-300 font-bold">
                    <span>🤖 Gemma 4 ({res.role.toUpperCase()})</span>
                    <span className="text-slate-400">{res.time}</span>
                  </div>
                  <div className="text-white font-semibold">Q: "{res.question}"</div>
                  <p className="text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">{res.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Chat Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4">
          {chatMessages.map((msg) => (
            <div key={msg.id}>
              {msg.isGemmaSummary ? (
                <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-indigo-900/80 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-indigo-600/30 text-cyan-300">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">Gemma 4 AI Summary Card</span>
                      <span className="text-[10px] font-mono bg-indigo-900 text-indigo-300 border border-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        {msg.fileName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{msg.time}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="text-cyan-300 font-bold">Concept: {msg.summary.keyConcept}</div>
                    <div className="text-slate-400 font-mono text-[11px] bg-slate-950/60 px-2.5 py-0.5 rounded border border-slate-800 inline-block">
                      {msg.summary.complexity}
                    </div>
                    <p className="text-slate-200 pt-1 leading-relaxed">{msg.summary.explanation}</p>
                  </div>
                </div>
              ) : (
                <div className={`p-3.5 rounded-2xl border space-y-1 ${
                  msg.role === 'teacher'
                    ? 'bg-slate-900/90 border-indigo-500/30'
                    : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold flex items-center gap-1.5 ${
                      msg.role === 'teacher' ? 'text-indigo-400' : 'text-cyan-400'
                    }`}>
                      {msg.sender}
                      <span className="text-[9px] font-mono uppercase bg-slate-950 border border-slate-800 px-1.5 py-0.2 rounded">
                        {msg.role}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Global Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            placeholder={`Type message to global class room ${roomId} as ${username}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-2 transition-all"
          >
            <SendHorizontal className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
