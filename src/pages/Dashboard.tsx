import { useCatalogs } from "@/contexts/CatalogContext";
import { BookOpen, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { catalogs, deleteCatalog } = useCatalogs();
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Gerencie seus catálogos e ferramentas.</p>
        </div>
        <Button onClick={() => navigate("/dashboard/catalogo")} className="gap-2">
          <Plus className="h-4 w-4" /> Novo catálogo
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Catálogos criados", value: catalogs.length },
          { label: "Produtos cadastrados", value: catalogs.reduce((a, c) => a + c.products.length, 0) },
          { label: "Links gerados", value: catalogs.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Catalogs */}
      <h2 className="mb-4 text-lg font-semibold">Seus catálogos</h2>
      {catalogs.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum catálogo criado ainda.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/catalogo")}>
            Criar primeiro catálogo
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalogs.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold">{cat.businessName}</h3>
              <p className="text-sm text-muted-foreground">{cat.niche} · {cat.products.length} produtos</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="gap-1" onClick={() => window.open(`/catalogo/${cat.slug}`, "_blank")}>
                  <ExternalLink className="h-3 w-3" /> Ver
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCatalog(cat.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
