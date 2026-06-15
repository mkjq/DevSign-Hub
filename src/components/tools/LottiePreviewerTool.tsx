"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Upload, Play, Pause, RotateCcw, Box } from "lucide-react";
import dynamic from 'next/dynamic';

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player as any), {
  ssr: false,
});

export function LottiePreviewerTool() {
  const [lottieData, setLottieData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Player controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const playerRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string);
          setLottieData(json);
          setIsPlaying(true);
        } catch (err) {
          alert("Invalid Lottie JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    if (!playerRef.current) return;
    playerRef.current.setSeeker(0);
    playerRef.current.play();
    setIsPlaying(true);
  };

  return (
    <ToolLayout 
      title="Lottie Animation Previewer" 
      description="Inspect and playback local Lottie JSON animations."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        {!lottieData ? (
          <div 
            className="border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/json"
              className="hidden" 
            />
            <div className="p-4 bg-slate-800 rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors text-slate-400">
              <Box size={40} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-slate-200">Upload Lottie JSON</h3>
              <p className="text-sm text-slate-500 mt-2">Drop your .json animation file here</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 bg-slate-900/50 border border-slate-700/50 rounded-xl p-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex flex-col">
                <span className="text-lg font-medium text-slate-200">{fileName}</span>
                <span className="text-sm text-slate-500">v{lottieData?.v || 'Unknown'} | {lottieData?.fr} fps | {lottieData?.op - lottieData?.ip} frames</span>
              </div>
              <button 
                onClick={() => setLottieData(null)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <Upload size={14} /> Upload New
              </button>
            </div>

            <div className="w-full h-80 bg-slate-950 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-800">
              {/* Checkerboard background for transparency visibility */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(135deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(135deg, transparent 75%, #fff 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 10px 0, 10px -10px, 0px 10px"
                }}
              />
              <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
                {React.createElement(Player as any, {
                  ref: playerRef,
                  autoplay: true,
                  loop: true,
                  src: lottieData,
                  style: { height: '100%', width: '100%' },
                  speed: speed
                })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 bg-slate-900 p-4 rounded-lg border border-slate-800">
              <button onClick={resetAnimation} className="p-3 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
                <RotateCcw size={18} />
              </button>
              
              <button onClick={togglePlay} className="p-4 bg-primary text-slate-900 hover:bg-primary/90 rounded-full transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>

              <div className="flex flex-col items-center gap-1 min-w-[100px]">
                <label className="text-xs text-slate-500 uppercase">Speed: {speed}x</label>
                <input 
                  type="range" 
                  min="0.25" 
                  max="3" 
                  step="0.25" 
                  value={speed} 
                  onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                  className="w-full accent-primary h-1 bg-slate-800 rounded-full appearance-none" 
                />
              </div>
            </div>

          </div>
        )}

      </div>
    </ToolLayout>
  );
}
