"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check, Lock, RefreshCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function UuidGeneratorTool() {
  const { isPremium, toggleMockPremium } = useAuth();
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUuids = () => {
    const amount = isPremium ? count : Math.min(count, 10);
    const newUuids = [];
    for (let i = 0; i < amount; i++) {
      newUuids.push(crypto.randomUUID());
    }
    setUuids(newUuids);
  };

  const copyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="UUID/GUID v4 Bulk Generator" 
      description="Instantly generate secure, random UUIDs in bulk."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6">
        
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-300 whitespace-nowrap">Quantity</label>
            <input 
              type="number" 
              min={1} 
              max={isPremium ? 10000 : 10}
              value={count}
              onChange={(e) => {
                let val = parseInt(e.target.value) || 1;
                if (!isPremium && val > 10) val = 10;
                if (isPremium && val > 10000) val = 10000;
                setCount(val);
              }}
              className="w-full sm:w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <button 
            onClick={generateUuids}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)]"
          >
            <RefreshCcw size={16} /> Generate
          </button>
          
          <div className="flex-1" />

          <button 
            onClick={copyAll}
            disabled={uuids.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />} 
            {copied ? 'Copied All' : 'Copy All'}
          </button>
        </div>

        {!isPremium && (
          <div className="flex items-center justify-between p-3 bg-premium/10 border border-premium/20 rounded-lg">
            <div className="flex items-center gap-2 text-premium text-sm font-medium">
              <Lock size={16} /> Free tier limited to 10 UUIDs.
            </div>
            <button onClick={toggleMockPremium} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors">
              Unlock PRO (Up to 10,000)
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center px-1">
            <span className="text-sm font-medium text-slate-300">Generated UUIDs ({uuids.length})</span>
          </div>
          <div className="w-full h-[500px] bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-auto font-mono text-sm leading-relaxed text-slate-300">
            {uuids.length === 0 ? (
              <span className="text-slate-500 italic">Click Generate to create UUIDs...</span>
            ) : (
              uuids.map((uuid, i) => (
                <div key={i} className="py-1 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 px-2 rounded">
                  {uuid}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
