"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Key, Copy, RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";

export function PasswordGeneratorTool() {
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [strength, setStrength] = useState(0);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) {
      setPassword("Select at least one character type");
      setSalt("");
      setStrength(0);
      return;
    }

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += charset[array[i] % charset.length];
    }
    
    setPassword(generated);

    // Generate Salt (16 bytes, base64)
    const saltArray = new Uint8Array(16);
    window.crypto.getRandomValues(saltArray);
    const saltBase64 = btoa(String.fromCharCode.apply(null, Array.from(saltArray)));
    setSalt(saltBase64);

    // Calculate Entropy
    const poolSize = charset.length;
    const entropy = length * Math.log2(poolSize);
    setStrength(entropy);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStrengthData = () => {
    if (strength === 0) return { label: "Invalid", color: "text-red-500", bg: "bg-red-500", icon: <ShieldAlert size={16} /> };
    if (strength < 40) return { label: "Weak", color: "text-red-500", bg: "bg-red-500", icon: <ShieldAlert size={16} /> };
    if (strength < 60) return { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-400", icon: <ShieldCheck size={16} /> };
    if (strength < 80) return { label: "Strong", color: "text-green-400", bg: "bg-green-400", icon: <ShieldCheck size={16} /> };
    return { label: "Very Strong", color: "text-primary", bg: "bg-primary", icon: <ShieldCheck size={16} /> };
  };

  const strengthData = getStrengthData();

  return (
    <ToolLayout 
      title="Secure Password & Salt Generator" 
      description="Generate high-entropy passwords and cryptographic salts."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        {/* Output Area */}
        <div className="flex flex-col gap-4 bg-slate-900/50 border border-slate-700/50 rounded-xl p-8">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generated Password</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xl text-slate-200 break-all flex items-center shadow-inner">
                {password}
              </div>
              <button 
                onClick={() => handleCopy(password)}
                className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 rounded-lg transition-colors flex items-center justify-center border border-slate-700"
                title="Copy Password"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Random Salt (Base64)</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 font-mono text-sm text-slate-400 break-all flex items-center">
                {salt || "---"}
              </div>
              <button 
                onClick={() => handleCopy(salt)}
                className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 rounded-lg transition-colors flex items-center justify-center border border-slate-700"
                title="Copy Salt"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Controls Area */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
              <Key size={18} className="text-primary" /> Configuration
            </h3>
            <button 
              onClick={generatePassword}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-4 py-2 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)] text-sm"
            >
              <RefreshCw size={16} /> Regenerate
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Length & Strength */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Password Length</label>
                  <span className="bg-slate-800 text-primary px-3 py-1 rounded text-sm font-mono">{length}</span>
                </div>
                <input 
                  type="range" 
                  min="8" 
                  max="128" 
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full accent-primary h-2 bg-slate-800 rounded-full appearance-none"
                />
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col gap-3 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Entropy Strength</span>
                  <span className={`text-sm font-semibold flex items-center gap-1 ${strengthData.color}`}>
                    {strengthData.icon} {strengthData.label}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strengthData.bg} transition-all duration-300`} 
                    style={{ width: `${Math.min((strength / 100) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 font-mono text-right">{strength > 0 ? strength.toFixed(1) : 0} bits</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3 bg-slate-900 border border-slate-800 p-5 rounded-lg">
              <label className="text-sm font-medium text-slate-300 mb-2">Character Sets</label>
              
              {[
                { key: 'uppercase', label: 'Uppercase Letters (A-Z)' },
                { key: 'lowercase', label: 'Lowercase Letters (a-z)' },
                { key: 'numbers', label: 'Numbers (0-9)' },
                { key: 'symbols', label: 'Symbols (!@#$)' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded cursor-pointer transition-colors">
                  <span className="text-sm text-slate-300">{label}</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      name="toggle" 
                      id={key}
                      checked={options[key as keyof typeof options]}
                      onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-600 appearance-none cursor-pointer transition-transform duration-200 checked:translate-x-5 checked:border-primary"
                    />
                    <label htmlFor={key} className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ${options[key as keyof typeof options] ? 'bg-primary/50' : 'bg-slate-700'}`}></label>
                  </div>
                </label>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
