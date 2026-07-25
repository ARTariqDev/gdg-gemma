import React, { useState, useEffect } from 'react';
import { Radio, Users, Send, Monitor, Sparkles, Code2, Zap, Play, CheckCircle2, UserCheck, MessageSquare, Terminal, Eye, MousePointer2, RefreshCw } from 'lucide-react';

const FILE_TEMPLATES = [
  {
    id: 'py-tree',
    name: 'binary_tree_lab.py',
    language: 'Python',
    content: `def insert_node(root, key):\n    if root is None:\n        return Node(key)\n    if key < root.val:\n        root.left = insert_node(root.left, key)\n    else:\n        root.right = insert_node(root.right, key)\n    return root`
  },
  {
    id: 'js-react',
    name: 'RealtimeCollab.jsx',
    language: 'React / JS',
    content: `export function CollabEditor({ fileId, wsUrl }) {\n  const [content, setContent] = useState('');\n  useEffect(() => {\n    const ws = new WebSocket(wsUrl);\n    ws.onmessage = (msg) => setContent(msg.data);\n    return () => ws.close();\n  }, [wsUrl]);\n}`
  },
  {
    id: 'cpp-graph',
    name: 'dijkstra_shortest_path.cpp',
    language: 'C++',
    content: `void dijkstra(int src, vector<pair<int,int>> adj[], int V) {\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\n    vector<int> dist(V, INF);\n    pq.push({0, src});\n    dist[src] = 0;\n}`
  }
];

