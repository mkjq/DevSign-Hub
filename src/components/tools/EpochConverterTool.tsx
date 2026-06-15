"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Clock, ArrowRightLeft } from "lucide-react";

export function EpochConverterTool() {
  const [epoch, setEpoch] = useState(Math.floor(Date.now() / 1000).toString());
  const [isoDate, setIsoDate] = useState("");
  
  const handleEpochChange = (val: string) => {
    setEpoch(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed)) {
      try {
        const d = new Date(parsed * (val.length > 10 ? 1 : 1000));
        setIsoDate(d.toISOString());
      } catch (e) {
        setIsoDate("Invalid Date");
      }
    } else {
      setIsoDate("");
    }
  };

  const handleIsoChange = (val: string) => {
    setIsoDate(val);
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      setEpoch(Math.floor(d.getTime() / 1000).toString());
    } else {
      setEpoch("");
    }
  };

  useEffect(() => {
    if (epoch && !isoDate) handleEpochChange(epoch);
  }, []);

  const setNow = () => {
    handleEpochChange(Math.floor(Date.now() / 1000).toString());
  };

  return (
    <ToolLayout 
      title="Epoch Timestamp Converter" 
      description="Convert Unix timestamps to human-readable dates and vice versa."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8 max-w-3xl">
        
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
          <div className="flex-1 w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Unix Epoch Timestamp</label>
            <input
              type="text"
              value={epoch}
              onChange={(e) => handleEpochChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-lg font-mono text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="e.g., 1700000000"
            />
          </div>

          <div className="hidden md:flex items-center justify-center mb-3">
            <ArrowRightLeft className="text-slate-600" />
          </div>

          <div className="flex-1 w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">ISO 8601 Date / UTC</label>
            <input
              type="text"
              value={isoDate}
              onChange={(e) => handleIsoChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm font-mono text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="e.g., 2023-11-14T22:13:20.000Z"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={setNow}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors border border-slate-600"
          >
            <Clock size={16} /> Get Current Time (Now)
          </button>
        </div>

      </div>
    </ToolLayout>
  );
}
