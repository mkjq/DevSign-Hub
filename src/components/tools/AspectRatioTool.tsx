"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Upload, Download, Maximize, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AspectRatioTool() {
  const { isPremium, toggleMockPremium } = useAuth();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ w: 0, h: 0 });
  const [ratio, setRatio] = useState<string>("1:1");
  const [outputSrc, setOutputSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ratios = [
    { label: "1:1 (Square)", value: "1:1", w: 1, h: 1 },
    { label: "16:9 (Widescreen)", value: "16:9", w: 16, h: 9 },
    { label: "4:3 (Standard)", value: "4:3", w: 4, h: 3 },
    { label: "9:16 (Story/Reel)", value: "9:16", w: 9, h: 16 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setImageSrc(src);
        
        // get dimensions
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ w: img.width, h: img.height });
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // calculate new dimensions based on ratio
        const selectedRatio = ratios.find(r => r.value === ratio) || ratios[0];
        const ratioValue = selectedRatio.w / selectedRatio.h;
        
        let newW = img.width;
        let newH = img.width / ratioValue;

        if (newH > img.height) {
          newH = img.height;
          newW = img.height * ratioValue;
        }

        canvas.width = newW;
        canvas.height = newH;

        // center crop
        const sx = (img.width - newW) / 2;
        const sy = (img.height - newH) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, newW, newH, 0, 0, newW, newH);
        
        setOutputSrc(canvas.toDataURL('image/png'));
      };
      img.src = imageSrc;
    }
  }, [imageSrc, ratio]);

  const downloadImage = () => {
    if (!outputSrc) return;
    const a = document.createElement("a");
    a.href = outputSrc;
    a.download = `cropped-${ratio.replace(':', 'x')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolLayout 
      title="Aspect Ratio Image Resizer" 
      description="Quickly center-crop images to standard aspect ratios."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        
        {!imageSrc ? (
          <div 
            className="border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" 
            />
            <div className="p-4 bg-slate-800 rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors text-slate-400">
              <Upload size={40} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-slate-200">Upload an Image to Resize</h3>
              <p className="text-sm text-slate-500 mt-2">Supports JPG, PNG, WEBP</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Editor Sidebar */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
              
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-medium text-slate-300 flex items-center gap-2"><Maximize size={16}/> Target Aspect Ratio</h3>
                </div>
                
                <div className="flex flex-col gap-2">
                  {ratios.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setRatio(r.value)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${ratio === r.value ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                  
                  {!isPremium && (
                    <button onClick={toggleMockPremium} className="flex items-center justify-between p-3 rounded-lg border bg-slate-800 border-premium text-premium font-medium hover:bg-slate-700 transition-all mt-2">
                      <span className="flex items-center gap-2"><Lock size={14}/> Custom Ratio</span>
                      <span className="text-xs">PRO</span>
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button 
                    onClick={downloadImage}
                    disabled={!outputSrc}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-4 py-3 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)] disabled:opacity-50"
                  >
                    <Download size={18} /> Download Resized Image
                  </button>
                  <button 
                    onClick={() => setImageSrc(null)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-3 rounded-lg transition-colors"
                  >
                    <Upload size={16} /> Upload New Image
                  </button>
                </div>
              </div>

            </div>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 min-h-[400px] flex items-center justify-center overflow-hidden">
                {/* Hidden canvas for processing */}
                <canvas ref={canvasRef} className="hidden" />
                
                {outputSrc && (
                  <img 
                    src={outputSrc} 
                    alt="Cropped Preview" 
                    className="max-w-full max-h-[500px] object-contain shadow-2xl rounded"
                  />
                )}
              </div>
              
              {canvasRef.current && (
                <div className="text-center text-sm text-slate-500 font-mono">
                  Output Dimensions: {canvasRef.current.width}px x {canvasRef.current.height}px
                  (Original: {imageDimensions.w}px x {imageDimensions.h}px)
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </ToolLayout>
  );
}