const INITIAL_STUDENTS = [
  { id: 'st-1', name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', status: 'Editing Line 4', copyStatus: 'synced', linesEdited: 12, helpRequested: false },
  { id: 'st-2', name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces', status: 'Syntax Exception', copyStatus: 'synced', linesEdited: 18, helpRequested: true },
  { id: 'st-3', name: 'Jordan Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', status: 'Running Unit Tests', copyStatus: 'synced', linesEdited: 9, helpRequested: false },
  { id: 'st-4', name: 'Chen Wei', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', status: 'Idle', copyStatus: 'synced', linesEdited: 4, helpRequested: false }
];

export default function ClassroomSimulator() {
  const [selectedFile, setSelectedFile] = useState(FILE_TEMPLATES[0]);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastCount, setBroadcastCount] = useState(1);
  const [activeCoEditStudent, setActiveCoEditStudent] = useState(null);
  const [instructorNote, setInstructorNote] = useState('');
  const [simulatedTypingText, setSimulatedTypingText] = useState('# Student working copy initialized');
  const [wsLogs, setWsLogs] = useState([
    { id: 1, time: '13:24:01', msg: 'WebSocket Room CS-204 initialized by Instructor Dr. Vance' },
    { id: 2, time: '13:24:02', msg: '4 Student nodes connected to ws://edusync.internal/room-204' }
  ]);

  // Simulate WebSocket periodic updates from students
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents(prev =>
        prev.map(st => {
          if (Math.random() > 0.6) {
            return {
              ...st,
              linesEdited: st.linesEdited + Math.floor(Math.random() * 2),
              status: st.helpRequested ? 'Waiting for Instructor' : `Edited L${Math.floor(Math.random() * 8) + 1}`
            };
          }
          return st;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBroadcast = () => {
    setIsBroadcasting(true);
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour12: false }),
      msg: `[WS BROADCAST] Master file "${selectedFile.name}" copied and transmitted to ${students.length} student sandboxes`
    };
    setWsLogs(prev => [newLog, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastCount(c => c + 1);
    }, 1200);
  };

  const handleCoEditJoin = (student) => {
    setActiveCoEditStudent(student);
    const joinLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour12: false }),
      msg: `[HOST JOIN] Host Dr. Vance initiated dual-cursor co-editing session with ${student.name}`
    };
    setWsLogs(prev => [joinLog, ...prev.slice(0, 4)]);
  };

  return (
    <section id="demo" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Live Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Experience the <span className="gradient-text">WebSocket Workflow</span> Live
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Test how an instructor selects a file, broadcasts isolated copies to every student in milliseconds, and joins any student's workspace with dual cursors.
          </p>
        </div>

        {/* Simulator Workbench */}
        <div className="glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* Top Control Bar */}
          <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Host Console: CS-204 Collaboration Room
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    WebSocket Active
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Connected Students: {students.length} | Latency: 3.2ms</p>
              </div>
            </div>

            {/* Broadcast Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBroadcast}
                disabled={isBroadcasting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isBroadcasting ? 'animate-bounce' : ''}`} />
                <span>{isBroadcasting ? 'Generating & Broadcasting Copies...' : 'Broadcast File to Students'}</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Split: Instructor Panel (Left) & Student Grid (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* Instructor Master File Selector & Live Code (4 Cols) */}
            <div className="lg:col-span-4 p-6 bg-slate-900/40 space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2 font-bold flex items-center justify-between">
                  <span>1. Instructor Selects Master File</span>
                  <span className="text-indigo-400 text-[10px]">Source Template</span>
                </label>

                <div className="space-y-2">
                  {FILE_TEMPLATES.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedFile.id === file.id
                          ? 'bg-indigo-950/60 border-indigo-500/60 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Code2 className={`w-4 h-4 ${selectedFile.id === file.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <div>
                          <div className="text-xs font-mono font-semibold">{file.name}</div>
                          <div className="text-[10px] text-slate-500">{file.language}</div>
                        </div>
                      </div>
                      {selectedFile.id === file.id && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Master File Code Preview */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Template Code ({selectedFile.language})</span>
                  <span className="text-slate-500">Read-only Host Master</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed h-44">
                  <pre>{selectedFile.content}</pre>
                </div>
              </div>

              {/* Real-time WS Dispatch Log Panel */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    WebSocket Event Log
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">LIVE STREAM</span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono text-slate-400 h-28 overflow-y-auto">
                  {wsLogs.map((log) => (
                    <div key={log.id} className="leading-tight">
                      <span className="text-slate-600">[{log.time}]</span> {log.msg}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Copies Matrix & Host Monitoring (8 Cols) */}
            <div className="lg:col-span-8 p-6 space-y-6 bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Student Copies & Live Workspace Monitor
                  </h4>
                  <p className="text-xs text-slate-400">
                    Each student receives an isolated copy of <span className="font-mono text-indigo-300">{selectedFile.name}</span>. Click "Collaborate" to co-edit.
                  </p>
                </div>
                <div className="text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Broadcast Count: #{broadcastCount}</span>
                </div>
              </div>

              {/* 4 Student Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      student.helpRequested
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40'
                    }`}
                  >
                    {/* Student Card Top */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                            {student.name}
                            {student.helpRequested && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Requested Help
                              </span>
                            )}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Copy ID: #{student.id.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                        WS Synced
                      </span>
                    </div>

                    {/* Code Snippet Box for Student */}
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 mb-3 h-20 overflow-hidden relative">
                      <div className="text-slate-500 text-[10px] mb-1 flex items-center justify-between">
                        <span>{selectedFile.name} (Student Copy)</span>
                        <span className="text-emerald-400">{student.status}</span>
                      </div>
                      <div className="text-slate-300">
                        {selectedFile.content.slice(0, 110)}...
                      </div>

                      {/* Animated Typing Indicator overlay */}
                      <div className="absolute bottom-1 right-2 flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-[9px] text-indigo-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        Typing L{student.linesEdited}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {student.linesEdited} modifications
                      </span>

                      <button
                        onClick={() => handleCoEditJoin(student)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
                      >
                        <MousePointer2 className="w-3.5 h-3.5" />
                        <span>Collaborate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Overlay: Instructor Dual-Cursor Co-Editing View */}
        {activeCoEditStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
            <div className="glass-panel w-full max-w-4xl rounded-3xl border border-indigo-500/40 p-6 shadow-2xl relative">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Co-Editing Workspace with {activeCoEditStudent.name}
                      <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        Dual Cursors Active
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      WebSocket Channel: <span className="font-mono text-cyan-300">ws://edusync.internal/room-204/pair-{activeCoEditStudent.id}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCoEditStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                >
                  Close Session
                </button>
              </div>

              {/* Co-Edit Split Code Canvas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Host Control Panel */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-indigo-300 font-bold">Host Pointer (Dr. Vance)</span>
                    <span className="text-emerald-400">Editing Permission: FULL</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-3">
                    <div className="text-xs text-slate-300 font-mono leading-relaxed">
                      <p className="text-indigo-400 font-bold"># Live Co-Editing Buffer</p>
                      <p className="text-slate-400"># Changes sync bi-directionally in &lt;4ms</p>
                      <p><span className="text-purple-400">def</span> <span className="text-blue-400">solution</span>(nums):</p>
                      <p className="pl-4 text-emerald-400"># Dr. Vance added optimization note here</p>
                      <p className="pl-4">seen = set()</p>
                      <div className="py-1 px-2 my-1 bg-indigo-500/20 border-l-2 border-indigo-400 rounded text-white flex items-center justify-between">
                        <span><span className="text-purple-400">for</span> n <span className="text-purple-400">in</span> nums:</span>
                        <span className="text-[9px] bg-indigo-600 px-1.5 py-0.5 rounded font-bold">Host Cursor</span>
                      </div>
                      <p className="pl-8"><span className="text-purple-400">if</span> n <span className="text-purple-400">in</span> seen: <span className="text-purple-400">return</span> <span className="text-amber-400">True</span></p>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <label className="block text-[11px] text-slate-400 mb-1">Send Guidance Note to Student</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Remember to check edge cases for empty list..."
                          value={instructorNote}
                          onChange={(e) => setInstructorNote(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={() => {
                            if (instructorNote) {
                              alert(`Sent live prompt to ${activeCoEditStudent.name}: "${instructorNote}"`);
                              setInstructorNote('');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Active Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-300 font-bold">{activeCoEditStudent.name}'s Screen View</span>
                    <span className="text-slate-400">Copy #02</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 h-full">
                    <div className="flex items-center gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                      <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Host is currently attached and assisting in real-time.</span>
                    </div>

                    <div className="text-xs font-mono text-slate-300 space-y-1">
                      <p><span className="text-purple-400">def</span> <span className="text-blue-400">solution</span>(nums):</p>
                      <p className="pl-4">seen = set()</p>
                      <p className="pl-4"><span className="text-purple-400">for</span> n <span className="text-purple-400">in</span> nums:</p>
                      <div className="py-1 px-2 bg-cyan-500/20 border-l-2 border-cyan-400 rounded text-white flex items-center justify-between">
                        <span>seen.add(n)</span>
                        <span className="text-[9px] bg-cyan-600 px-1.5 py-0.5 rounded font-bold">{activeCoEditStudent.name}</span>
                      </div>
                      <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-amber-400">False</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  State sync engine: CRDT Operational Transformation
                </span>
                <button
                  onClick={() => setActiveCoEditStudent(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                >
                  Return to Master Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
