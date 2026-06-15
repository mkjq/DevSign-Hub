"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Cpu, Terminal, AlertCircle } from "lucide-react";

export function NfcParserTool() {
  const [hexInput, setHexInput] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // A very basic parser for educational/utility purposes.
  // Real NDEF parsing is complex, this parses simple Text and URI records based on standard NDEF structure.
  const parseNDEF = (hex: string) => {
    try {
      setError(null);
      setParsedData(null);
      
      const cleanHex = hex.replace(/\s/g, '').toUpperCase();
      if (!cleanHex || cleanHex.length % 2 !== 0) throw new Error("Invalid Hex string length.");
      
      const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      
      if (bytes.length < 3) throw new Error("Data too short to be NDEF.");

      let offset = 0;
      const records = [];

      while (offset < bytes.length) {
        const header = bytes[offset++];
        const tnf = header & 0x07;
        const sr = (header & 0x10) !== 0;
        const il = (header & 0x08) !== 0;

        const typeLen = bytes[offset++];
        const payloadLen = sr ? bytes[offset++] : (bytes[offset++] << 24 | bytes[offset++] << 16 | bytes[offset++] << 8 | bytes[offset++]);
        const idLen = il ? bytes[offset++] : 0;

        const typeBytes = bytes.slice(offset, offset + typeLen);
        const typeStr = new TextDecoder().decode(typeBytes);
        offset += typeLen;

        offset += idLen; // skip id

        const payloadBytes = bytes.slice(offset, offset + payloadLen);
        offset += payloadLen;

        let decodedPayload = "";
        
        if (tnf === 0x01) { // Well-Known Record
          if (typeStr === "T") { // Text
            const statusByte = payloadBytes[0];
            const langLen = statusByte & 0x3F;
            const textBytes = payloadBytes.slice(1 + langLen);
            decodedPayload = new TextDecoder().decode(textBytes);
          } else if (typeStr === "U") { // URI
            const uriPrefixes = [
              "", "http://www.", "https://www.", "http://", "https://", "tel:", "mailto:", 
              "ftp://anonymous:anonymous@", "ftp://ftp.", "ftps://", "sftp://", "smb://", 
              "nfs://", "ftp://", "dav://", "news:", "telnet://", "imap:", "rtsp://", "urn:", 
              "pop:", "sip:", "sips:", "tftp:", "btspp://", "btl2cap://", "btgoep://", 
              "tcpobex://", "irdaobex://", "file://", "urn:epc:id:", "urn:epc:tag:", 
              "urn:epc:pat:", "urn:epc:raw:", "urn:epc:", "urn:nfc:"
            ];
            const prefixCode = payloadBytes[0];
            const prefix = uriPrefixes[prefixCode] || "";
            const uriBytes = payloadBytes.slice(1);
            decodedPayload = prefix + new TextDecoder().decode(uriBytes);
          } else {
            decodedPayload = `Unsupported Well-Known Type (${typeStr})`;
          }
        } else {
          decodedPayload = `Unsupported TNF (${tnf})`;
        }

        records.push({ tnf, type: typeStr, payload: decodedPayload, rawLength: payloadLen });
      }

      setParsedData(records);
    } catch (e: any) {
      setError(e.message || "Failed to parse NDEF data.");
    }
  };

  const loadExample = (type: 'text' | 'uri') => {
    // Standard NDEF hex examples
    if (type === 'text') {
      setHexInput("D1 01 0B 54 02 65 6E 48 65 6C 6C 6F 20 57 6F 72 6C 64"); // "Hello World" in en
    } else {
      setHexInput("D1 01 0E 55 03 67 6F 6F 67 6C 65 2E 63 6F 6D"); // "https://google.com"
    }
  };

  return (
    <ToolLayout 
      title="NFC Payload Parser" 
      description="Decode raw NDEF hex streams into human-readable data."
      isPremiumOnly={false}
    >
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* Input area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Cpu size={16} /> Raw NDEF Hex Stream
            </label>
            <div className="flex gap-2">
              <button onClick={() => loadExample('text')} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded transition-colors">Example (Text)</button>
              <button onClick={() => loadExample('uri')} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded transition-colors">Example (URI)</button>
            </div>
          </div>
          
          <textarea
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="e.g. D1 01 0E 55 03 67 6F 6F 67 6C 65 2E 63 6F 6D"
            className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-primary font-mono text-sm focus:outline-none focus:border-primary resize-none custom-scrollbar uppercase"
          />

          <button 
            onClick={() => parseNDEF(hexInput)}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-4 py-3 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)]"
          >
            <Terminal size={18} /> Parse NDEF Bytes
          </button>
        </div>

        {/* Output area */}
        <div className="flex-1 flex flex-col gap-4">
          <label className="text-sm font-medium text-slate-300">Decoded Payload</label>
          
          <div className="w-full min-h-[300px] bg-slate-900/80 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
            {!parsedData && !error && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col gap-2">
                <Cpu size={32} />
                <p>Awaiting Hex Stream</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {parsedData && (
              <div className="flex flex-col gap-4">
                <div className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full inline-flex w-fit">
                  Valid NDEF Message
                </div>
                
                {parsedData.map((record: any, idx: number) => (
                  <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700/50">
                      <span className="text-sm font-medium text-slate-300">Record {idx + 1}</span>
                      <div className="flex gap-2 text-xs font-mono">
                        <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-400">TNF: {record.tnf}</span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded text-primary">Type: {record.type}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">Payload Content</span>
                      <p className="text-lg font-mono text-white break-all">
                        {record.payload}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
