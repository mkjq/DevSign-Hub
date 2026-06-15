"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";

export function RegexTesterTool() {
  const [regexStr, setRegexStr] = useState("[a-z]+@[a-z]+\.[a-z]{2,}");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("Contact us at support@devsignhub.com or hello@world.com for info.");
  const [matches, setMatches] = useState<{ match: string; index: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<{ token: string; desc: string }[]>([]);

  useEffect(() => {
    try {
      if (!regexStr) {
        setMatches([]);
        setError(null);
        setExplanations([]);
        return;
      }

      const regex = new RegExp(regexStr, flags);
      const newMatches = [];
      
      let match;
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          newMatches.push({ match: match[0], index: match.index });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) newMatches.push({ match: match[0], index: match.index });
      }
      
      setMatches(newMatches);
      setError(null);
      
      // Simple Rule-based Explainer (Pseudo-AI)
      const exps = [];
      if (regexStr.includes('^')) exps.push({ token: '^', desc: 'Asserts position at the start of a line' });
      if (regexStr.includes('$')) exps.push({ token: '$', desc: 'Asserts position at the end of a line' });
      if (regexStr.includes('\d')) exps.push({ token: '\d', desc: 'Matches any digit (0-9)' });
      if (regexStr.includes('\w')) exps.push({ token: '\w', desc: 'Matches any word character (alphanumeric & underscore)' });
      if (regexStr.includes('+')) exps.push({ token: '+', desc: 'Matches 1 or more of the preceding token' });
      if (regexStr.includes('*')) exps.push({ token: '*', desc: 'Matches 0 or more of the preceding token' });
      if (regexStr.includes('?')) exps.push({ token: '?', desc: 'Matches 0 or 1 of the preceding token' });
      if (regexStr.includes('[')) exps.push({ token: '[...]', desc: 'Matches any character in the set' });
      if (regexStr.includes('{')) exps.push({ token: '{n,m}', desc: 'Matches between n and m times' });
      
      setExplanations(exps.length ? exps : [{ token: regexStr, desc: 'Literal text match' }]);

    } catch (e: any) {
      setError(e.message);
      setMatches([]);
      setExplanations([]);
    }
  }, [regexStr, flags, testString]);

  // Create highlighted text
  const getHighlightedText = () => {
    if (!matches.length || error) return testString;
    
    let lastIndex = 0;
    const elements = [];
    
    matches.forEach((m, i) => {
      elements.push(<span key={`text-${i}`}>{testString.substring(lastIndex, m.index)}</span>);
      elements.push(<mark key={`mark-${i}`} className="bg-primary/30 text-primary font-bold px-1 rounded">{m.match}</mark>);
      lastIndex = m.index + m.match.length;
    });
    
    elements.push(<span key="text-last">{testString.substring(lastIndex)}</span>);
    
    return elements;
  };

  return (
    <ToolLayout 
      title="Regex Tester & AI Explainer" 
      description="Test regular expressions with real-time matching and a breakdown explanation."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Regular Expression</label>
          <div className="flex bg-slate-900 border border-slate-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
            <div className="px-4 py-3 bg-slate-800 text-slate-400 font-mono text-lg border-r border-slate-700">/</div>
            <input
              type="text"
              className="flex-1 bg-transparent p-3 font-mono text-lg text-primary outline-none"
              value={regexStr}
              onChange={(e) => setRegexStr(e.target.value)}
              placeholder="Pattern"
            />
            <div className="px-4 py-3 bg-slate-800 text-slate-400 font-mono text-lg border-l border-r border-slate-700">/</div>
            <input
              type="text"
              className="w-16 bg-transparent p-3 font-mono text-lg text-accent outline-none"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="gmi"
            />
          </div>
          {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300">Test String</label>
              <span className="text-xs text-slate-500">{matches.length} match(es)</span>
            </div>
            <div className="relative w-full h-64 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <div className="absolute inset-0 p-4 font-mono text-sm whitespace-pre-wrap break-words text-slate-300 pointer-events-none">
                {getHighlightedText()}
              </div>
              <textarea
                className="absolute inset-0 w-full h-full p-4 font-mono text-sm whitespace-pre-wrap break-words text-transparent bg-transparent outline-none resize-none caret-white"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                spellCheck="false"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Pattern Explanation</label>
            <div className="w-full h-64 bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 overflow-auto">
              {explanations.length > 0 ? (
                <ul className="space-y-3">
                  {explanations.map((exp, i) => (
                    <li key={i} className="flex flex-col">
                      <code className="text-primary font-bold text-sm mb-1">{exp.token}</code>
                      <span className="text-slate-400 text-xs">{exp.desc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-slate-500 text-sm">No explanations available.</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
