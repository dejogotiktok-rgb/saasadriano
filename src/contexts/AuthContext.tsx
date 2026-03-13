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
  const [hasLifetimeAccess, setHasLifetimeAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAccess = async (user: User) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("has_lifetime_access, is_admin")
      .eq("id", user.id)
      .maybeSingle(); // Better for checking existence

    if (error) {
      console.error("Supabase Select Error:", error);
      setHasLifetimeAccess(false);
      setIsAdmin(false);
      return;
    }

    if (!data) {
      console.log("Profile not found, creating for:", user.email);
      // If profile doesn't exist, create one including email
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{ 
          id: user.id, 
          email: user.email,
          has_lifetime_access: false, 
          is_admin: false 
        }]);
      
      if (insertError) {
        console.error("Supabase Insert Error:", insertError);
      }
      setHasLifetimeAccess(false);
      setIsAdmin(false);
    } else {
      setHasLifetimeAccess(data?.has_lifetime_access === true || data?.is_admin === true);
      setIsAdmin(data?.is_admin === true);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
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

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

    return () => subscription.unsubscribe();
  }, []);

  // Set loading to false once we have both user (or null) and access status
  useEffect(() => {
    if (user === null || (user !== null && hasLifetimeAccess !== undefined && isAdmin !== undefined)) {
      setIsLoading(false);
    }
  }, [user, hasLifetimeAccess, isAdmin]);

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
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, hasLifetimeAccess, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
