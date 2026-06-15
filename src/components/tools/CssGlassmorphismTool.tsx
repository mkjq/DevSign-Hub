"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check } from "lucide-react";

export function CssGlassmorphismTool() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(20);
  const [color, setColor] = useState("#ffffff");
  const [outline, setOutline] = useState(10);
  
  // Claymorphism
  const [clayRadius, setClayRadius] = useState(20);
  const [clayDepth, setClayDepth] = useState(5);
  const [isClay, setIsClay] = useState(false);

  const [copied, setCopied] = useState(false);

  // Convert hex to rgb for rgba usage
  const hexToRgb = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    const num = parseInt(c, 16);
    return `${num >> 16}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  const getCss = () => {
    if (isClay) {
      return `border-radius: ${clayRadius}px;
background: ${color};
box-shadow: inset ${clayDepth}px ${clayDepth}px ${clayDepth * 2}px rgba(255, 255, 255, ${opacity / 100}),
            inset -${clayDepth}px -${clayDepth}px ${clayDepth * 2}px rgba(0, 0, 0, ${opacity / 100}),
            ${clayDepth}px ${clayDepth}px ${clayDepth * 2}px rgba(0, 0, 0, 0.2);
transition: all 0.3s ease;`;
    }

    return `background: rgba(${hexToRgb(color)}, ${opacity / 100});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: 16px;
border: 1px solid rgba(255, 255, 255, ${outline / 100});`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCss());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="CSS Glassmorphism & Claymorphism" 
      description="Interactive visual builder for modern CSS material effects."
      isPremiumOnly={false}
    >
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* Controls */}
        <div className="flex-1 flex flex-col gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
          
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button 
              onClick={() => setIsClay(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isClay ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Glassmorphism
            </button>
            <button 
              onClick={() => setIsClay(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isClay ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Claymorphism
            </button>
          </div>

          {!isClay ? (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Blur Amount</label>
                  <span className="text-primary font-mono">{blur}px</span>
                </div>
                <input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Background Opacity</label>
                  <span className="text-primary font-mono">{opacity}%</span>
                </div>
                <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Outline Opacity</label>
                  <span className="text-primary font-mono">{outline}%</span>
                </div>
                <input type="range" min="0" max="100" value={outline} onChange={(e) => setOutline(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-300 font-medium text-sm">Base Color</label>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded border border-slate-600 overflow-hidden relative" style={{ backgroundColor: color }}>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="absolute -top-2 -left-2 w-14 h-14 opacity-0 cursor-pointer" />
                  </div>
                  <span className="font-mono text-slate-400">{color}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Border Radius</label>
                  <span className="text-primary font-mono">{clayRadius}px</span>
                </div>
                <input type="range" min="0" max="100" value={clayRadius} onChange={(e) => setClayRadius(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Depth / Shadow Offset</label>
                  <span className="text-primary font-mono">{clayDepth}px</span>
                </div>
                <input type="range" min="0" max="50" value={clayDepth} onChange={(e) => setClayDepth(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Highlight / Shadow Opacity</label>
                  <span className="text-primary font-mono">{opacity}%</span>
                </div>
                <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-300 font-medium text-sm">Clay Base Color</label>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded border border-slate-600 overflow-hidden relative" style={{ backgroundColor: color }}>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="absolute -top-2 -left-2 w-14 h-14 opacity-0 cursor-pointer" />
                  </div>
                  <span className="font-mono text-slate-400">{color}</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Preview and CSS output */}
        <div className="flex-[1.5] flex flex-col gap-6">
          <div 
            className="w-full h-[300px] rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div 
              className="w-64 h-48 flex items-center justify-center p-6"
              style={isClay ? {
                borderRadius: `${clayRadius}px`,
                background: color,
                boxShadow: `inset ${clayDepth}px ${clayDepth}px ${clayDepth * 2}px rgba(255, 255, 255, ${opacity / 100}), inset -${clayDepth}px -${clayDepth}px ${clayDepth * 2}px rgba(0, 0, 0, ${opacity / 100}), ${clayDepth}px ${clayDepth}px ${clayDepth * 2}px rgba(0, 0, 0, 0.2)`,
              } : {
                background: `rgba(${hexToRgb(color)}, ${opacity / 100})`,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                borderRadius: '16px',
                border: `1px solid rgba(255, 255, 255, ${outline / 100})`,
              }}
            >
              <span className={`text-2xl font-bold ${isClay ? 'text-slate-800' : 'text-white'}`}>Preview</span>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute right-3 top-3">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded transition-colors border border-slate-700"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />} 
                {copied ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="w-full bg-slate-900 border border-slate-700 rounded-lg p-5 pt-10 text-sm font-mono text-primary overflow-x-auto">
              <code>{getCss()}</code>
            </pre>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
