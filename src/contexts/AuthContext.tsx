import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function hydrateUser(session: Session | null) {
  setSession(session);
  if (!session?.user) {
    setUser(null);
    return;
  }

  const uid = session.user.id;

  // Fetch in parallel and don't error if rows don't exist
  const [{ data: roleData }, { data: profileData }] = await Promise.all([
    supabase.from('user_roles').select('role').eq('user_id', uid).maybeSingle(),
    supabase.from('profiles').select('name').eq('id', uid).maybeSingle(),
  ]);

  setUser({
    id: uid,
    email: session.user.email!,
    name: profileData?.name || session.user.email!,
    role: roleData?.role || 'viewer',
  });
}

useEffect(() => {
  let mounted = true;

  // ① Listen for future changes (do NOT toggle isLoading here)
  const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
    if (!mounted) return;
    void hydrateUser(nextSession);
  });

  //  Resolve the initial session once, then stop loading
  (async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      await hydrateUser(data.session);
    } finally {
      if (mounted) setIsLoading(false); // <- spinner ends here, even if no session
    }
  })();

  return () => {
    mounted = false;
    sub.subscription.unsubscribe();
  };
}, []);



  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  };

  const resetPassword = async (token: string, password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}