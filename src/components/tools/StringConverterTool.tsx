"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check } from "lucide-react";

export function StringConverterTool() {
  const [inputText, setInputText] = useState("hello world, let's transform some text!");
  const [copied, setCopied] = useState<string | null>(null);

  const getWords = (str: string) => {
    return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g) || [];
  };

  const toCamelCase = (str: string) => {
    const words = getWords(str);
    if (words.length === 0 || !words[0]) return "";
    return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  };

  const toSnakeCase = (str: string) => {
    return getWords(str).map(w => w.toLowerCase()).join('_');
  };

  const toPascalCase = (str: string) => {
    return getWords(str).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  };

  const toKebabCase = (str: string) => {
    return getWords(str).map(w => w.toLowerCase()).join('-');
  };

  const toConstantCase = (str: string) => {
    return getWords(str).map(w => w.toUpperCase()).join('_');
  };

  const cases = [
    { name: "camelCase", value: toCamelCase(inputText) },
    { name: "snake_case", value: toSnakeCase(inputText) },
    { name: "PascalCase", value: toPascalCase(inputText) },
    { name: "kebab-case", value: toKebabCase(inputText) },
    { name: "CONSTANT_CASE", value: toConstantCase(inputText) },
  ];

  const copyToClipboard = (text: string, name: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout 
      title="String Case Converter" 
      description="Instantly convert strings into various programming cases."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8">
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Input String</label>
          <textarea
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            placeholder="Type your string here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            spellCheck="false"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <div key={c.name} className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 relative group">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">{c.name}</span>
                <button 
                  onClick={() => copyToClipboard(c.value, c.name)} 
                  className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  {copied === c.name ? <Check size={12}/> : <Copy size={12}/>} 
                  {copied === c.name ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-sm text-primary break-all">
                {c.value || <span className="text-slate-600 italic">Empty</span>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </ToolLayout>
  );
}
