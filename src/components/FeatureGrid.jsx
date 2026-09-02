import React from 'react';
import { Search, Code2, Copy, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export function FeatureGrid() {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-sky-600" />,
      title: "Lightning Fast Search",
      badge: "Real-time",
      description: "Instantly filter across titles, category tags, and problem statements with zero input lag.",
      iconBg: "bg-sky-50 border-sky-200",
      badgeClass: "bg-sky-100 text-sky-800 border-sky-300",
      borderColor: "hover:border-sky-400"
    },
    {
      icon: <Code2 className="w-6 h-6 text-purple-600" />,
      title: "Multi-Language Snippets",
      badge: "Polyglot",
      description: "Clean, production-grade solutions formatted with syntax highlighting for Python, JS, C++, SQL, Docker & more.",
      iconBg: "bg-purple-50 border-purple-200",
      badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
      borderColor: "hover:border-purple-400"
    },
    {
      icon: <Copy className="w-6 h-6 text-emerald-600" />,
      title: "One-Click Copy & Toast",
      badge: "Instant",
      description: "Copy any code snippet directly to clipboard with instant checkmark state and feedback notifications.",
      iconBg: "bg-emerald-50 border-emerald-200",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      borderColor: "hover:border-emerald-400"
    }
  ];

  return (
    <section className="py-16 bg-slate-100/70 border-y border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Engineered for <span className="gradient-text-cyan">Developer Velocity</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Spend less time searching broken forums and more time shipping code with Hoot Miner's structured repository workflow.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={`glass-card p-6 sm:p-8 rounded-3xl relative group overflow-hidden ${item.borderColor}`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${item.iconBg} border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border tracking-wider uppercase ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
