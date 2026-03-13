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
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasLifetimeAccess, setHasLifetimeAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAccess = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("has_lifetime_access")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking access:", error);
      // If profile doesn't exist, create one
      if (error.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: userId, has_lifetime_access: false }]);
        if (insertError) console.error("Error creating profile:", insertError);
      }
      setHasLifetimeAccess(false);
    } else {
      setHasLifetimeAccess(data?.has_lifetime_access ?? false);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAccess(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAccess(session.user.id);
      } else {
        setHasLifetimeAccess(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set loading to false once we have both user (or null) and access status
  useEffect(() => {
    if (user === null || (user !== null && hasLifetimeAccess !== undefined)) {
      // A bit tricky because hasLifetimeAccess is boolean. 
      // We'll manage setIsLoading inside checkAccess and session load
    }
  }, [user, hasLifetimeAccess]);

  // Adjusting the isLoading logic to be more reliable
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
    } else if (hasLifetimeAccess !== undefined) {
      setIsLoading(false);
    }
  }, [user, hasLifetimeAccess]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, hasLifetimeAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
