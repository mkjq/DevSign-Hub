import React from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

type Tool = { id: string, title: string, desc: string, cat: string, premium?: boolean };
const tools: Tool[] = [
  {
    "id": "nfc-parser",
    "title": "NFC Payload Parser",
    "desc": "Decode raw NDEF records into readable payloads.",
    "cat": "security"
  },
  {
    "id": "hash-generator",
    "title": "Cryptographic Hash Generator",
    "desc": "Compute secure message digests using MD5, SHA.",
    "cat": "security"
  },
  {
    "id": "password-generator",
    "title": "Secure Password Generator",
    "desc": "Generate uncrackable passwords using entropy rules.",
    "cat": "security"
  },
  {
    "id": "yaml-json",
    "title": "YAML to JSON Converter",
    "desc": "Seamless schema conversion preserving key nested structures.",
    "cat": "security"
  },
  {
    "id": "ascii-art",
    "title": "ASCII Art Generator",
    "desc": "Convert string headers into stylized ASCII text blocks.",
    "cat": "security"
  }
];

export default function CategoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold font-space-grotesk text-white mb-2 capitalize">{ `security Tools` }</h1>
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
