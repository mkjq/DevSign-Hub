"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isPremium: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  toggleMockPremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setIsLoading(false);
      return;
    }

    // Supabase auth state listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkPremiumStatus(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkPremiumStatus(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPremiumStatus = async (user: User | null) => {
    if (!user || !supabase) {
      setIsPremium(false);
      return;
    }
    // Assume there's a profiles table with is_premium boolean
    const { data, error } = await supabase
      .from("profiles")
      .select("is_premium")
      .eq("id", user.id)
      .single();

    if (data && !error) {
      setIsPremium(data.is_premium);
    }
  };

  const login = async () => {
    if (!hasSupabaseConfig) {
      // Mock login for development
      setUser({ id: "mock-user-id", email: "mock@devsignhub.test" } as User);
      return;
    }
    // Real login would happen via UI (e.g. Supabase Auth UI)
    // This is just a placeholder action for the context
  };

  const logout = async () => {
    if (!hasSupabaseConfig) {
      setUser(null);
      setIsPremium(false);
      return;
    }
    await supabase?.auth.signOut();
  };

  const toggleMockPremium = () => {
    setIsPremium((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{ user, isPremium, isLoading, login, logout, toggleMockPremium }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
