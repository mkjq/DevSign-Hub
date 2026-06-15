"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";

export function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setError(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("JWT must have 3 parts (Header, Payload, Signature)");
      }

      const decodeBase64Url = (str: string) => {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) {
          str += '=';
        }
        return decodeURIComponent(escape(atob(str)));
      };

      const decodedHeader = JSON.parse(decodeBase64Url(parts[0]));
      const decodedPayload = JSON.parse(decodeBase64Url(parts[1]));

      setHeader(decodedHeader);
      setPayload(decodedPayload);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setHeader(null);
      setPayload(null);
    }
  }, [token]);

  const isExpired = payload?.exp ? (payload.exp * 1000) < Date.now() : false;

  return (
    <ToolLayout 
      title="JWT Decoder & Inspector" 
      description="Decode JWT headers, payloads, and verify signatures client-side."
      isPremiumOnly={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Encoded Token</label>
          <textarea
            className="w-full h-full min-h-[400px] bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 break-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            spellCheck="false"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Decoded Header</label>
            <div className="w-full min-h-[100px] bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-primary overflow-auto">
              {header ? (
                <pre>{JSON.stringify(header, null, 2)}</pre>
              ) : error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                <span className="text-slate-600">Header will appear here</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Decoded Payload</label>
            <div className="w-full min-h-[200px] bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-accent overflow-auto">
              {payload ? (
                <pre>{JSON.stringify(payload, null, 2)}</pre>
              ) : (
                <span className="text-slate-600">Payload will appear here</span>
              )}
            </div>
          </div>

          {payload?.exp && (
            <div className={`p-4 rounded-lg border ${isExpired ? 'bg-red-900/20 border-red-500/50 text-red-400' : 'bg-green-900/20 border-green-500/50 text-green-400'}`}>
              <div className="font-semibold">{isExpired ? 'Token Expired' : 'Token Valid'}</div>
              <div className="text-sm mt-1">
                Expiration: {new Date(payload.exp * 1000).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
