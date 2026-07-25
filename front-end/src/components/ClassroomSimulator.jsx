import React, { useState, useEffect } from 'react';
import { Radio, Users, Send, Monitor, Sparkles, Code2, Zap, Play, CheckCircle2, UserCheck, MessageSquare, Terminal, Eye, MousePointer2, Lock, Unlock, Bot, SendHorizontal, Upload, FileCode, Clock, FileCheck, ShieldAlert } from 'lucide-react';
import { socket } from '../socket';

const INITIAL_FILE_TEMPLATES = [
  {
    id: 'py-tree',
    name: 'binary_tree_lab.py',
    language: 'Python',
    deadline: 'Today at 11:59 PM',
    status: 'In Progress',
    content: `def insert_node(root, key):\n    if root is None:\n        return Node(key)\n    if key < root.val:\n        root.left = insert_node(root.left, key)\n    else:\n        root.right = insert_node(root.right, key)\n    return root`,
    gemmaSummary: {
      keyConcept: 'Binary Search Tree Insertion',
      complexity: 'Time: O(log N) average, Space: O(H) call stack',
      explanation: 'Gemma 4 Summary: Demonstrates recursive node traversal. Base case creates a new Node when root is null. Left subtree handles smaller keys; right subtree handles larger keys.'
    }
  },
  {
    id: 'js-react',
    name: 'RealtimeCollab.jsx',
    language: 'React / JS',
    deadline: 'Tomorrow at 5:00 PM',
    status: 'Assigned',
    content: `export function CollabEditor({ fileId, wsUrl }) {\n  const [content, setContent] = useState('');\n  useEffect(() => {\n    const ws = new WebSocket(wsUrl);\n    ws.onmessage = (msg) => setContent(msg.data);\n    return () => ws.close();\n  }, [wsUrl]);\n}`,
    gemmaSummary: {
      keyConcept: 'React WebSocket Lifecycle',
      complexity: 'Time: O(1) event dispatch, Space: O(1) state buffer',
      explanation: 'Gemma 4 Summary: Initializes persistent WebSocket connection inside useEffect. Listens for incoming message deltas and cleans up socket connection on unmount.'
    }
  },
  {
    id: 'cpp-graph',
    name: 'dijkstra_shortest_path.cpp',
    language: 'C++',
    deadline: 'Oct 28 at 11:59 PM',
    status: 'Assigned',
    content: `void dijkstra(int src, vector<pair<int,int>> adj[], int V) {\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\n    vector<int> dist(V, INF);\n    pq.push({0, src});\n    dist[src] = 0;\n}`,
    gemmaSummary: {
      keyConcept: 'Priority-Queue Dijkstra Algorithm',
      complexity: 'Time: O((V + E) log V), Space: O(V)',
      explanation: 'Gemma 4 Summary: Computes shortest paths from source vertex using a min-priority queue. Initializes distances to infinity and greedily relaxes adjacent edges.'
    }
  }
];

