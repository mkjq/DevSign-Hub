"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check } from "lucide-react";

export function CrontabGeneratorTool() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [day, setDay] = useState("*");
  const [month, setMonth] = useState("*");
  const [weekday, setWeekday] = useState("*");
  
  const [explanation, setExplanation] = useState("");
  const [copied, setCopied] = useState(false);

  const cronString = `${minute} ${hour} ${day} ${month} ${weekday}`;

  useEffect(() => {
    // A simplified cron explanation generator
    let exp = "Runs ";
    
    if (minute === "*" && hour === "*" && day === "*" && month === "*" && weekday === "*") {
      exp += "every minute of every day.";
    } else {
      if (minute !== "*") exp += `at minute ${minute} `;
      else exp += "every minute ";
      
      if (hour !== "*") exp += `past hour ${hour} `;
      
      if (day !== "*") exp += `on day ${day} of the month `;
      
      if (month !== "*") exp += `in month ${month} `;
      
      if (weekday !== "*") exp += `on ${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][parseInt(weekday)] || `day ${weekday} of the week`} `;
    }
    
    setExplanation(exp.trim() + ".");
  }, [minute, hour, day, month, weekday]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setPreset = (preset: string) => {
    const parts = preset.split(" ");
    setMinute(parts[0]);
    setHour(parts[1]);
    setDay(parts[2]);
    setMonth(parts[3]);
    setWeekday(parts[4]);
  };

  return (
    <ToolLayout 
      title="Crontab Expression Generator" 
      description="Visual builder that outputs crontab syntax with human-readable explanations."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8">
        
        {/* Output */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-premium" />
          <div className="text-5xl sm:text-7xl font-mono text-white tracking-widest mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            {cronString}
          </div>
          <div className="text-xl text-primary font-medium text-center max-w-lg">
            "{explanation}"
          </div>
          
          <button 
            onClick={copyToClipboard}
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Minute (0-59)</label>
            <input type="text" value={minute} onChange={e => setMinute(e.target.value)} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white text-center font-mono focus:border-primary focus:outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Hour (0-23)</label>
            <input type="text" value={hour} onChange={e => setHour(e.target.value)} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white text-center font-mono focus:border-primary focus:outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Day (1-31)</label>
            <input type="text" value={day} onChange={e => setDay(e.target.value)} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white text-center font-mono focus:border-primary focus:outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Month (1-12)</label>
            <input type="text" value={month} onChange={e => setMonth(e.target.value)} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white text-center font-mono focus:border-primary focus:outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Weekday (0-6)</label>
            <input type="text" value={weekday} onChange={e => setWeekday(e.target.value)} className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white text-center font-mono focus:border-primary focus:outline-none" />
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-slate-300">Common Presets</h4>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setPreset("* * * * *")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-slate-300">Every Minute</button>
            <button onClick={() => setPreset("0 * * * *")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-slate-300">Every Hour</button>
            <button onClick={() => setPreset("0 0 * * *")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-slate-300">Every Day at Midnight</button>
            <button onClick={() => setPreset("0 0 * * 0")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-slate-300">Every Sunday</button>
            <button onClick={() => setPreset("0 0 1 * *")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-slate-300">Every 1st of the Month</button>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
