import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface Catalog {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  niche: string;
  description: string;
  whatsapp: string;
  products: Product[];
  createdAt: string;
}

interface CatalogContextType {
  catalogs: Catalog[];
  addCatalog: (catalog: Omit<Catalog, "id" | "userId" | "createdAt">) => Promise<void>;
  deleteCatalog: (id: string) => Promise<void>;
  getCatalogBySlug: (slug: string) => Promise<Catalog | undefined>;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);

  useEffect(() => {
    if (!user) {
      setCatalogs([]);
      return;
    }

    const fetchCatalogs = async () => {
      const { data, error } = await supabase
        .from("catalogs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching catalogs:", error);
        return;
      }

      const formatted = data.map((c: any) => ({
        id: c.id,
        userId: c.user_id,
        businessName: c.business_name,
        slug: c.slug,
        niche: c.niche,
        description: c.description,
        whatsapp: c.whatsapp,
        products: c.products || [],
        createdAt: c.created_at,
      }));

      setCatalogs(formatted);
    };

    fetchCatalogs();
  }, [user]);

  const addCatalog = async (catalog: Omit<Catalog, "id" | "userId" | "createdAt">) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("catalogs")
      .insert([
        {
          user_id: user.id,
          business_name: catalog.businessName,
          slug: catalog.slug,
          niche: catalog.niche,
          description: catalog.description,
          whatsapp: catalog.whatsapp,
          products: catalog.products,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding catalog:", error);
      throw error;
    }

    if (data) {
      const newCatalog: Catalog = {
        id: data.id,
        userId: data.user_id,
        businessName: data.business_name,
        slug: data.slug,
        niche: data.niche,
        description: data.description,
        whatsapp: data.whatsapp,
        products: data.products,
        createdAt: data.created_at,
      };
      setCatalogs((prev) => [newCatalog, ...prev]);
    }
  };

  const deleteCatalog = async (id: string) => {
    const { error } = await supabase.from("catalogs").delete().eq("id", id);
    if (error) {
      console.error("Error deleting catalog:", error);
      throw error;
    }
    setCatalogs((prev) => prev.filter((c) => c.id !== id));
  };

  const getCatalogBySlug = async (slug: string) => {
    const { data, error } = await supabase
      .from("catalogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return undefined;

    return {
      id: data.id,
      userId: data.user_id,
      businessName: data.business_name,
      slug: data.slug,
      niche: data.niche,
      description: data.description,
      whatsapp: data.whatsapp,
      products: data.products,
      createdAt: data.created_at,
    };
  };

  return (
    <CatalogContext.Provider value={{ catalogs, addCatalog, deleteCatalog, getCatalogBySlug }}>
      {children}
    </CatalogContext.Provider>
  );
}

export const useCatalogs = () => {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalogs must be used within CatalogProvider");
  return ctx;
};
