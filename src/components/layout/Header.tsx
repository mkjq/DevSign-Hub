"use client";

import React from "react";
import { Search, Menu, LogIn, LogOut, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header({ setMobileOpen }: { setMobileOpen: (v: boolean) => void }) {
  const { user, isPremium, login, logout, toggleMockPremium, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 glass-panel border-t-0 border-x-0 rounded-none bg-slate-900/60">
      <div className="flex items-center gap-4 lg:hidden">
        <button 
          onClick={() => setMobileOpen(true)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center lg:justify-start px-4 lg:px-0">
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-800/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all"
            placeholder="Search tools... (e.g. JSON Formatter)"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Mock Premium Toggle for Testing */}
        <button 
          onClick={toggleMockPremium}
          className="hidden md:flex text-xs items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 text-slate-400"
          title="Toggle Premium (Dev Only)"
        >
          Toggle PRO
        </button>

        {!isLoading && (
          <>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-sm text-right">
                  <div className="text-white font-medium">{user.email || 'User'}</div>
                  {isPremium && <div className="text-premium text-xs flex items-center justify-end gap-1"><Crown size={12}/> PRO</div>}
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-lg transition-colors font-medium text-sm"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