const INITIAL_STUDENTS = [
  { id: 'st-1', name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', status: 'Editing Line 4', linesEdited: 12, isLocked: false, code: `def insert_node(root, key):\n    # Alex's solution draft\n    if root is None:\n        return Node(key)` },
  { id: 'st-2', name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces', status: 'Syntax Exception', linesEdited: 18, isLocked: false, code: `def insert_node(root, key):\n    # Maya's draft - missing base case check\n    if key < root.val:\n        root.left = insert_node(root.left, key)` },
  { id: 'st-3', name: 'Jordan Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', status: 'Running Unit Tests', linesEdited: 9, isLocked: false, code: `def insert_node(root, key):\n    if root is None: return Node(key)\n    # Jordan's draft` },
  { id: 'st-4', name: 'Chen Wei', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', status: 'Idle', linesEdited: 4, isLocked: false, code: `def insert_node(root, key):\n    pass` }
];

export default function ClassroomSimulator({
  userRole = 'teacher',
  activeRoomId = 'CS-204',
  username = 'Dr. Vance',
  onOpenCentralChatroom,
  onToggleGemmaSidebar,
  guidedRole,
  tourAction,
  onOpenSidebarWithRole
}) {
  const [fileList, setFileList] = useState(INITIAL_FILE_TEMPLATES);
  const [selectedFile, setSelectedFile] = useState(INITIAL_FILE_TEMPLATES[0]);
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  // Active Tab state based on user role:
  // Teacher: 'inspect-student' | 'grid' | 'live-teacher'
  // Student: 'assignments' | 'student-copy' | 'live-teacher'
  const [activeTab, setActiveTab] = useState(userRole === 'student' ? 'assignments' : 'inspect-student');

  const [selectedStudentForTeacher, setSelectedStudentForTeacher] = useState(INITIAL_STUDENTS[0]);
  const [teacherEditingCode, setTeacherEditingCode] = useState(INITIAL_STUDENTS[0].code);

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isTeacherLocked, setIsTeacherLocked] = useState(false);
  const [studentCode, setStudentCode] = useState(INITIAL_FILE_TEMPLATES[0].content);
  const [submissionSubmitted, setSubmissionSubmitted] = useState(false);

  useEffect(() => {
    if (userRole === 'student') {
      setActiveTab('assignments');
    } else {
      setActiveTab('inspect-student');
    }
  }, [userRole]);

  // Handle local file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const newFileObj = {
        id: 'custom-' + Date.now(),
        name: uploadedFile.name,
        language: uploadedFile.name.endsWith('.py') ? 'Python' : uploadedFile.name.endsWith('.js') || uploadedFile.name.endsWith('.jsx') ? 'JavaScript' : 'Text/Code',
        deadline: 'Today at 11:59 PM',
        status: 'Assigned',
        content: content,
        gemmaSummary: {
          keyConcept: `Uploaded File: ${uploadedFile.name}`,
          complexity: 'Time: O(N) | Space: O(1)',
          explanation: `Instructor transmitted assignment (${uploadedFile.name}). Gemma 4 generates automated summaries.`
        }
      };

      setFileList(prev => [newFileObj, ...prev]);
      setSelectedFile(newFileObj);
    };

    reader.readAsText(uploadedFile);
  };

  // Socket listeners
  useEffect(() => {
    socket.emit('join-room', {
      roomId: activeRoomId,
      username: username || (userRole === 'student' ? 'Student Alex' : 'Dr. Vance (Teacher)'),
      role: userRole
    });

    const handleFileBroadcasted = (data) => {
      setIsBroadcasting(false);
      if (data.document) {
        setStudentCode(data.document);
      }
    };

    const handleLockStatusChanged = ({ studentId, isLocked }) => {
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, isLocked } : s));
      if (selectedStudentForTeacher && selectedStudentForTeacher.id === studentId) {
        setIsTeacherLocked(isLocked);
      }
    };

    const handleCodeUpdated = ({ document: updatedDoc, studentId }) => {
      if (selectedStudentForTeacher && selectedStudentForTeacher.id === studentId) {
        setTeacherEditingCode(updatedDoc);
      }
    };

    socket.on('file-broadcasted', handleFileBroadcasted);
    socket.on('lock-status-changed', handleLockStatusChanged);
    socket.on('code-updated', handleCodeUpdated);

    return () => {
      socket.off('file-broadcasted', handleFileBroadcasted);
      socket.off('lock-status-changed', handleLockStatusChanged);
      socket.off('code-updated', handleCodeUpdated);
    };
  }, [activeRoomId, userRole, username, selectedStudentForTeacher]);

  const handleBroadcast = () => {
    setIsBroadcasting(true);

    socket.emit('broadcast-file', {
      roomId: activeRoomId,
      fileName: selectedFile.name,
      document: selectedFile.content
    });

    setTimeout(() => {
      setIsBroadcasting(false);
    }, 1200);
  };

  const toggleTeacherLockOnSelectedStudent = () => {
    const nextState = !isTeacherLocked;
    setIsTeacherLocked(nextState);

    if (selectedStudentForTeacher) {
      socket.emit('force-lock-toggle', {
        roomId: activeRoomId,
        studentId: selectedStudentForTeacher.id,
        isLocked: nextState
      });

      setStudents(prev =>
        prev.map(st => (st.id === selectedStudentForTeacher.id ? { ...st, isLocked: nextState } : st))
      );
    }
  };

  const handleTeacherCodeChange = (newCode) => {
    setTeacherEditingCode(newCode);
    if (selectedStudentForTeacher) {
      socket.emit('code-change', {
        roomId: activeRoomId,
        document: newCode,
        studentId: selectedStudentForTeacher.id
      });
      setStudents(prev =>
        prev.map(st => st.id === selectedStudentForTeacher.id ? { ...st, code: newCode } : st)
      );
    }
  };

  const handleSelectStudentForTeacher = (student) => {
    setSelectedStudentForTeacher(student);
    setTeacherEditingCode(student.code);
    setIsTeacherLocked(student.isLocked);
  };

  return (
    <section id="demo" className="py-6 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Main Workbench Shell */}
        <div className="glass-panel rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* Workspace Tab Bar */}
          <div className="bg-slate-900/90 px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  Session Room: {activeRoomId}
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    WS Sub-5ms
                  </span>
                </h3>
              </div>
            </div>

            {/* Navigation Tabs tailored by Role */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              {userRole === 'teacher' ? (
                <>
                  <button
                    onClick={() => setActiveTab('inspect-student')}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'inspect-student'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Select & Edit Student File</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('grid')}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'grid'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Student Sandboxes Matrix</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('live-teacher')}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'live-teacher'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Master Stream</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'assignments'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Assignments & Deadlines</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('student-copy')}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'student-copy'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>My Built-in Editor</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('live-teacher')}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      activeTab === 'live-teacher'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Watch Teacher Stream</span>
                  </button>
                </>
              )}

              <button
                onClick={onOpenCentralChatroom}
                className="px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 text-emerald-400 hover:bg-emerald-500/10 transition-all border border-emerald-500/20"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Central Chatroom →</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-6">
            {/* STUDENT VIEW 1: Assignments Tab (Files sent by instructor + Built-in Editor + Deadline) */}
            {activeTab === 'assignments' && userRole === 'student' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Transmitted Assignment List & Deadlines */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        Instructor Sent Assignments
                      </h4>
                      <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded font-bold">
                        {fileList.length} Files
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {fileList.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => {
                            setSelectedFile(file);
                            setStudentCode(file.content);
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 ${
                            selectedFile.id === file.id
                              ? 'bg-indigo-950/80 border-indigo-500/60 text-white shadow-lg ring-1 ring-indigo-500/40'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                              {file.name}
                            </span>
                            <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-indigo-300">
                              {file.language}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1 text-amber-300 font-mono font-semibold">
                              <Clock className="w-3 h-3 text-amber-400" />
                              {file.deadline}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              {file.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Student Built-in Editor & Submission Panel */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                        Built-in Assignment Editor: {selectedFile.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Deadline: <span className="text-amber-300 font-mono font-bold">{selectedFile.deadline}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSubmissionSubmitted(true);
                        setTimeout(() => setSubmissionSubmitted(false), 3000);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>{submissionSubmitted ? '✓ Assignment Submitted!' : 'Submit Solution'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 font-mono">
                      <span>Interactive Student Workspace</span>
                      <span className="text-cyan-400">Auto-saved to session room</span>
                    </div>

                    <textarea
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      rows={12}
                      className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TEACHER VIEW 1: Select Student & Edit File in Real Time */}
            {activeTab === 'inspect-student' && userRole === 'teacher' && (
              <div className="space-y-4">
                {/* Header Bar: Student Selector & Force Lock Button */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">
                        Select Student to Inspect & Edit Live:
                      </label>
                      <select
                        value={selectedStudentForTeacher.id}
                        onChange={(e) => {
                          const st = students.find(s => s.id === e.target.value);
                          if (st) handleSelectStudentForTeacher(st);
                        }}
                        className="mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                      >
                        {students.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name} (Copy #{st.id.toUpperCase()}) - {st.status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleTeacherLockOnSelectedStudent}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        isTeacherLocked
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-4 ring-rose-400 animate-pulse'
                          : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      }`}
                    >
                      {isTeacherLocked ? (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>🔓 Release Control to Student</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>🔒 Force Edit Lock (Take Control)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Editor Banner */}
                {isTeacherLocked ? (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2 animate-pulse font-mono">
                    <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      <strong>Host Control Lock Active:</strong> {selectedStudentForTeacher.name}'s editor input is locked. Only the teacher has write permissions over WebSockets.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 font-mono">
                    <Unlock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Dual-Cursor Co-Editing:</strong> Teacher and {selectedStudentForTeacher.name} have real-time collaborative write access over WebSockets.
                    </span>
                  </div>
                )}

                {/* Teacher Real-Time Editor for Selected Student */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 font-mono">
                    <span className="text-cyan-300 font-bold">
                      Editing File Copy of {selectedStudentForTeacher.name} ({selectedFile.name})
                    </span>
                    <span className="text-slate-400">WebSocket Live Sync</span>
                  </div>

                  <textarea
                    value={teacherEditingCode}
                    onChange={(e) => handleTeacherCodeChange(e.target.value)}
                    rows={12}
                    className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TEACHER VIEW 2: Student Sandboxes Matrix */}
            {activeTab === 'grid' && userRole === 'teacher' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Master File Selection & Upload */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold">
                        1. Select or Upload Master File
                      </label>
                      <label className="cursor-pointer text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom File</span>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".py,.js,.jsx,.ts,.tsx,.cpp,.c,.java,.html,.css,.json,.txt"
                        />
                      </label>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {fileList.map((file) => (
                        <button
                          key={file.id}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                            selectedFile.id === file.id
                              ? 'bg-indigo-950/80 border-indigo-500/60 text-white shadow-md'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCode className={`w-4 h-4 shrink-0 ${selectedFile.id === file.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                            <span className="text-xs font-mono font-semibold truncate">{file.name}</span>
                          </div>
                          {selectedFile.id === file.id && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleBroadcast}
                      disabled={isBroadcasting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className={`w-4 h-4 ${isBroadcasting ? 'animate-bounce' : ''}`} />
                      <span>{isBroadcasting ? 'Broadcasting & Gemma 4 Summarizing...' : 'Transmit File Copy to All Students'}</span>
                    </button>
                  </div>
                </div>

                {/* Student Sandboxes Matrix */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Student Sandboxes Monitor ({students.length} Copies)
                    </h4>
                    <span className="text-[11px] text-slate-400">Host access only</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          student.isLocked
                            ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <img src={student.avatar} alt={student.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                            <div>
                              <h5 className="text-xs font-bold text-white">{student.name}</h5>
                              <span className="text-[10px] font-mono text-slate-400">Copy #{student.id.toUpperCase()}</span>
                            </div>
                          </div>

                          {student.isLocked ? (
                            <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                              <Lock className="w-3 h-3" /> Teacher Edit Lock
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                              Student Control
                            </span>
                          )}
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 mb-3 h-20 overflow-hidden relative">
                          <div className="text-slate-500 text-[10px] mb-1 flex items-center justify-between">
                            <span>{selectedFile.name}</span>
                            <span className="text-cyan-400">{student.status}</span>
                          </div>
                          <div>{selectedFile.content.slice(0, 90)}...</div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-400 font-mono">{student.linesEdited} edits</span>
                          <button
                            onClick={() => {
                              handleSelectStudentForTeacher(student);
                              setActiveTab('inspect-student');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
                          >
                            <MousePointer2 className="w-3.5 h-3.5" />
                            <span>Edit Student File</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WATCH TEACHER LIVE STREAM VIEW */}
            {activeTab === 'live-teacher' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl">
                      <Eye className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Live Instructor Broadcast Stream</h4>
                      <p className="text-xs text-slate-400">Students watch master code updates in real-time over WebSockets</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE WS BROADCAST
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm space-y-2 relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                    <span className="text-indigo-300 font-bold">Master Template: {selectedFile.name}</span>
                    <span className="text-cyan-400 font-mono">Teacher Cursor Active</span>
                  </div>

                  <div className="text-slate-300 space-y-1 pt-2 leading-relaxed">
                    <p><span className="text-purple-400">def</span> <span className="text-blue-400">insert_node</span>(root, key):</p>
                    <p className="pl-4"><span className="text-purple-400">if</span> root <span className="text-purple-400">is</span> <span className="text-amber-400">None</span>:</p>
                    <p className="pl-8"><span className="text-purple-400">return</span> Node(key)</p>
                    <div className="pl-4 py-1 my-1 bg-indigo-500/20 border-l-2 border-indigo-400 rounded flex items-center justify-between text-white">
                      <span><span className="text-purple-400">if</span> key &lt; root.val:</span>
                      <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded font-bold animate-pulse">
                        Dr. Vance (Typing Live)
                      </span>
                    </div>
                    <p className="pl-8">root.left = insert_node(root.left, key)</p>
                    <p className="pl-4"><span className="text-purple-400">return</span> root</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
