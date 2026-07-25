import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClassroomSimulator from './components/ClassroomSimulator';
import Workflow from './components/Workflow';
import Features from './components/Features';
import TechStack from './components/TechStack';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  const scrollToDemo = () => {
    const demoEl = document.getElementById('demo');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar onOpenDemo={scrollToDemo} />

      {/* Hero Section with GSAP Animations */}
      <Hero onOpenDemo={scrollToDemo} />

      {/* Interactive WebSocket Live Classroom Simulator */}
      <ClassroomSimulator />

      {/* How it Works / Workflow Pipeline */}
      <Workflow />

      {/* Bento Capabilities Grid */}
      <Features />

      {/* Technical Architecture & Latency Metrics */}
      <TechStack />

      {/* Pricing Plans */}
      <Pricing onOpenDemo={scrollToDemo} />

      {/* FAQ Accordion */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
}
