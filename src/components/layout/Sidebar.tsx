"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Hexagon, Code, Layout, Shield, Crown, Search, Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const { isPremium } = useAuth();

  const categories = [
    { name: "Core Utilities", icon: <Code size={20} />, path: "/category/core" },
    { name: "UI & Design", icon: <Layout size={20} />, path: "/category/design" },
    { name: "Data & Security", icon: <Shield size={20} />, path: "/category/security" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 glass-panel border-l-0 border-t-0 border-b-0 rounded-none z-50
        transition-transform duration-300 ease-in-out
        flex flex-col
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Hexagon className="text-primary" fill="currentColor" size={28} />
            <span className="text-xl font-bold font-space-grotesk tracking-tight text-white">
              DevSign<span className="text-primary">Hub</span>
            </span>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Categories
          </div>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const isActive = pathname.startsWith(cat.path);
              return (
                <Link
                  key={cat.path}
                  href={cat.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                    }
                  `}
                >
                  {cat.icon}
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <div className={`p-4 rounded-xl flex items-center justify-between ${isPremium ? 'bg-premium/10 border border-premium/20' : 'bg-slate-800 border border-slate-700/50'}`}>
            <div>
              <div className="text-sm font-medium text-white flex items-center gap-1.5">
                {isPremium ? (
                  <><Crown size={16} className="text-premium" /> PRO Plan</>
                ) : (
                  "Free Plan"
                )}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {isPremium ? "All features unlocked" : "Basic features only"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
