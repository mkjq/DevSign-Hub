import React from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

type Tool = { id: string, title: string, desc: string, cat: string, premium?: boolean };
const tools: Tool[] = [
  {
    "id": "json-formatter",
    "title": "JSON Formatter & Validator",
    "desc": "Pretty-print, validate, and minify JSON strings.",
    "cat": "core"
  },
  {
    "id": "jwt-decoder",
    "title": "JWT Decoder & Inspector",
    "desc": "Decode JWT headers, payloads, and verify signatures.",
    "cat": "core"
  },
  {
    "id": "code-converter",
    "title": "Universal Code Converter",
    "desc": "Transform code syntaxes dynamically.",
    "cat": "core",
    "premium": true
  },
  {
    "id": "regex-tester",
    "title": "Regex Tester & AI Explainer",
    "desc": "Test regular expressions with real-time matching.",
    "cat": "core"
  },
  {
    "id": "base64-converter",
    "title": "Base64 Text & File Converter",
    "desc": "Encode/Decode strings and raw files to/from Base64.",
    "cat": "core"
  },
  {
    "id": "crontab-generator",
    "title": "Crontab Expression Generator",
    "desc": "Visual builder that outputs crontab syntax.",
    "cat": "core"
  },
  {
    "id": "code-minifier",
    "title": "HTML/CSS/JS Minifier",
    "desc": "Compress web source code or format it cleanly.",
    "cat": "core"
  },
  {
    "id": "sql-formatter",
    "title": "SQL Query Formatter",
    "desc": "Format raw SQL queries for readability.",
    "cat": "core"
  },
  {
    "id": "markdown-editor",
    "title": "Markdown Live Editor",
    "desc": "Real-time split view Markdown editor.",
    "cat": "core"
  },
  {
    "id": "url-encoder",
    "title": "URL Encoder/Decoder",
    "desc": "Safely encode or decode URL components.",
    "cat": "core"
  },
  {
    "id": "diff-checker",
    "title": "Code Diff Checker",
    "desc": "Side-by-side code comparison.",
    "cat": "core"
  },
  {
    "id": "uuid-generator",
    "title": "UUID/GUID v4 Generator",
    "desc": "Generate unique secure UUIDs in bulk.",
    "cat": "core",
    "premium": true
  },
  {
    "id": "string-converter",
    "title": "String Case Converter",
    "desc": "Cycle text between camelCase, snake_case, etc.",
    "cat": "core"
  },
  {
    "id": "epoch-converter",
    "title": "Epoch Timestamp Converter",
    "desc": "Convert Unix timestamps to human-readable dates.",
    "cat": "core"
  },
  {
    "id": "dns-lookup",
    "title": "DNS & WHOIS Lookup",
    "desc": "Fetch public DNS records.",
    "cat": "core"
  }
];

export default function CategoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold font-space-grotesk text-white mb-2 capitalize">{ `core Tools` }</h1>
        <p className="text-slate-400">Browse all tools in this category.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t, i) => (
          <Link href={`/tools/${t.id}`} key={i} className="group relative rounded-xl glass-panel p-6 hover:border-primary/50 transition-all duration-300">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk flex justify-between items-start">
                {t.title}
                {t.premium && <Lock size={14} className="text-premium mt-1" />}
              </h3>
              <p className="text-sm text-slate-400 mb-6">{t.desc}</p>
              <div className="flex items-center text-primary gap-1 font-medium opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                Open Tool <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
