"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Upload, Download, Loader2, Lock, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import JSZip from "jszip";

export function ImageConverterTool() {
  const { isPremium, toggleMockPremium } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const limit = isPremium ? 50 : 1;
      setFiles(selected.slice(0, limit));
    }
  };

  const processImages = async () => {
    if (files.length === 0) return;
    setLoading(true);

    const zip = new JSZip();
    let processedCount = 0;

    for (const file of files) {
      const imgURL = await convertToWebP(file);
      if (imgURL) {
        // extract base64 data
        const data = imgURL.split(',')[1];
        const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
        if (files.length === 1 && !isPremium) {
          // single download
          downloadFile(imgURL, newName);
        } else {
          // add to zip
          zip.file(newName, data, { base64: true });
        }
      }
      processedCount++;
    }

    if ((files.length > 1 || isPremium) && processedCount > 0) {
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      downloadFile(url, "devsign-hub-images.zip");
      URL.revokeObjectURL(url);
    }

    setLoading(false);
  };

  const convertToWebP = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/webp', 0.8)); // 80% quality
          } else {
            resolve(null);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolLayout 
      title="Image to WebP Converter" 
      description="Compress and convert images to WebP via client-side canvas."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        <div 
          className="border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
            multiple={isPremium}
            className="hidden" 
          />
          <div className="p-4 bg-slate-800 rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors text-slate-400">
            <Upload size={32} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-200">Click to upload images</h3>
            <p className="text-sm text-slate-500 mt-1">Supports PNG, JPG, JPEG</p>
          </div>
        </div>

        {!isPremium && (
          <div className="flex items-center justify-between p-3 bg-premium/10 border border-premium/20 rounded-lg">
            <div className="flex items-center gap-2 text-premium text-sm font-medium">
              <Lock size={16} /> Free tier limited to 1 image. Unlock Bulk ZIP processing.
            </div>
            <button onClick={toggleMockPremium} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors">
              Unlock PRO (Up to 50)
            </button>
          </div>
        )}

        {files.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">Selected Files ({files.length})</h4>
              <button 
                onClick={processImages}
                disabled={loading}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-6 py-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)] disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                Convert & Download
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-lg p-3">
                  <div className="text-slate-500">
                    <ImageIcon size={20} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-slate-300 truncate">{f.name}</span>
                    <span className="text-xs text-slate-500">{(f.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
