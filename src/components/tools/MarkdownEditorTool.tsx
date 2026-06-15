"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Download, Lock, FileCode2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { marked } from "marked";

export function MarkdownEditorTool() {
  const { isPremium, toggleMockPremium } = useAuth();
  const [markdown, setMarkdown] = useState("# Hello DevSign Hub\n\nStart typing **markdown** here to see it live render!\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log('Hello world!');\n```");
  const [htmlOutput, setHtmlOutput] = useState("");

  useEffect(() => {
    try {
      const parsed = marked.parse(markdown);
      setHtmlOutput(typeof parsed === "string" ? parsed : "");
    } catch (e) {
      console.error(e);
    }
  }, [markdown]);

  const downloadHtml = () => {
    if (!isPremium) return;
    
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Document</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    code { font-family: monospace; background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
    blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 1rem; color: #666; }
  </style>
</head>
<body>
  ${htmlOutput}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout 
      title="Markdown Live Editor & Exporter" 
      description="Write markdown with real-time HTML preview and export options."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6">
        
        <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400">
            {markdown.length} characters | {markdown.split(/\s+/).filter(w => w.length > 0).length} words
          </div>
          
          <button 
            onClick={downloadHtml}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isPremium ? 'bg-primary text-slate-900 hover:bg-primary/90' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
          >
            {!isPremium && <Lock size={14} />}
            <Download size={16} /> Export to HTML
          </button>
        </div>

        {!isPremium && (
          <div className="flex items-center justify-between p-3 bg-premium/10 border border-premium/20 rounded-lg">
            <div className="flex items-center gap-2 text-premium text-sm font-medium">
              <Lock size={16} /> HTML exporting is a PRO feature.
            </div>
            <button onClick={toggleMockPremium} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors">
              Unlock PRO
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
          <div className="flex flex-col gap-2 h-full">
            <div className="flex items-center px-1">
              <span className="text-sm font-medium text-slate-300">Editor</span>
            </div>
            <textarea
              className="w-full h-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck="false"
            />
          </div>

          <div className="flex flex-col gap-2 h-full">
            <div className="flex items-center px-1">
              <span className="text-sm font-medium text-slate-300">Live Preview</span>
            </div>
            <div 
              className="w-full h-full bg-white text-slate-900 rounded-lg p-6 overflow-auto prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
