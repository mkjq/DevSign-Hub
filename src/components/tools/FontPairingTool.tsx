"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";

const GOOGLE_FONTS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", 
  "Oswald", "Merriweather", "Playfair Display", "Lora", "PT Serif",
  "Fira Code", "Space Grotesk", "Quicksand", "Nunito"
];

export function FontPairingTool() {
  const [headingFont, setHeadingFont] = useState("Playfair Display");
  const [bodyFont, setBodyFont] = useState("Inter");
  
  const [headingText, setHeadingText] = useState("The Quick Brown Fox Jumps Over the Lazy Dog");
  const [bodyText, setBodyText] = useState("Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, and adjusting the space between pairs of letters.");

  useEffect(() => {
    // Inject Google Fonts link
    const linkId = "font-pairing-fonts";
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    const formattedHeading = headingFont.replace(/ /g, "+");
    const formattedBody = bodyFont.replace(/ /g, "+");
    
    link.href = `https://fonts.googleapis.com/css2?family=${formattedHeading}:wght@400;700&family=${formattedBody}:wght@400;500&display=swap`;
    
  }, [headingFont, bodyFont]);

  return (
    <ToolLayout 
      title="Font Pairing Assistant" 
      description="Preview combinations of Google Fonts for headings and body text."
      isPremiumOnly={false}
    >
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* Controls */}
        <div className="w-full lg:w-72 flex flex-col gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Heading Font</label>
            <select 
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary"
            >
              {GOOGLE_FONTS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Body Font</label>
            <select 
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-primary"
            >
              {GOOGLE_FONTS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col gap-6 bg-white p-8 md:p-12 rounded-xl shadow-2xl relative min-h-[500px]">
          
          <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full border border-slate-200">
            Previewing: <span className="font-bold text-slate-700">{headingFont}</span> + <span className="font-bold text-slate-700">{bodyFont}</span>
          </div>

          <input 
            type="text"
            value={headingText}
            onChange={(e) => setHeadingText(e.target.value)}
            style={{ fontFamily: `"${headingFont}", sans-serif` }}
            className="text-4xl md:text-6xl font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded -ml-2 p-2 w-full mt-8"
          />

          <textarea 
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            style={{ fontFamily: `"${bodyFont}", sans-serif` }}
            className="text-lg md:text-xl text-slate-700 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded -ml-2 p-2 w-full min-h-[200px] leading-relaxed resize-none"
          />

        </div>

      </div>
    </ToolLayout>
  );
}
