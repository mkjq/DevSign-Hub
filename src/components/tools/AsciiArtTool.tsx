"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Type, Copy, RefreshCw } from "lucide-react";
import figlet from "figlet";
// Import basic standard font
import standard from "figlet/importable-fonts/Standard.js";
import slant from "figlet/importable-fonts/Slant.js";
import ghost from "figlet/importable-fonts/Ghost.js";
import block from "figlet/importable-fonts/Block.js";

figlet.parseFont("Standard", standard);
figlet.parseFont("Slant", slant);
figlet.parseFont("Ghost", ghost);
figlet.parseFont("Block", block);

export function AsciiArtTool() {
  const [text, setText] = useState("DevSign");
  const [font, setFont] = useState("Standard");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!text.trim()) {
      setOutput("");
      return;
    }
    
    figlet.text(text, { font: font as figlet.Fonts }, (err, result) => {
      if (err) {
        setOutput("Error generating ASCII art");
        return;
      }
      setOutput(result || "");
    });
  }, [text, font]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <ToolLayout 
      title="Text to ASCII Art Generator" 
      description="Create stylish, terminal-safe ASCII text art blocks."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Type size={16} className="text-primary" /> Input Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Font Style</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="Standard">Standard</option>
              <option value="Slant">Slant</option>
              <option value="Ghost">Ghost</option>
              <option value="Block">Block</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">Generated ASCII Art</label>
            <button 
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Copy size={16} /> Copy Art
            </button>
          </div>
          
          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-6 overflow-x-auto custom-scrollbar shadow-inner min-h-[250px]">
            <pre className="font-mono text-xs sm:text-sm text-primary leading-tight whitespace-pre">
              {output || "Waiting for input..."}
            </pre>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
