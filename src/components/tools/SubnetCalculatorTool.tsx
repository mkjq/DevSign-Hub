"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Network, Server, Globe, Monitor } from "lucide-react";

export function SubnetCalculatorTool() {
  const [ipAddress, setIpAddress] = useState("192.168.1.1");
  const [cidr, setCidr] = useState(24);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateSubnet = () => {
    try {
      setError(null);
      
      const ipParts = ipAddress.split('.').map(Number);
      if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
        throw new Error("Invalid IPv4 Address format.");
      }
      
      if (cidr < 0 || cidr > 32) {
        throw new Error("CIDR must be between 0 and 32.");
      }

      // Convert IP to 32-bit integer
      const ipInt = ((ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]) >>> 0;
      
      // Calculate Mask
      const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
      const maskParts = [
        (maskInt >>> 24) & 255,
        (maskInt >>> 16) & 255,
        (maskInt >>> 8) & 255,
        maskInt & 255
      ];
      
      // Network Address (IP AND Mask)
      const networkInt = (ipInt & maskInt) >>> 0;
      const networkParts = [
        (networkInt >>> 24) & 255,
        (networkInt >>> 16) & 255,
        (networkInt >>> 8) & 255,
        networkInt & 255
      ];

      // Broadcast Address (Network OR ~Mask)
      const broadcastInt = (networkInt | (~maskInt)) >>> 0;
      const broadcastParts = [
        (broadcastInt >>> 24) & 255,
        (broadcastInt >>> 16) & 255,
        (broadcastInt >>> 8) & 255,
        broadcastInt & 255
      ];

      // Host Range
      const firstHostInt = networkInt + 1;
      const lastHostInt = broadcastInt - 1;

      const firstHostParts = [
        (firstHostInt >>> 24) & 255,
        (firstHostInt >>> 16) & 255,
        (firstHostInt >>> 8) & 255,
        firstHostInt & 255
      ];

      const lastHostParts = [
        (lastHostInt >>> 24) & 255,
        (lastHostInt >>> 16) & 255,
        (lastHostInt >>> 8) & 255,
        lastHostInt & 255
      ];

      const totalHosts = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.pow(2, 32 - cidr);
      const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

      setResults({
        mask: maskParts.join('.'),
        network: networkParts.join('.'),
        broadcast: broadcastParts.join('.'),
        firstHost: firstHostParts.join('.'),
        lastHost: lastHostParts.join('.'),
        totalHosts: totalHosts.toLocaleString(),
        usableHosts: usableHosts.toLocaleString(),
        ipClass: ipParts[0] < 128 ? 'A' : ipParts[0] < 192 ? 'B' : ipParts[0] < 224 ? 'C' : ipParts[0] < 240 ? 'D' : 'E'
      });

    } catch (e: any) {
      setError(e.message);
      setResults(null);
    }
  };

  useEffect(() => {
    if (ipAddress) {
      calculateSubnet();
    }
  }, [ipAddress, cidr]);

  return (
    <ToolLayout 
      title="Subnet & IP CIDR Calculator" 
      description="Instantly calculate network addresses, broadcast ranges, and usable hosts."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        
        {/* Input Area */}
        <div className="grid md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">IPv4 Address</label>
            <input 
              type="text" 
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-primary transition-colors font-mono"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-300">CIDR Notation (/{cidr})</label>
              <span className="text-xs text-slate-500">Subnet Bits</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <input 
                type="range" 
                min="0" 
                max="32" 
                value={cidr}
                onChange={(e) => setCidr(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-slate-800 rounded-full appearance-none"
              />
              <input 
                type="number"
                min="0"
                max="32"
                value={cidr}
                onChange={(e) => setCidr(parseInt(e.target.value))}
                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Results Area */}
        {results && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Network size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Subnet Mask</span>
              </div>
              <span className="text-xl font-mono text-white">{results.mask}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-16 h-16 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Server size={16} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Network Address</span>
              </div>
              <span className="text-xl font-mono text-primary">{results.network}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Globe size={16} className="text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Broadcast Address</span>
              </div>
              <span className="text-xl font-mono text-purple-400">{results.broadcast}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Monitor size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Usable Hosts</span>
              </div>
              <span className="text-xl font-mono text-white">{results.usableHosts} <span className="text-sm text-slate-500 font-sans font-normal">/ {results.totalHosts} total</span></span>
            </div>
          </div>
        )}

        {/* Detailed Range */}
        {results && results.usableHosts !== "0" && (
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col text-center md:text-left">
              <span className="text-sm text-slate-500 font-medium">Usable Host Range</span>
              <div className="flex items-center gap-3 mt-1 text-lg font-mono text-slate-300">
                <span>{results.firstHost}</span>
                <span className="text-slate-600">→</span>
                <span>{results.lastHost}</span>
              </div>
            </div>
            <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 flex flex-col items-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider">IP Class</span>
              <span className="text-lg font-bold text-slate-200">Class {results.ipClass}</span>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
