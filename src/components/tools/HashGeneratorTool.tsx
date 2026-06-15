"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Lock, Copy, Check } from "lucide-react";
import CryptoJS from "crypto-js";

export function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({ md5: "", sha1: "", sha256: "", sha512: "" });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!input) {
      setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
      return;
    }
    
    setHashes({
      md5: CryptoJS.MD5(input).toString(CryptoJS.enc.Hex),
      sha1: CryptoJS.SHA1(input).toString(CryptoJS.enc.Hex),
      sha256: CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex),
      sha512: CryptoJS.SHA512(input).toString(CryptoJS.enc.Hex),
    });
  }, [input]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const hashTypes = [
    { label: "MD5", value: hashes.md5, id: "md5" },
    { label: "SHA-1", value: hashes.sha1, id: "sha1" },
    { label: "SHA-256", value: hashes.sha256, id: "sha256" },
    { label: "SHA-512", value: hashes.sha512, id: "sha512" },
  ];

  return (
    <ToolLayout 
      title="Cryptographic Hash Generator" 
      description="Instantly compute message digests (MD5, SHA, etc.) completely client-side."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Lock size={16} className="text-primary" /> Input String
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-primary resize-none custom-scrollbar transition-colors"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">Computed Hashes</h3>
          
          <div className="grid gap-4">
            {hashTypes.map(({ label, value, id }) => (
              <div key={id} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{label}</span>
                  <div className="font-mono text-sm text-slate-300 break-all w-full">
                    {value || <span className="text-slate-600 italic">Waiting for input...</span>}
                  </div>
                </div>
                
                <button
                  onClick={() => value && handleCopy(value, id)}
                  disabled={!value}
                  className="shrink-0 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 px-3 py-1.5 rounded transition-colors text-sm"
                >
                  {copied === id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied === id ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
