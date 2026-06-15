"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Upload, Download, Loader2, Package } from "lucide-react";
import JSZip from "jszip";

export function IconPackerTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const iconSizes = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "android-chrome-192x192.png", size: 192 },
    { name: "android-chrome-512x512.png", size: 512 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageSrc(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateIcons = async () => {
    if (!imageSrc) return;
    setLoading(true);

    const zip = new JSZip();
    
    await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        iconSizes.forEach(icon => {
          canvas.width = icon.size;
          canvas.height = icon.size;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, icon.size, icon.size);
          
          const dataUrl = canvas.toDataURL('image/png');
          const base64Data = dataUrl.split(',')[1];
          zip.file(icon.name, base64Data, { base64: true });
        });

        resolve(null);
      };
      img.src = imageSrc;
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "devsign-icons.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setLoading(false);
  };

  return (
    <ToolLayout 
      title="Favicon & Icon Packer" 
      description="Upload a master image to generate standard multi-platform web icons."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        {!imageSrc ? (
          <div 
            className="border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden" 
            />
            <div className="p-4 bg-slate-800 rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors text-slate-400">
              <Package size={40} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-slate-200">Upload Master Icon (1024x1024 recommended)</h3>
              <p className="text-sm text-slate-500 mt-2">Supports JPG, PNG, WEBP</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 bg-slate-900/50 border border-slate-700/50 rounded-xl p-8">
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-medium text-slate-300">Master Image Loaded</h3>
              <div className="w-48 h-48 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <img src={imageSrc} alt="Master Icon" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {iconSizes.map(i => (
                <span key={i.name} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-full">
                  {i.name} ({i.size}x{i.size})
                </span>
              ))}
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setImageSrc(null)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={generateIcons}
                disabled={loading}
                className="flex-[2] sm:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)] disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                Generate & Download ZIP
              </button>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
