"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check, Zap } from "lucide-react";

export function SvgOptimizerTool() {
  const [inputSvg, setInputSvg] = useState(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  <!-- This is a comment -->\n  <g>\n    <circle cx="12" cy="12" r="10"></circle>\n    <line x1="12" y1="8" x2="12" y2="12"></line>\n    <line x1="12" y1="16" x2="12.01" y2="16"></line>\n  </g>\n</svg>`);
  const [outputSvg, setOutputSvg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let optimized = inputSvg;
    
    // Very naive optimization for demo purposes
    try {
      // Remove comments
      optimized = optimized.replace(/<!--[\s\S]*?-->/g, "");
      // Remove empty g tags
      optimized = optimized.replace(/<g>\s*<\/g>/g, "");
      // Remove unnecessary whitespace
      optimized = optimized.replace(/>\s+</g, "><");
      // Format with simple newlines for basic readability instead of minifying fully
      optimized = optimized.replace(/(<\/?(?:svg|g|path|circle|line|rect|polygon|polyline)[^>]*>)/g, "$1\n");
      // Remove blank lines
      optimized = optimized.split('\n').map(l => l.trim()).filter(l => l.length > 0).join('\n');
      
      setOutputSvg(optimized);
    } catch (e) {
      setOutputSvg(inputSvg); // Fallback
    }
  }, [inputSvg]);

  const copyToClipboard = () => {
    if (!outputSvg) return;
    navigator.clipboard.writeText(outputSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSavedBytes = () => {
    return Math.max(0, inputSvg.length - outputSvg.length);
  };

  const getSavedPercentage = () => {
    if (inputSvg.length === 0) return 0;
    return ((getSavedBytes() / inputSvg.length) * 100).toFixed(1);
  };

  return (
    <ToolLayout 
      title="SVG Code Optimizer & Previewer" 
      description="Clean SVG metadata bloat and preview vector images dynamically."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6">
        
        <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">Optimization Results</div>
              <div className="text-xs text-slate-400">
                Reduced size by {getSavedBytes()} bytes ({getSavedPercentage()}%)
              </div>
            </div>
          </div>
          
          <button 
            onClick={copyToClipboard}
            disabled={!outputSvg}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />} 
            {copied ? 'Copied SVG' : 'Copy Optimized SVG'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
          <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-slate-300">Raw Input SVG</span>
            </div>
            <textarea
              className="w-full h-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="<svg>...</svg>"
              value={inputSvg}
              onChange={(e) => setInputSvg(e.target.value)}
              spellCheck="false"
            />
          </div>

          <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-slate-300">Live Preview</span>
            </div>
            <div className="w-full h-full bg-[#1e293b] rounded-lg border border-slate-700 flex items-center justify-center overflow-hidden relative" 
                 style={{
                   backgroundImage: 'linear-gradient(45deg, #0f172a 25%, transparent 25%, transparent 75%, #0f172a 75%, #0f172a), linear-gradient(45deg, #0f172a 25%, transparent 25%, transparent 75%, #0f172a 75%, #0f172a)',
                   backgroundSize: '20px 20px',
                   backgroundPosition: '0 0, 10px 10px'
                 }}
            >
              <div 
                className="w-3/4 h-3/4 flex items-center justify-center text-primary"
                dangerouslySetInnerHTML={{ __html: outputSvg }}
              />
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
