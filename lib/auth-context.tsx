'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserRole {
  isSupplier: boolean;
  isHealthcareProvider: boolean;
  isBuyer: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  // Role-based helpers
  roles: UserRole;
  // Helper IDs
  supplierId: string | null;
  healthcareProviderId: string | null;
}

const defaultContext: AuthContextType = {
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: new Error('AuthContext not initialized') }),
  signOut: async () => {},
  refreshSession: async () => {},
  roles: {
    isSupplier: false,
    isHealthcareProvider: false,
    isBuyer: false,
  },
  supplierId: null,
  healthcareProviderId: null,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<UserRole>({
    isSupplier: false,
    isHealthcareProvider: false,
    isBuyer: false,
  });
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [healthcareProviderId, setHealthcareProviderId] = useState<string | null>(null);

  // Function to determine user roles based on metadata
  const determineUserRoles = (user: User | null) => {
    if (!user) {
      setRoles({
        isSupplier: false,
        isHealthcareProvider: false,
        isBuyer: false,
      });
      setSupplierId(null);
      setHealthcareProviderId(null);
      return;
    }

    const userRole = user.user_metadata?.role;
    
    // Set role flags
    const isSupplier = userRole === 'supplier';
    const isHealthcareProvider = userRole === 'healthcare_provider';
    const isBuyer = userRole === 'buyer';
    
    setRoles({
      isSupplier,
      isHealthcareProvider,
      isBuyer,
    });
    
    // Set IDs for convenience
    if (isSupplier) {
      setSupplierId(user.id);
    } else {
      setSupplierId(null);
    }
    
    if (isHealthcareProvider) {
      setHealthcareProviderId(user.id);
    } else {
      setHealthcareProviderId(null);
    }
  };

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      console.log("[AuthContext] Attempting to refresh session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log("[AuthContext] supabase.auth.getSession() result:", { 
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        error: error?.message 
      });

      if (error) {
        throw error;
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
        determineUserRoles(session.user);
      } else {
        setSession(null);
        setUser(null);
        determineUserRoles(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      await refreshSession();
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user || null);
          determineUserRoles(newSession?.user || null);
          setIsLoading(false);
        }
      );
      
      // Cleanup subscription
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
    refreshSession,
    roles,
    supplierId,
    healthcareProviderId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 