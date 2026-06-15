"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Upload, Download, Copy, Check, ArrowRightLeft, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Base64ConverterTool() {
  const { isPremium, toggleMockPremium } = useAuth();
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [type, setType] = useState<"text" | "file">("text");
  
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Text Conversion
  const handleTextConvert = () => {
    try {
      if (mode === "encode") {
        setTextOutput(btoa(unescape(encodeURIComponent(textInput))));
      } else {
        setTextOutput(decodeURIComponent(escape(atob(textInput))));
      }
    } catch (e: any) {
      setTextOutput("Error: Invalid Input");
    }
  };

  // File Conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Premium Check: 1MB free, 50MB premium
    const maxSize = isPremium ? 50 * 1024 * 1024 : 1 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(`File size exceeds limit (${isPremium ? '50MB' : '1MB'}). ${!isPremium ? 'Upgrade to PRO to unlock larger files.' : ''}`);
      setFileInput(null);
      return;
    }

    setFileInput(file);
    setFileError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = event.target.result.toString();
        setFileBase64(mode === "encode" ? base64String : ""); // Decoding files is more complex and typically requires parsing mime
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="Base64 Text & File Converter" 
      description="Encode/Decode strings and raw files to/from Base64."
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
            onClick={() => setType("text")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === "text" ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Text
          </button>
          <button 
            onClick={() => setType("file")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === "file" ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            File
          </button>
        </div>

        {!isPremium && type === "file" && (
          <div className="flex items-center justify-between p-3 bg-premium/10 border border-premium/20 rounded-lg">
            <div className="flex items-center gap-2 text-premium text-sm font-medium">
              <Lock size={16} /> Free tier limited to 1MB files.
            </div>
            <button onClick={toggleMockPremium} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors">
              Unlock PRO (50MB)
            </button>
          </div>
        )}

        {type === "text" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Input {mode === "encode" ? "Text" : "Base64"}</label>
              <textarea
                className="w-full h-80 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setTimeout(handleTextConvert, 100);
                }}
                spellCheck="false"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Output {mode === "encode" ? "Base64" : "Text"}</label>
                <button 
                  onClick={() => copyToClipboard(textOutput)} 
                  disabled={!textOutput}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? <Check size={12}/> : <Copy size={12}/>} {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                className="w-full h-80 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-primary focus:outline-none resize-none"
                value={textOutput}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div 
              className="w-full h-48 border-2 border-dashed border-slate-700 hover:border-primary/50 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-slate-900/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <input type="file" ref={fileRef} className="hidden" onChange={handleFileChange} />
              <Upload size={32} className="text-slate-500 mb-2" />
              <span className="text-slate-300 font-medium">Click to upload file</span>
              <span className="text-slate-500 text-sm mt-1">Max size: {isPremium ? '50MB' : '1MB'}</span>
            </div>

            {fileError && <div className="text-red-400 text-sm">{fileError}</div>}

            {fileInput && mode === "encode" && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Base64 Output ({fileInput.name})</span>
                  <button 
                    onClick={() => copyToClipboard(fileBase64)} 
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    {copied ? <Check size={12}/> : <Copy size={12}/>} {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea
                  readOnly
                  className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-primary focus:outline-none resize-none break-all"
                  value={fileBase64}
                />
              </div>
            )}
            
            {mode === "decode" && (
              <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm">
                Note: Decoding files from Base64 string directly is best done by pasting the Base64 Data URL in the Text tab and using a custom script. File uploading for decoding is currently disabled in this demo.
              </div>
            )}
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
