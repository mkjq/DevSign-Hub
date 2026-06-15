"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Crown, Lock } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  isPremiumOnly?: boolean;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, isPremiumOnly = false, children }: ToolLayoutProps) {
  const { isPremium, toggleMockPremium } = useAuth();

  const isLocked = isPremiumOnly && !isPremium;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold font-space-grotesk text-white tracking-tight">{title}</h1>
          {isPremiumOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-premium/10 text-premium text-xs font-semibold border border-premium/20">
              <Crown size={12} /> PRO
            </span>
          )}
        </div>
        <p className="text-slate-400">{description}</p>
      </div>

      <div className="relative">
        {isLocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700">
            <div className="bg-premium/10 p-4 rounded-full mb-4">
              <Lock size={32} className="text-premium" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Feature Locked</h3>
            <p className="text-slate-400 text-center max-w-md mb-6">
              Upgrade to PRO to unlock {title} and get access to bulk processing, cloud sync, and API access.
            </p>
            <button 
              onClick={toggleMockPremium}
              className="px-6 py-2.5 bg-premium hover:bg-premium/90 text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(157,78,221,0.4)] transition-all"
            >
              Upgrade to PRO (Mock)
            </button>
          </div>
        )}
        
        <div className={`glass-panel p-6 border-slate-700/50 ${isLocked ? 'opacity-30 pointer-events-none select-none blur-sm' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
