import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Educator Free',
    badge: 'Individual Teachers',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Perfect for individual instructors running small labs and interactive coding sessions.',
    features: [
      'Up to 30 active student copies per session',
      'WebSocket sub-10ms real-time sync',
      'Host monitoring & 1-click takeover',
      'Python, JavaScript, and C++ compilers',
      '1 Hour maximum session duration',
      'Community Discord Support'
    ],
    cta: 'Start Free Session',
    popular: false,
    highlight: 'border-slate-800'
  },
  {
    name: 'Department Pro',
    badge: 'Most Popular',
    priceMonthly: 49,
    priceAnnual: 39,
    description: 'Designed for university courses, bootcamps, and STEM department labs with high concurrency.',
    features: [
      'Up to 250 active student copies per room',
      'Unlimited session length & background rooms',
      'Host dual-cursor pair editing & audio chat',
      'All 50+ programming languages & Jupyter',
      'LMS integration (Canvas, Blackboard, Moodle)',
      'Automated grading & timeline snapshot export',
      'Priority 24/7 Dedicated Support'
    ],
    cta: 'Start 14-Day Free Trial',
    popular: true,
    highlight: 'border-indigo-500 shadow-2xl shadow-indigo-500/20'
  },
  {
    name: 'Campus Enterprise',
    badge: 'Custom Deployment',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    description: 'Self-hosted or dedicated cloud cluster for entire university campuses & school districts.',
    features: [
      'Unlimited student nodes & concurrent rooms',
      'Dedicated private WebSocket relay servers',
      'SSO (SAML, Okta, Google Workspace)',
      'Custom FERPA / GDPR compliance policy',
      'On-premise Docker & Kubernetes deployment',
      'Dedicated Solutions Engineer & SLA'
    ],
    cta: 'Contact Campus Team',
    popular: false,
    highlight: 'border-cyan-500/50'
  }
];

export default function Pricing({ onOpenDemo }) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Flexible Plans for Education</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Transparent Pricing for <span className="gradient-text">Every Classroom</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Start for free as an instructor or deploy across your entire academic department.
          </p>

          {/* Billing Switch */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 relative border border-slate-700 transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full bg-indigo-500 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
              Annual Billing
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={`glass-card rounded-3xl p-8 border flex flex-col justify-between relative transition-all duration-300 ${plan.highlight}`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg">
                  Most Popular for Universities
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-indigo-300 px-2.5 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {typeof plan.priceMonthly === 'number' ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                        ${isAnnual ? plan.priceAnnual : plan.priceMonthly}
                      </span>
                      <span className="text-sm text-slate-400 font-sans">/ instructor / mo</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-extrabold text-white">{plan.priceMonthly}</div>
                  )}
                  <p className="text-xs text-slate-400 mt-2">{plan.description}</p>
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-6 border-t border-slate-800 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenDemo}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
