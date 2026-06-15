"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Copy, Check, Lock, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ShadowLayer {
  id: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  opacity: number;
}

export function ShadowBuilderTool() {
  const { isPremium, toggleMockPremium } = useAuth();
  
  const defaultShadow: ShadowLayer = { id: Date.now(), x: 0, y: 10, blur: 15, spread: -3, opacity: 10 };
  const [layers, setLayers] = useState<ShadowLayer[]>([defaultShadow]);
  const [bgColor, setBgColor] = useState("#f8fafc");
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const addLayer = () => {
    if (!isPremium && layers.length >= 1) return;
    if (layers.length >= 6) return;
    setLayers([...layers, { id: Date.now(), x: 0, y: 50, blur: 100, spread: -20, opacity: 25 }]);
  };

  const removeLayer = (id: number) => {
    if (layers.length <= 1) return;
    setLayers(layers.filter(l => l.id !== id));
  };

  const updateLayer = (id: number, key: keyof ShadowLayer, value: number) => {
    setLayers(layers.map(l => l.id === id ? { ...l, [key]: value } : l));
  };

  const getShadowCss = () => {
    const shadowString = layers.map(l => 
      `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px rgba(0,0,0,${(l.opacity / 100).toFixed(2)})`
    ).join(',\n  ');
    return `box-shadow:\n  ${shadowString};`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShadowCss());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout 
      title="Advanced Multi-Layer Shadow Builder" 
      description="Stack multiple smooth box-shadow layers for highly realistic depth."
      isPremiumOnly={false}
    >
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* Controls */}
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="flex justify-between items-center px-2">
            <h3 className="font-medium text-slate-300">Shadow Layers ({layers.length})</h3>
            <button 
              onClick={addLayer}
              disabled={(!isPremium && layers.length >= 1) || layers.length >= 6}
              className="flex items-center gap-1 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded disabled:opacity-50 transition-colors"
            >
              <Plus size={14} /> Add Layer
            </button>
          </div>

          {!isPremium && (
            <div className="flex items-center justify-between p-3 bg-premium/10 border border-premium/20 rounded-lg">
              <div className="flex items-center gap-2 text-premium text-sm font-medium">
                <Lock size={16} /> Free tier limited to 1 layer.
              </div>
              <button onClick={toggleMockPremium} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors">
                Unlock PRO (Smooth Shadows)
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {layers.map((layer, idx) => (
              <div key={layer.id} className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex flex-col gap-4 relative">
                <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                  <span className="text-sm font-medium text-slate-400">Layer {idx + 1}</span>
                  {layers.length > 1 && (
                    <button onClick={() => removeLayer(layer.id)} className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-400"><label>X Offset</label><span>{layer.x}px</span></div>
                    <input type="range" min="-100" max="100" value={layer.x} onChange={(e) => updateLayer(layer.id, 'x', parseInt(e.target.value))} className="accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-400"><label>Y Offset</label><span>{layer.y}px</span></div>
                    <input type="range" min="-100" max="100" value={layer.y} onChange={(e) => updateLayer(layer.id, 'y', parseInt(e.target.value))} className="accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-400"><label>Blur</label><span>{layer.blur}px</span></div>
                    <input type="range" min="0" max="150" value={layer.blur} onChange={(e) => updateLayer(layer.id, 'blur', parseInt(e.target.value))} className="accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-400"><label>Spread</label><span>{layer.spread}px</span></div>
                    <input type="range" min="-50" max="50" value={layer.spread} onChange={(e) => updateLayer(layer.id, 'spread', parseInt(e.target.value))} className="accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <div className="flex justify-between text-xs text-slate-400"><label>Opacity</label><span>{layer.opacity}%</span></div>
                    <input type="range" min="0" max="100" value={layer.opacity} onChange={(e) => updateLayer(layer.id, 'opacity', parseInt(e.target.value))} className="accent-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Preview & Output */}
        <div className="flex-[1.5] flex flex-col gap-6">
          
          <div className="flex gap-4 mb-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Canvas</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Box</label>
              <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
            </div>
          </div>

          <div 
            className="w-full h-[400px] rounded-xl flex items-center justify-center transition-colors duration-300 border border-slate-700/50"
            style={{ backgroundColor: bgColor }}
          >
            <div 
              className="w-48 h-48 rounded-2xl transition-all duration-300"
              style={{
                backgroundColor: boxColor,
                boxShadow: layers.map(l => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px rgba(0,0,0,${l.opacity/100})`).join(', ')
              }}
            />
          </div>

          <div className="relative group">
            <div className="absolute right-3 top-3">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded transition-colors border border-slate-700"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />} 
                {copied ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="w-full bg-slate-900 border border-slate-700 rounded-lg p-5 pt-10 text-sm font-mono text-primary overflow-x-auto whitespace-pre-wrap">
              <code>{getShadowCss()}</code>
            </pre>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}
