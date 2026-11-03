'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string, role?: string) => Promise<{ error: Error | null; needsEmailConfirmation?: boolean }>;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loginAsDemo: (role: 'learner' | 'parent' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: 'learner',
  isLoading: true,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithOtp: async () => ({ error: null }),
  signOut: async () => {},
  loginAsDemo: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string>('learner');
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    // 1. Check active Supabase session
    async function initSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setSession(data.session);
          setUser(data.session.user);
          setRole(data.session.user.user_metadata?.role || 'learner');
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase getSession notice:', err);
      }

      // Check demo user in localStorage
      const demoUserJson = typeof window !== 'undefined' ? localStorage.getItem('margdarshak_demo_user') : null;
      if (demoUserJson) {
        try {
          const parsed = JSON.parse(demoUserJson);
          setUser(parsed);
          setRole(parsed.user_metadata?.role || parsed.role || 'learner');
        } catch {
          localStorage.removeItem('margdarshak_demo_user');
        }
      }
      setIsLoading(false);
    }

    initSession();

    // 2. Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      const newUser = newSession?.user || null;
      setUser(newUser);
      if (newUser) {
        setRole(newUser.user_metadata?.role || 'learner');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('margdarshak_demo_user');
          // Set role cookie for admin route middleware
          if (newUser.user_metadata?.role === 'admin' || newUser.email?.includes('admin')) {
            document.cookie = 'margdarshak_admin_role=admin; path=/; max-age=86400';
          }
        }
      } else {
        setRole('learner');
        if (typeof window !== 'undefined') {
          document.cookie = 'margdarshak_admin_role=; path=/; max-age=0';
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error };
      }
      setSession(data.session);
      setUser(data.user);
      setRole(data.user?.user_metadata?.role || 'learner');
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName = '', userRole = 'learner') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: userRole,
          },
        },
      });

      if (error) {
        return { error };
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        setRole(userRole);
        return { error: null, needsEmailConfirmation: false };
      }

      return { error: null, needsEmailConfirmation: true };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signInWithOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign-out warning:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('margdarshak_demo_user');
      document.cookie = 'margdarshak_admin_role=; path=/; max-age=0';
    }
    setUser(null);
    setSession(null);
    setRole('learner');
  };

  const loginAsDemo = (demoRole: 'learner' | 'parent' | 'admin') => {
    let mockUser: any = null;
    if (demoRole === 'learner') {
      mockUser = {
        id: 'demo-learner-sih26241',
        email: 'learner@margdarshak.ai',
        user_metadata: { full_name: 'Ansh Tomar (Learner)', role: 'learner' },
      };
    } else if (demoRole === 'parent') {
      mockUser = {
        id: 'demo-parent-sih26241',
        email: 'parent@margdarshak.ai',
        user_metadata: { full_name: 'Rajesh Sharma (Parent)', role: 'parent' },
      };
    } else if (demoRole === 'admin') {
      mockUser = {
        id: 'demo-admin-sih26241',
        email: 'admin@msde-demo.gov.in',
        user_metadata: { full_name: 'MSDE Admin Director', role: 'admin' },
      };
      if (typeof window !== 'undefined') {
        document.cookie = 'margdarshak_admin_role=admin; path=/; max-age=86400';
      }
    }

    if (mockUser && typeof window !== 'undefined') {
      localStorage.setItem('margdarshak_demo_user', JSON.stringify(mockUser));
      setUser(mockUser as User);
      setRole(demoRole);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithOtp,
        signOut,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
