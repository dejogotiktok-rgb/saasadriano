import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  hasLifetimeAccess: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasLifetimeAccess, setHasLifetimeAccess] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAccess = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("has_lifetime_access, is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Supabase Select Error:", error);
        setHasLifetimeAccess(false);
        setIsAdmin(false);
        return;
      }

      if (!data) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ 
            id: user.id, 
            email: user.email,
            has_lifetime_access: false, 
            is_admin: false 
          }]);
        
        if (insertError) console.error("Supabase Insert Error:", insertError);
        setHasLifetimeAccess(false);
        setIsAdmin(false);
      } else {
        setHasLifetimeAccess(data.has_lifetime_access === true || data.is_admin === true);
        setIsAdmin(data.is_admin === true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkAccess(currentUser);
      } else {
        setHasLifetimeAccess(false);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setIsLoading(true);
        checkAccess(currentUser);
      } else {
        setHasLifetimeAccess(false);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setHasLifetimeAccess(false);
    setIsAdmin(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isLoading, 
      hasLifetimeAccess: hasLifetimeAccess ?? false, 
      isAdmin: isAdmin ?? false 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
