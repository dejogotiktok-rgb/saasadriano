import { useParams } from "react-router-dom";
import { MessageCircle, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCatalogs, type Catalog } from "@/contexts/CatalogContext";

export default function PublicCatalog() {
  const { slug } = useParams<{ slug: string }>();
  const { getCatalogBySlug } = useCatalogs();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getCatalogBySlug(slug).then((data) => {
        setCatalog(data || null);
        setLoading(false);
      });
    }
  }, [slug, getCatalogBySlug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Catálogo não encontrado</h1>
          <p className="text-muted-foreground">Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/55${catalog.whatsapp?.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Powered by Vitrino</span>
          </div>
          {catalog.whatsapp && (
            <Button size="sm" asChild className="gap-1">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Business info */}
      <section className="mx-auto max-w-5xl px-6 py-10 text-center">
        <h1 className="mb-2 text-3xl font-bold">{catalog.businessName}</h1>
        {catalog.niche && (
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{catalog.niche}</span>
        )}
        {catalog.description && (
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{catalog.description}</p>
        )}
      </section>

      {/* Products */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.products.map((product: any) => (
            <div key={product.id} className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
              {product.image && (
                <div className="aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="mt-1 text-lg font-bold text-primary">{product.price}</p>
                {catalog.whatsapp && (
                  <Button size="sm" variant="outline" asChild className="mt-3 w-full gap-1">
                    <a
                      href={`${whatsappLink}?text=Olá! Tenho interesse no produto: ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> Contato via WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        Catálogo criado com <a href="/" className="font-medium text-primary hover:underline">Vitrino</a>
      </footer>
    </div>
  );
}
