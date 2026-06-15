"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { ArrowRightLeft, FileCode2, Copy, AlertCircle } from "lucide-react";
import yaml from "js-yaml";

export function YamlJsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"yaml2json" | "json2yaml">("yaml2json");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = (newInput: string = input, newMode: "yaml2json" | "json2yaml" = mode) => {
    setInput(newInput);
    if (!newInput.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (newMode === "yaml2json") {
        const parsed = yaml.load(newInput);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(newInput);
        setOutput(yaml.dump(parsed));
      }
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid input format");
    }
  };

  const toggleMode = () => {
    const newMode = mode === "yaml2json" ? "json2yaml" : "yaml2json";
    setMode(newMode);
    
    // Auto convert output to input if valid
    if (output && !error) {
      setInput(output);
      handleConvert(output, newMode);
    } else {
      handleConvert(input, newMode);
    }
  };

  const handleCopy = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  const loadExample = () => {
    if (mode === "yaml2json") {
      handleConvert(`server:
  port: 8080
  host: localhost
users:
  - name: Alice
    role: admin
  - name: Bob
    role: editor`);
    } else {
      handleConvert(JSON.stringify({
        server: { port: 8080, host: "localhost" },
        users: [{ name: "Alice", role: "admin" }, { name: "Bob", role: "editor" }]
      }, null, 2));
    }
  };

  return (
    <ToolLayout 
      title="YAML ⇄ JSON Converter" 
      description="Instantly convert configuration data between YAML and JSON formats."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        
        {/* Controls */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-4">
            <span className={`font-mono text-sm font-bold ${mode === 'yaml2json' ? 'text-primary' : 'text-slate-500'}`}>YAML</span>
            <button 
              onClick={toggleMode}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors text-slate-300"
              title="Swap Conversion Direction"
            >
              <ArrowRightLeft size={18} />
            </button>
            <span className={`font-mono text-sm font-bold ${mode === 'json2yaml' ? 'text-primary' : 'text-slate-500'}`}>JSON</span>
          </div>

          <button 
            onClick={loadExample}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded transition-colors"
          >
            Load Example
          </button>
        </div>

        {/* Editor Area */}
        <div className="grid lg:grid-cols-2 gap-6 h-[500px]">
          
          {/* Input */}
          <div className="flex flex-col gap-2 h-full">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileCode2 size={16} /> Input ({mode === 'yaml2json' ? 'YAML' : 'JSON'})
            </label>
            <textarea
              value={input}
              onChange={(e) => handleConvert(e.target.value)}
              placeholder={`Paste your ${mode === 'yaml2json' ? 'YAML' : 'JSON'} here...`}
              className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 font-mono text-sm focus:outline-none focus:border-primary resize-none custom-scrollbar"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2 h-full relative">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <FileCode2 size={16} /> Output ({mode === 'yaml2json' ? 'JSON' : 'YAML'})
              </label>
              <button 
                onClick={handleCopy}
                disabled={!output || !!error}
                className="flex items-center gap-1 text-xs bg-primary/20 text-primary hover:bg-primary/30 px-2 py-1 rounded transition-colors disabled:opacity-50"
              >
                <Copy size={12} /> Copy
              </button>
            </div>
            
            <textarea
              value={error ? '' : output}
              readOnly
              placeholder="Result will appear here..."
              className={`flex-1 w-full border rounded-xl p-4 font-mono text-sm resize-none custom-scrollbar ${error ? 'bg-red-500/5 border-red-500/30' : 'bg-slate-900/50 border-slate-700 text-green-400'}`}
            />

            {error && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-sm bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex flex-col items-center text-center gap-2 backdrop-blur-sm">
                <AlertCircle size={24} />
                <span className="text-sm font-medium">Syntax Error</span>
                <span className="text-xs opacity-80 break-all">{error}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
