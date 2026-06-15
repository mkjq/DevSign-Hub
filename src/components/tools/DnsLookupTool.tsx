"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Search, Loader2 } from "lucide-react";

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export function DnsLookupTool() {
  const [domain, setDomain] = useState("cloudflare.com");
  const [recordType, setRecordType] = useState("A");
  const [records, setRecords] = useState<DnsRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recordTypes = ["A", "AAAA", "MX", "TXT", "NS", "CNAME"];

  const typeMap: Record<number, string> = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    15: 'MX',
    16: 'TXT',
    28: 'AAAA'
  };

  const lookupDns = async () => {
    if (!domain) return;
    setLoading(true);
    setError("");
    setRecords(null);

    try {
      // Use Cloudflare DNS over HTTPS API
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=${recordType}`, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });
      
      const data = await response.json();
      
      if (data.Status !== 0) {
        setError(`DNS lookup failed (Status Code: ${data.Status}). Note: WHOIS requires a proxy backend, showing DNS records instead.`);
      } else {
        setRecords(data.Answer || []);
      }
    } catch (e: any) {
      setError("Failed to perform DNS lookup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout 
      title="DNS & WHOIS Records Lookup" 
      description="Perform client-side DNS queries to fetch domain records instantly."
      isPremiumOnly={false}
    >
      <div className="flex flex-col gap-6 max-w-4xl">
        
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && lookupDns()}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pl-10"
              placeholder="example.com"
              spellCheck="false"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          </div>

          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 w-full sm:w-auto overflow-x-auto">
            {recordTypes.map(rt => (
              <button 
                key={rt}
                onClick={() => setRecordType(rt)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${recordType === rt ? 'bg-primary text-slate-900 font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                {rt}
              </button>
            ))}
          </div>

          <button 
            onClick={lookupDns}
            disabled={loading || !domain}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)] disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Lookup
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center px-1">
            <span className="text-sm font-medium text-slate-300">Results</span>
          </div>
          <div className="w-full min-h-[300px] bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3">Domain Name</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">TTL</th>
                  <th className="px-6 py-3">Record Data</th>
                </tr>
              </thead>
              <tbody>
                {!records && !loading && !error && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                      Enter a domain and click Lookup to see DNS records.
                    </td>
                  </tr>
                )}
                {records && records.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                      No {recordType} records found for {domain}.
                    </td>
                  </tr>
                )}
                {records && records.map((r, i) => (
                  <tr key={i} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30 text-slate-300 font-mono">
                    <td className="px-6 py-4">{r.name}</td>
                    <td className="px-6 py-4 text-primary">{typeMap[r.type] || r.type}</td>
                    <td className="px-6 py-4">{r.TTL}s</td>
                    <td className="px-6 py-4 break-all">{r.data.replace(/^"|"$/g, '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
