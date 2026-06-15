"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check, Play, AlertTriangle } from "lucide-react";

export function SqlFormatterTool() {
  const [inputSql, setInputSql] = useState("");
  const [outputSql, setOutputSql] = useState("");
  const [lintErrors, setLintErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const formatSql = () => {
    let sql = inputSql;
    const errors: string[] = [];

    // Basic SQL Linter
    const openParens = (sql.match(/\(/g) || []).length;
    const closeParens = (sql.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`Mismatched parentheses: ${openParens} open, ${closeParens} closed.`);
    }

    if (sql.match(/,\s*(FROM|WHERE)/i)) {
      errors.push("Trailing comma detected before FROM or WHERE clause.");
    }
    
    setLintErrors(errors);

    // Basic SQL Formatter
    const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'LIMIT', 'OFFSET', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'];
    
    // Normalize spaces
    sql = sql.replace(/\s+/g, ' ');

    // Add newlines before keywords
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
      sql = sql.replace(regex, `\n$1`);
    });

    // Add indentations
    let formatted = '';
    let indent = 0;
    const lines = sql.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.match(/^\)/)) {
        indent = Math.max(0, indent - 1);
      }

      formatted += '  '.repeat(indent) + trimmed + '\n';

      if (trimmed.match(/\($/)) {
        indent++;
      }
    });

    // Final cleanup for AND / OR
    formatted = formatted.replace(/\b(AND|OR)\b/gi, '\n  $1');

    setOutputSql(formatted.trim());
  };

  const copyToClipboard = () => {
    if (!outputSql) return;
    navigator.clipboard.writeText(outputSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="SQL Query Formatter & Linter" 
      description="Format messy SQL into structured syntax and catch common syntax errors."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6">
        
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <button 
            onClick={formatSql}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)]"
          >
            <Play size={16} fill="currentColor" /> Format Query
          </button>
        </div>

        {lintErrors.length > 0 && (
          <div className="flex flex-col gap-2 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <AlertTriangle size={18} /> Linter Warnings ({lintErrors.length})
            </div>
            <ul className="list-disc list-inside text-sm text-red-300 ml-1">
              {lintErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-slate-300">Raw SQL</span>
            </div>
            <textarea
              className="w-full h-[500px] bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="SELECT id, name, email FROM users WHERE status = 'active' ORDER BY created_at DESC"
              value={inputSql}
              onChange={(e) => setInputSql(e.target.value)}
              spellCheck="false"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-slate-300">Formatted SQL</span>
              <button 
                onClick={copyToClipboard} 
                disabled={!outputSql}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={12}/> : <Copy size={12}/>} {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full h-[500px] bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-primary focus:outline-none resize-none"
              placeholder="Formatted output..."
              value={outputSql}
            />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
