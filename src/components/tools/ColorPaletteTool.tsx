"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check, Download, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function ColorPaletteTool() {
  const { isPremium, toggleMockPremium } = useAuth();
  const [baseColor, setBaseColor] = useState("#00f0ff");
  const [copied, setCopied] = useState<string | null>(null);

  // Helper to convert hex to HSL
  const hexToHSL = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  // Helper to convert HSL to hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generatePalette = (type: "analogous" | "monochromatic" | "triadic") => {
    const [h, s, l] = hexToHSL(baseColor);
    if (type === "analogous") {
      return [
        hslToHex((h - 30 + 360) % 360, s, l),
        hslToHex((h - 15 + 360) % 360, s, l),
        baseColor,
        hslToHex((h + 15) % 360, s, l),
        hslToHex((h + 30) % 360, s, l)
      ];
    } else if (type === "triadic") {
      return [
        hslToHex(h, s, Math.max(0, l - 30)),
        hslToHex((h + 120) % 360, s, l),
        baseColor,
        hslToHex((h + 240) % 360, s, l),
        hslToHex(h, s, Math.min(100, l + 30))
      ];
    } else {
      // monochromatic
      return [
        hslToHex(h, s, Math.max(0, l - 40)),
        hslToHex(h, s, Math.max(0, l - 20)),
        baseColor,
        hslToHex(h, s, Math.min(100, l + 20)),
        hslToHex(h, s, Math.min(100, l + 40))
      ];
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadConfig = () => {
    if (!isPremium) return;
    const colors = generatePalette("analogous"); // For demo, export analogous
    const config = `module.exports = {
  theme: {
    extend: {
      colors: {
        palette: {
          100: '${colors[0]}',
          200: '${colors[1]}',
          300: '${colors[2]}',
          400: '${colors[3]}',
          500: '${colors[4]}',
        }
      }
    }
  }
};`;
    
    const blob = new Blob([config], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tailwind.config.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const palettes = [
    { name: "Analogous", colors: generatePalette("analogous") },
    { name: "Triadic", colors: generatePalette("triadic") },
    { name: "Monochromatic", colors: generatePalette("monochromatic") },
  ];

  return (
    <ToolLayout 
      title="AI Color Palette Generator" 
      description="Create harmonious color schemes based on color theory."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-300">Base Color</label>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-slate-700 shadow-inner overflow-hidden relative cursor-pointer"
                style={{ backgroundColor: baseColor }}
              >
                <input 
                  type="color" 
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="absolute inset-0 w-16 h-16 -top-2 -left-2 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-primary text-lg uppercase tracking-wider">{baseColor}</span>
                <span className="text-xs text-slate-500">Click swatch to pick</span>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button 
              onClick={downloadConfig}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${isPremium ? 'bg-premium hover:bg-premium/90 text-white shadow-[0_0_15px_rgba(157,78,221,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              {!isPremium && <Lock size={16} />}
              <Download size={18} /> Export Tailwind Config
            </button>
            {!isPremium && (
              <button onClick={toggleMockPremium} className="text-xs text-premium hover:text-premium/80 text-center transition-colors">
                Unlock PRO Export
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {palettes.map(palette => (
            <div key={palette.name} className="flex flex-col gap-3">
              <h3 className="text-lg font-medium text-slate-200">{palette.name}</h3>
              <div className="flex w-full h-32 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
                {palette.colors.map((c, i) => (
                  <div 
                    key={i} 
                    className="flex-1 relative group cursor-pointer"
                    style={{ backgroundColor: c }}
                    onClick={() => copyToClipboard(c)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                      <span className="opacity-0 group-hover:opacity-100 font-mono text-white text-sm tracking-wider flex items-center gap-2 transition-opacity">
                        {copied === c ? <Check size={14}/> : <Copy size={14}/>} {c}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </ToolLayout>
  );
}
