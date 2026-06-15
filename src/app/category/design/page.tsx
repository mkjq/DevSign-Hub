import React from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

type Tool = { id: string, title: string, desc: string, cat: string, premium?: boolean };
const tools: Tool[] = [
  {
    "id": "svg-optimizer",
    "title": "SVG Code Optimizer",
    "desc": "Clean raw SVG paths and remove metadata bloat.",
    "cat": "design"
  },
  {
    "id": "color-palette",
    "title": "AI Color Palette Generator",
    "desc": "Generate accessible color harmony schemes.",
    "cat": "design"
  },
  {
    "id": "image-converter",
    "title": "Image Formats Converter",
    "desc": "Convert images to WebP/AVIF.",
    "cat": "design",
    "premium": true
  },
  {
    "id": "contrast-checker",
    "title": "WCAG Contrast Checker",
    "desc": "Check foreground and background colors for web accessibility.",
    "cat": "design"
  },
  {
    "id": "css-glassmorphism",
    "title": "CSS Glassmorphism Builder",
    "desc": "Generate modern frosted glass effects with pure CSS.",
    "cat": "design"
  },
  {
    "id": "shadow-builder",
    "title": "Multi-Layer Shadow Builder",
    "desc": "Stack multiple box-shadow layers visually.",
    "cat": "design"
  },
  {
    "id": "aspect-ratio",
    "title": "Aspect Ratio Resizer",
    "desc": "Crop images to custom aspect ratios.",
    "cat": "design"
  },
  {
    "id": "icon-packer",
    "title": "Multi-Platform Icon Packer",
    "desc": "Upload 1 image to output a full pack of icons.",
    "cat": "design",
    "premium": true
  },
  {
    "id": "font-pairing",
    "title": "Font Pairing Assistant",
    "desc": "Live preview combinations of Google Fonts.",
    "cat": "design"
  },
  {
    "id": "lottie-previewer",
    "title": "Lottie Animation Previewer",
    "desc": "Inspect frame rates and playback of JSON micro-animations.",
    "cat": "design"
  }
];

export default function CategoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold font-space-grotesk text-white mb-2 capitalize">{ `design Tools` }</h1>
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
