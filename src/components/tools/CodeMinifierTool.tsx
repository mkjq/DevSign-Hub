"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check, FileJson, FileCode2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function CodeMinifierTool() {
  const { isPremium, toggleMockPremium } = useAuth();
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [mode, setMode] = useState<"minify" | "beautify">("minify");
  const [lang, setLang] = useState<"html" | "css" | "js">("js");
  const [copied, setCopied] = useState(false);

  const processCode = () => {
    if (!isPremium && inputCode.length > 5000) {
      setOutputCode("// PREMIUM FEATURE LOCKED \n// Free users are limited to 5,000 characters.\n// Upgrade to PRO to unlock unlimited processing.");
      return;
    }

    try {
      let result = inputCode;
      if (mode === "minify") {
        if (lang === "js" || lang === "css") {
          result = result.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove block comments
          result = result.replace(/\/\/.*/g, ""); // Remove line comments
          result = result.replace(/\s+/g, " "); // Collapse whitespace
          result = result.replace(/\s*([{}();:,=<>+\-*/!&|])\s*/g, "$1"); // Remove spaces around operators
        } else if (lang === "html") {
          result = result.replace(/<!--[\s\S]*?-->/g, ""); // Remove HTML comments
          result = result.replace(/>\s+</g, "><"); // Remove whitespace between tags
        }
      } else {
        // Very basic beautify (just simple indenting for demo)
        let indentLevel = 0;
        if (lang === "js" || lang === "css") {
          result = inputCode.replace(/([{}();])/g, (match) => {
            if (match === "{") {
              indentLevel++;
              return "{\n" + "  ".repeat(indentLevel);
            }
            if (match === "}") {
              indentLevel = Math.max(0, indentLevel - 1);
              return "\n" + "  ".repeat(indentLevel) + "}";
            }
            if (match === ";" || match === ")") {
              return match + "\n" + "  ".repeat(indentLevel);
            }
            return match;
          });
        } else if (lang === "html") {
          result = inputCode.replace(/(>)(<)(\/*)/g, "$1\n$2$3");
          const lines = result.split("\n");
          let htmlIndent = 0;
          result = lines.map(line => {
            if (line.match(/^<\//)) htmlIndent = Math.max(0, htmlIndent - 1);
            const formatted = "  ".repeat(htmlIndent) + line;
            if (line.match(/^<[^/]/) && !line.match(/\/>$/) && !line.match(/<\/.*>$/)) htmlIndent++;
            return formatted;
          }).join("\n");
        }
      }
      setOutputCode(result.trim());
    } catch (e) {
      setOutputCode("Error processing code.");
    }
  };

  const copyToClipboard = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="HTML/CSS/JS Minifier & Beautifier" 
      description="Compress web code to minimum size or format it beautifully."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => setLang("html")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${lang === "html" ? 'bg-primary text-slate-900 font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              HTML
            </button>
            <button 
              onClick={() => setLang("css")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${lang === "css" ? 'bg-primary text-slate-900 font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              CSS
            </button>
            <button 
              onClick={() => setLang("js")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${lang === "js" ? 'bg-primary text-slate-900 font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              JS
            </button>
          </div>

          <div className="w-px h-6 bg-slate-700 mx-2 hidden sm:block" />

          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => setMode("minify")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${mode === "minify" ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              <FileJson size={14} /> Minify
            </button>
            <button 
              onClick={() => setMode("beautify")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${mode === "beautify" ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              <FileCode2 size={14} /> Beautify
            </button>
          </div>
          
          <div className="flex-1" />

          <button 
            onClick={processCode}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)]"
          >
            Process Code
          </button>
        </div>

        {!isPremium && (
          <div className="flex items-center justify-between p-3 bg-premium/10 border border-premium/20 rounded-lg">
            <div className="flex items-center gap-2 text-premium text-sm font-medium">
              <Lock size={16} /> Free tier limited to 5,000 characters.
            </div>
            <button onClick={toggleMockPremium} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors">
              Unlock PRO
            </button>
          </div>
        )}

        {/* Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-slate-300">Input ({inputCode.length} chars)</span>
            </div>
            <textarea
              className="w-full h-96 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="Paste your code here..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              spellCheck="false"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-slate-300">Output ({outputCode.length} chars)</span>
              <button 
                onClick={copyToClipboard} 
                disabled={!outputCode}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={12}/> : <Copy size={12}/>} {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full h-96 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-primary focus:outline-none resize-none"
              placeholder="Result will appear here..."
              value={outputCode}
            />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
