import fs from 'fs';
import path from 'path';

const tools = [
  // Category A
  { id: 'json-formatter', title: 'JSON Formatter & Validator', desc: 'Pretty-print, validate, and minify JSON strings.', cat: 'core' },
  { id: 'jwt-decoder', title: 'JWT Decoder & Inspector', desc: 'Decode JWT headers, payloads, and verify signatures.', cat: 'core' },
  { id: 'code-converter', title: 'Universal Code Converter', desc: 'Transform code syntaxes dynamically.', cat: 'core', premium: true },
  { id: 'regex-tester', title: 'Regex Tester & AI Explainer', desc: 'Test regular expressions with real-time matching.', cat: 'core' },
  { id: 'base64-converter', title: 'Base64 Text & File Converter', desc: 'Encode/Decode strings and raw files to/from Base64.', cat: 'core' },
  { id: 'crontab-generator', title: 'Crontab Expression Generator', desc: 'Visual builder that outputs crontab syntax.', cat: 'core' },
  { id: 'code-minifier', title: 'HTML/CSS/JS Minifier', desc: 'Compress web source code or format it cleanly.', cat: 'core' },
  { id: 'sql-formatter', title: 'SQL Query Formatter', desc: 'Format raw SQL queries for readability.', cat: 'core' },
  { id: 'markdown-editor', title: 'Markdown Live Editor', desc: 'Real-time split view Markdown editor.', cat: 'core' },
  { id: 'url-encoder', title: 'URL Encoder/Decoder', desc: 'Safely encode or decode URL components.', cat: 'core' },
  { id: 'diff-checker', title: 'Code Diff Checker', desc: 'Side-by-side code comparison.', cat: 'core' },
  { id: 'uuid-generator', title: 'UUID/GUID v4 Generator', desc: 'Generate unique secure UUIDs in bulk.', cat: 'core', premium: true },
  { id: 'string-converter', title: 'String Case Converter', desc: 'Cycle text between camelCase, snake_case, etc.', cat: 'core' },
  { id: 'epoch-converter', title: 'Epoch Timestamp Converter', desc: 'Convert Unix timestamps to human-readable dates.', cat: 'core' },
  { id: 'dns-lookup', title: 'DNS & WHOIS Lookup', desc: 'Fetch public DNS records.', cat: 'core' },

  // Category B
  { id: 'svg-optimizer', title: 'SVG Code Optimizer', desc: 'Clean raw SVG paths and remove metadata bloat.', cat: 'design' },
  { id: 'color-palette', title: 'AI Color Palette Generator', desc: 'Generate accessible color harmony schemes.', cat: 'design' },
  { id: 'image-converter', title: 'Image Formats Converter', desc: 'Convert images to WebP/AVIF.', cat: 'design', premium: true },
  { id: 'contrast-checker', title: 'WCAG Contrast Checker', desc: 'Check foreground and background colors for web accessibility.', cat: 'design' },
  { id: 'css-glassmorphism', title: 'CSS Glassmorphism Builder', desc: 'Generate modern frosted glass effects with pure CSS.', cat: 'design' },
  { id: 'shadow-builder', title: 'Multi-Layer Shadow Builder', desc: 'Stack multiple box-shadow layers visually.', cat: 'design' },
  { id: 'aspect-ratio', title: 'Aspect Ratio Resizer', desc: 'Crop images to custom aspect ratios.', cat: 'design' },
  { id: 'icon-packer', title: 'Multi-Platform Icon Packer', desc: 'Upload 1 image to output a full pack of icons.', cat: 'design', premium: true },
  { id: 'font-pairing', title: 'Font Pairing Assistant', desc: 'Live preview combinations of Google Fonts.', cat: 'design' },
  { id: 'lottie-previewer', title: 'Lottie Animation Previewer', desc: 'Inspect frame rates and playback of JSON micro-animations.', cat: 'design' },

  // Category C
  { id: 'nfc-parser', title: 'NFC Payload Parser', desc: 'Decode raw NDEF records into readable payloads.', cat: 'security' },
  { id: 'hash-generator', title: 'Cryptographic Hash Generator', desc: 'Compute secure message digests using MD5, SHA.', cat: 'security' },
  { id: 'password-generator', title: 'Secure Password Generator', desc: 'Generate uncrackable passwords using entropy rules.', cat: 'security' },
  { id: 'yaml-json', title: 'YAML to JSON Converter', desc: 'Seamless schema conversion preserving key nested structures.', cat: 'security' },
  { id: 'ascii-art', title: 'ASCII Art Generator', desc: 'Convert string headers into stylized ASCII text blocks.', cat: 'security' },
];

const basePath = '/home/ethbaldo/Apps/Toraloma2/src/app/tools';
const componentsPath = '/home/ethbaldo/Apps/Toraloma2/src/components/tools';

fs.mkdirSync(basePath, { recursive: true });
fs.mkdirSync(componentsPath, { recursive: true });

tools.forEach(t => {
  // Create Next.js route
  const routeDir = path.join(basePath, t.id);
  fs.mkdirSync(routeDir, { recursive: true });
  
  const componentName = t.id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'Tool';

  const pageContent = `import { ${componentName} } from "@/components/tools/${componentName}";

export const metadata = {
  title: "${t.title} | DevSign Hub",
  description: "${t.desc}",
};

export default function Page() {
  return <${componentName} />;
}
`;
  fs.writeFileSync(path.join(routeDir, 'page.tsx'), pageContent);

  // Create component
  const componentContent = `"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";

export function ${componentName}() {
  return (
    <ToolLayout 
      title="${t.title}" 
      description="${t.desc}"
      isPremiumOnly={${t.premium ? 'true' : 'false'}}
    >
      <div className="min-h-[400px] flex flex-col">
        {/* Tool Implementation Goes Here */}
        <div className="flex-1 border-2 border-dashed border-slate-700/50 rounded-xl flex items-center justify-center text-slate-500">
          ${t.title} Workspace
        </div>
      </div>
    </ToolLayout>
  );
}
`;
  fs.writeFileSync(path.join(componentsPath, componentName + '.tsx'), componentContent);
});

// Also create category index pages
const categories = ['core', 'design', 'security'];
categories.forEach(cat => {
  const catDir = path.join('/home/ethbaldo/Apps/Toraloma2/src/app/category', cat);
  fs.mkdirSync(catDir, { recursive: true });
  
  const catTools = tools.filter(t => t.cat === cat);
  
  const catPage = `import React from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

const tools = ${JSON.stringify(catTools, null, 2)};

export default function CategoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold font-space-grotesk text-white mb-2 capitalize">{ \`${cat} Tools\` }</h1>
        <p className="text-slate-400">Browse all tools in this category.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t, i) => (
          <Link href={\`/tools/\${t.id}\`} key={i} className="group relative rounded-xl glass-panel p-6 hover:border-primary/50 transition-all duration-300">
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
`;
  fs.writeFileSync(path.join(catDir, 'page.tsx'), catPage);
});

console.log('Scaffolding complete.');
