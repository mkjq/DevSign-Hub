"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";

export function DiffCheckerTool() {
  const [originalText, setOriginalText] = useState("function sum(a, b) {\n  return a + b;\n}\n\nconsole.log(sum(1, 2));");
  const [modifiedText, setModifiedText] = useState("function sum(a, b) {\n  // Returns the sum\n  return a + b;\n}\n\nconsole.log(sum(5, 5));");
  
  const [diffLines, setDiffLines] = useState<{ type: "added" | "removed" | "unchanged"; text: string }[]>([]);

  useEffect(() => {
    // Simple line-by-line diff algorithm
    const origLines = originalText.split("\n");
    const modLines = modifiedText.split("\n");
    
    const diff: { type: "added" | "removed" | "unchanged"; text: string }[] = [];
    
    let origIdx = 0;
    let modIdx = 0;

    // Very naive diff logic for demo purposes (real diffs use Myers' diff algorithm)
    while (origIdx < origLines.length || modIdx < modLines.length) {
      if (origIdx < origLines.length && modIdx < modLines.length && origLines[origIdx] === modLines[modIdx]) {
        diff.push({ type: "unchanged", text: origLines[origIdx] });
        origIdx++;
        modIdx++;
      } else {
        // Look ahead in modified
        let foundInMod = -1;
        for (let i = modIdx + 1; i < Math.min(modIdx + 10, modLines.length); i++) {
          if (origIdx < origLines.length && origLines[origIdx] === modLines[i]) {
            foundInMod = i;
            break;
          }
        }

        // Look ahead in original
        let foundInOrig = -1;
        for (let i = origIdx + 1; i < Math.min(origIdx + 10, origLines.length); i++) {
          if (modIdx < modLines.length && origLines[i] === modLines[modIdx]) {
            foundInOrig = i;
            break;
          }
        }

        if (foundInMod !== -1 && (foundInOrig === -1 || (foundInMod - modIdx) < (foundInOrig - origIdx))) {
          // Lines were added in modified
          for (let i = modIdx; i < foundInMod; i++) {
            diff.push({ type: "added", text: modLines[i] });
          }
          modIdx = foundInMod;
        } else if (foundInOrig !== -1) {
          // Lines were removed from original
          for (let i = origIdx; i < foundInOrig; i++) {
            diff.push({ type: "removed", text: origLines[i] });
          }
          origIdx = foundInOrig;
        } else {
          // Both changed or no match found within horizon
          if (origIdx < origLines.length) {
            diff.push({ type: "removed", text: origLines[origIdx] });
            origIdx++;
          }
          if (modIdx < modLines.length) {
            diff.push({ type: "added", text: modLines[modIdx] });
            modIdx++;
          }
        }
      }
    }

    setDiffLines(diff);
  }, [originalText, modifiedText]);

  return (
    <ToolLayout 
      title="Code Diff Checker" 
      description="Compare two code snippets to highlight differences instantly."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Original Text</label>
            <textarea
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="Original code..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              spellCheck="false"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Modified Text</label>
            <textarea
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="Modified code..."
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              spellCheck="false"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-medium text-slate-300">Difference View</label>
          <div className="w-full min-h-[400px] bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-auto font-mono text-sm leading-relaxed">
            {diffLines.length === 0 ? (
              <div className="text-slate-500 italic">No differences found or input is empty.</div>
            ) : (
              diffLines.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`flex w-full whitespace-pre ${
                    line.type === 'added' ? 'bg-green-900/30 text-green-300' : 
                    line.type === 'removed' ? 'bg-red-900/30 text-red-300' : 
                    'text-slate-400'
                  }`}
                >
                  <span className={`select-none inline-block w-8 text-center border-r border-slate-700/50 mr-4 ${
                    line.type === 'added' ? 'text-green-500' : 
                    line.type === 'removed' ? 'text-red-500' : 
                    'text-slate-600'
                  }`}>
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  <span>{line.text || ' '}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
