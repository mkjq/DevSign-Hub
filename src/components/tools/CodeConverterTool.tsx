"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { ArrowRightLeft, Lock, Play, Copy, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Language = "HTML/Tailwind" | "React/TS" | "Flutter/Dart" | "SwiftUI" | "Kotlin Compose";

export function CodeConverterTool() {
  const { isPremium, toggleMockPremium } = useAuth();
  const [sourceLang, setSourceLang] = useState<Language>("HTML/Tailwind");
  const [targetLang, setTargetLang] = useState<Language>("Flutter/Dart");
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [copied, setCopied] = useState(false);

  const languages: Language[] = ["HTML/Tailwind", "React/TS", "Flutter/Dart", "SwiftUI", "Kotlin Compose"];

  // Very basic regex-based transpilation rules for demonstration
  const convertCode = () => {
    if (!isPremium && inputCode.split("\n").length > 10) {
      setOutputCode("// PREMIUM FEATURE LOCKED \n// Free users are limited to 10 lines of code.\n// Upgrade to PRO to unlock unlimited batch processing.");
      return;
    }

    let result = inputCode;

    // A simplified mapping engine for demo purposes
    if (sourceLang === "HTML/Tailwind" && targetLang === "Flutter/Dart") {
      result = result
        .replace(/<div className="flex flex-col[^"]*">([\s\S]*?)<\/div>/g, "Column(children: [$1])")
        .replace(/<div className="flex[^"]*">([\s\S]*?)<\/div>/g, "Row(children: [$1])")
        .replace(/<button[^>]*>([\s\S]*?)<\/button>/g, 'ElevatedButton(onPressed: () {}, child: Text("$1"))')
        .replace(/<span[^>]*>([\s\S]*?)<\/span>/g, 'Text("$1")')
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, 'Text("$1")');
    } else if (sourceLang === "HTML/Tailwind" && targetLang === "SwiftUI") {
      result = result
        .replace(/<div className="flex flex-col[^"]*">([\s\S]*?)<\/div>/g, "VStack {\n$1\n}")
        .replace(/<div className="flex[^"]*">([\s\S]*?)<\/div>/g, "HStack {\n$1\n}")
        .replace(/<button[^>]*>([\s\S]*?)<\/button>/g, 'Button("$1") {\n    // Action\n}')
        .replace(/<span[^>]*>([\s\S]*?)<\/span>/g, 'Text("$1")')
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, 'Text("$1")');
    } else if (sourceLang === "HTML/Tailwind" && targetLang === "Kotlin Compose") {
      result = result
        .replace(/<div className="flex flex-col[^"]*">([\s\S]*?)<\/div>/g, "Column {\n$1\n}")
        .replace(/<div className="flex[^"]*">([\s\S]*?)<\/div>/g, "Row {\n$1\n}")
        .replace(/<button[^>]*>([\s\S]*?)<\/button>/g, 'Button(onClick = { /* Action */ }) {\n    Text("$1")\n}')
        .replace(/<span[^>]*>([\s\S]*?)<\/span>/g, 'Text("$1")')
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, 'Text("$1")');
    } else {
      result = `// Conversion from ${sourceLang} to ${targetLang} is not fully supported in this demo engine yet.\n// Try converting HTML/Tailwind to Flutter/Dart, SwiftUI, or Kotlin Compose.`;
    }

    setOutputCode(result);
  };

  const copyToClipboard = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="Universal Code Converter" 
      description="Transform code syntaxes dynamically across major frameworks (Flagship Feature)."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex-1 w-full">
            <label className="text-xs text-slate-400 font-medium mb-1 block">Source</label>
            <select 
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as Language)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          
          <div className="pt-5 hidden sm:block">
            <div className="p-2 bg-slate-800 rounded-full border border-slate-700 text-slate-400">
              <ArrowRightLeft size={16} />
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="text-xs text-slate-400 font-medium mb-1 block">Target</label>
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as Language)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          
          <div className="pt-5 w-full sm:w-auto">
            <button 
              onClick={convertCode}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)]"
            >
              <Play size={16} fill="currentColor" /> Convert
            </button>
          </div>
        </div>

        {/* Premium Warning banner */}
        {!isPremium && (
          <div className="flex items-center justify-between p-3 bg-premium/10 border border-premium/20 rounded-lg">
            <div className="flex items-center gap-2 text-premium text-sm font-medium">
              <Lock size={16} /> Free tier limited to 10 lines.
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
              <span className="text-sm font-medium text-slate-300">Input ({sourceLang})</span>
            </div>
            <textarea
              className="w-full h-80 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder={'<div className="flex">\n  <button>Click me</button>\n</div>'}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              spellCheck="false"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-slate-300">Output ({targetLang})</span>
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
              className="w-full h-80 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-primary focus:outline-none resize-none"
              placeholder="Converted code will appear here..."
              value={outputCode}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
