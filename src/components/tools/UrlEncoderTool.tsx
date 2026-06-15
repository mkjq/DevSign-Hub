"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check, ArrowRightLeft } from "lucide-react";

export function UrlEncoderTool() {
  const [inputUrl, setInputUrl] = useState("https://devsignhub.com/search?q=url encoder & decoder");
  const [outputUrl, setOutputUrl] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [componentMode, setComponentMode] = useState<"full" | "component">("component");
  const [copied, setCopied] = useState(false);

  const processUrl = () => {
    try {
      if (mode === "encode") {
        if (componentMode === "full") {
          setOutputUrl(encodeURI(inputUrl));
        } else {
          setOutputUrl(encodeURIComponent(inputUrl));
        }
      } else {
        if (componentMode === "full") {
          setOutputUrl(decodeURI(inputUrl));
        } else {
          setOutputUrl(decodeURIComponent(inputUrl));
        }
      }
    } catch (e: any) {
      setOutputUrl("Error: Invalid Input URL format.");
    }
  };

  React.useEffect(() => {
    processUrl();
  }, [inputUrl, mode, componentMode]);

  const copyToClipboard = () => {
    if (!outputUrl) return;
    navigator.clipboard.writeText(outputUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="URL Encoder/Decoder" 
      description="Safely encode and decode web URLs and query parameters."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6">
        
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50 w-fit">
          <button 
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "encode" ? 'bg-primary text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            Encode
          </button>
          <button 
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "decode" ? 'bg-primary text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            Decode
          </button>
          <div className="w-px h-6 bg-slate-700 mx-2" />
          <button 
            onClick={() => setComponentMode("component")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${componentMode === "component" ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Uses encodeURIComponent/decodeURIComponent"
          >
            Parameter
          </button>
          <button 
            onClick={() => setComponentMode("full")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${componentMode === "full" ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Uses encodeURI/decodeURI"
          >
            Full URL
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-slate-300">Input ({mode === "encode" ? "Raw" : "Encoded"})</span>
            </div>
            <textarea
              className="w-full h-80 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none break-all"
              placeholder="Paste URL here..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              spellCheck="false"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-slate-300">Output ({mode === "encode" ? "Encoded" : "Raw"})</span>
              <button 
                onClick={copyToClipboard} 
                disabled={!outputUrl || outputUrl.startsWith("Error:")}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={12}/> : <Copy size={12}/>} {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full h-80 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-primary focus:outline-none resize-none break-all"
              placeholder="Result will appear here..."
              value={outputUrl}
            />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
