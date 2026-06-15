"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CheckCircle2, XCircle, ArrowRightLeft } from "lucide-react";

export function ContrastCheckerTool() {
  const [fgColor, setFgColor] = useState("#00f0ff");
  const [bgColor, setBgColor] = useState("#121824");
  const [ratio, setRatio] = useState(1);

  // Parse hex to rgb
  const hexToRgb = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    const num = parseInt(c, 16);
    return [num >> 16, (num >> 8) & 255, num & 255];
  };

  // Calculate relative luminance based on WCAG 2.0
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  useEffect(() => {
    try {
      const [r1, g1, b1] = hexToRgb(fgColor);
      const [r2, g2, b2] = hexToRgb(bgColor);
      const l1 = getLuminance(r1, g1, b1);
      const l2 = getLuminance(r2, g2, b2);
      
      const brightest = Math.max(l1, l2);
      const darkest = Math.min(l1, l2);
      const r = (brightest + 0.05) / (darkest + 0.05);
      setRatio(Math.round(r * 100) / 100);
    } catch (e) {
      // Invalid hex
    }
  }, [fgColor, bgColor]);

  const swapColors = () => {
    const t = fgColor;
    setFgColor(bgColor);
    setBgColor(t);
  };

  const getStatus = (required: number) => {
    if (ratio >= required) return { text: "Pass", color: "text-green-400 bg-green-400/10 border-green-400/20" };
    return { text: "Fail", color: "text-red-400 bg-red-400/10 border-red-400/20" };
  };

  return (
    <ToolLayout 
      title="WCAG Contrast Checker" 
      description="Calculate color contrast ratio for web accessibility."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
          
          <div className="flex-1 w-full flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg border-2 border-slate-700 shadow-inner overflow-hidden relative" style={{ backgroundColor: fgColor }}>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="absolute inset-0 w-20 h-20 -top-2 -left-2 opacity-0 cursor-pointer" />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-1">Text Color (Foreground)</label>
              <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-primary font-mono text-sm focus:outline-none focus:border-primary w-full" />
            </div>
          </div>

          <button onClick={swapColors} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700">
            <ArrowRightLeft size={18} />
          </button>

          <div className="flex-1 w-full flex items-center gap-4">
            <div className="flex flex-col w-full text-right">
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-1">Background Color</label>
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-primary font-mono text-sm focus:outline-none focus:border-primary w-full text-right" />
            </div>
            <div className="w-14 h-14 rounded-lg border-2 border-slate-700 shadow-inner overflow-hidden relative" style={{ backgroundColor: bgColor }}>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="absolute inset-0 w-20 h-20 -top-2 -left-2 opacity-0 cursor-pointer" />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div 
            className="flex flex-col items-center justify-center h-64 rounded-xl border border-slate-700/50 p-8 text-center transition-colors shadow-lg"
            style={{ backgroundColor: bgColor }}
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: fgColor }}>{ratio}:1</h2>
            <p className="text-lg" style={{ color: fgColor }}>Contrast Ratio</p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: "Normal Text (WCAG AA)", target: 4.5 },
              { label: "Large Text (WCAG AA)", target: 3.0 },
              { label: "Normal Text (WCAG AAA)", target: 7.0 },
              { label: "Large Text (WCAG AAA)", target: 4.5 },
            ].map((metric, i) => {
              const status = getStatus(metric.target);
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-300">{metric.label}</span>
                    <span className="text-xs text-slate-500">Requires {metric.target}:1</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${status.color}`}>
                    {ratio >= metric.target ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    <span className="text-xs font-bold uppercase">{status.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
