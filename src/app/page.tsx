import React from "react";
import Link from "next/link";
import { Code, Layout, Shield, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  const categories = [
    {
      title: "Core Developer Utilities",
      description: "Essential tools for daily coding tasks, formatting, and conversion.",
      icon: <Code size={32} className="text-primary mb-4" />,
      path: "/category/core",
      toolsCount: 15,
      gradient: "from-primary/20 to-primary/5",
    },
    {
      title: "UI, UX & Design Tools",
      description: "Generators, converters, and checkers for frontend developers and designers.",
      icon: <Layout size={32} className="text-accent mb-4" />,
      path: "/category/design",
      toolsCount: 10,
      gradient: "from-accent/20 to-accent/5",
    },
    {
      title: "Data, Security & Network",
      description: "Cryptography, network lookup, and secure payload parsers.",
      icon: <Shield size={32} className="text-premium mb-4" />,
      path: "/category/security",
      toolsCount: 5,
      gradient: "from-premium/20 to-premium/5",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-2xl glass-panel p-8 sm:p-12 mb-10 border border-slate-700/50">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
            <Zap size={14} /> DevSign Hub is Live
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-space-grotesk text-white mb-6 tracking-tight">
            The Ultimate Toolkit for <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-premium">
              Developers & Designers
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            Access 30+ highly-optimized web utilities to streamline your workflow. From code conversion to advanced CSS generation and secure hashing—all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/category/core" className="px-6 py-3 rounded-lg bg-primary text-slate-900 font-semibold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              Explore Tools
            </Link>
            <button className="px-6 py-3 rounded-lg glass-panel hover:bg-slate-700/50 text-white font-medium transition-all">
              View Premium Features
            </button>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-40 w-80 h-80 bg-premium/20 rounded-full blur-[100px] pointer-events-none" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <Link href={cat.path} key={i} className="group relative rounded-xl glass-panel p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none`} />
            <div className="relative z-10">
              {cat.icon}
              <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk">{cat.title}</h3>
              <p className="text-sm text-slate-400 mb-6">{cat.description}</p>
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-slate-500 group-hover:text-slate-300 transition-colors">{cat.toolsCount} Tools</span>
                <span className="flex items-center text-primary gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  Browse <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
