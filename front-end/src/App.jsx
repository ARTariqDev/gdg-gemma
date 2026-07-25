import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import RoomEntryScreen from './components/RoomEntryScreen';
import CentralChatroom from './components/CentralChatroom';
import ClassroomSimulator from './components/ClassroomSimulator';
import GemmaAiSidebar from './components/GemmaAiSidebar';
import GuidedTourDriver from './components/GuidedTourDriver';

export default function App() {
  // Navigation Flow States: 'auth' -> 'room-entry' -> 'chatroom' (default global chat) | 'classroom'
  const [currentStep, setCurrentStep] = useState('auth');
  const [userRole, setUserRole] = useState('teacher'); // 'teacher' | 'student'
  const [activeRoomId, setActiveRoomId] = useState('CS-204');
  const [username, setUsername] = useState('Dr. Vance');

  const [isGemmaSidebarOpen, setIsGemmaSidebarOpen] = useState(false);
  const [sidebarRole, setSidebarRole] = useState('teacher');

  // Active GUI Guided Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourRole, setTourRole] = useState('teacher');
  const [currentTourAction, setCurrentTourAction] = useState('');

  const handleSelectRole = (role) => {
    setUserRole(role);
    setSidebarRole(role);
    setUsername(role === 'teacher' ? 'Dr. Vance (Teacher)' : 'Alex Rivers (Student)');
    setCurrentStep('room-entry');
  };

  const handleEnterRoom = ({ roomId, username, role }) => {
    setActiveRoomId(roomId);
    setUsername(username);
    setUserRole(role);
    setSidebarRole(role);
    // User lands directly in the Global Chatroom!
    setCurrentStep('chatroom');
  };

  const handleStartActiveTour = (role) => {
    setTourRole(role);
    setIsTourActive(true);
    setCurrentTourAction('');
    if (currentStep === 'auth' || currentStep === 'room-entry') {
      setCurrentStep('chatroom');
    }
  };

  const handleExecuteTourStep = (action, role) => {
    setCurrentTourAction(action);
  };

  const handleOpenSidebarWithRole = (role) => {
    setSidebarRole(role);
    setIsGemmaSidebarOpen(true);
  };

  // Step 1: Sign in Screen (Sign in as Student / Sign in as Teacher)
  if (currentStep === 'auth') {
    return <AuthScreen onSelectRole={handleSelectRole} />;
  }

  // Step 2: Room Entry Screen (Enter Room Key)
  if (currentStep === 'room-entry') {
    return (
      <RoomEntryScreen
        role={userRole}
        onEnterRoom={handleEnterRoom}
        onBackToAuth={() => setCurrentStep('auth')}
      />
    );
  }

  // Step 3 (Default after room entry): Global Chatroom View
  if (currentStep === 'chatroom') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
        <CentralChatroom
          roomId={activeRoomId}
          userRole={userRole}
          username={username}
          onOpenClassroom={() => setCurrentStep('classroom')}
          onSignOut={() => setCurrentStep('auth')}
          onToggleGemmaSidebar={() => {
            setSidebarRole(userRole);
            setIsGemmaSidebarOpen(!isGemmaSidebarOpen);
          }}
        />

        <GemmaAiSidebar
          isOpen={isGemmaSidebarOpen}
          onClose={() => setIsGemmaSidebarOpen(false)}
          initialRole={sidebarRole}
        />
      </div>
    );
  }

  // Step 4: Code Workspace View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Workspace Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 sticky top-0 z-40 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentStep('chatroom')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow hover:scale-[1.02] transition-all flex items-center gap-1.5"
          >
            ← Back to Global Chatroom
          </button>
          <span className="text-xs font-mono text-slate-400">
            Room: <strong className="text-white">{activeRoomId}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 font-medium">
            {username} ({userRole})
          </span>
          <button
            onClick={() => {
              setSidebarRole(userRole);
              setIsGemmaSidebarOpen(!isGemmaSidebarOpen);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-bold shadow hover:scale-[1.02] transition-all"
          >
            Gemma AI Assistant
          </button>
        </div>
      </header>

      <main className="flex-1">
        <ClassroomSimulator
          userRole={userRole}
          activeRoomId={activeRoomId}
          username={username}
          onOpenCentralChatroom={() => setCurrentStep('chatroom')}
          onToggleGemmaSidebar={() => {
            setSidebarRole(userRole);
            setIsGemmaSidebarOpen(true);
          }}
          guidedRole={tourRole}
          tourAction={currentTourAction}
          onOpenSidebarWithRole={handleOpenSidebarWithRole}
        />
      </main>

      <GemmaAiSidebar
        isOpen={isGemmaSidebarOpen}
        onClose={() => setIsGemmaSidebarOpen(false)}
        initialRole={sidebarRole}
      />

      <GuidedTourDriver
        isActive={isTourActive}
        role={tourRole}
        onClose={() => {
          setIsTourActive(false);
          setCurrentTourAction('');
        }}
        onExecuteTourStep={handleExecuteTourStep}
      />
    </div>
  );
}
