import { useState } from "react";
import { useCatalogs, type Product } from "@/contexts/CatalogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CatalogCreator() {
  const { addCatalog } = useCatalogs();
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [products, setProducts] = useState<Product[]>([
    { id: crypto.randomUUID(), name: "", price: "", image: "" },
  ]);
  const [created, setCreated] = useState(false);
  const [slug, setSlug] = useState("");

  const addProduct = () => {
    setProducts((p) => [...p, { id: crypto.randomUUID(), name: "", price: "", image: "" }]);
  };

  const removeProduct = (id: string) => {
    if (products.length <= 1) return;
    setProducts((p) => p.filter((pr) => pr.id !== id));
  };

  const updateProduct = (id: string, field: keyof Product, value: string) => {
    setProducts((p) => p.map((pr) => (pr.id === id ? { ...pr, [field]: value } : pr)));
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateProduct(id, "image", e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !niche) { toast.error("Preencha o nome e nicho do negócio."); return; }
    const validProducts = products.filter((p) => p.name && p.price);
    if (validProducts.length === 0) { toast.error("Adicione pelo menos um produto."); return; }

    const s = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    addCatalog({ businessName, slug: s, niche, description, whatsapp, products: validProducts }).then(() => {
      setSlug(s);
      setCreated(true);
      toast.success("Catálogo criado com sucesso!");
    }).catch((err) => {
      toast.error("Erro ao criar catálogo. Tente outro nome.");
    });
  };

  if (created) {
    const link = `${window.location.origin}/catalogo/${slug}`;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-accent/10 p-4"><Check className="h-8 w-8 text-accent" /></div>
        </div>
        <h1 className="mb-2 text-2xl font-bold">Catálogo criado!</h1>
        <p className="mb-4 text-muted-foreground">Compartilhe o link com seus clientes:</p>
        <div className="flex gap-2">
          <Input readOnly value={link} />
          <Button onClick={() => { navigator.clipboard.writeText(link); toast.success("Link copiado!"); }}>Copiar</Button>
        </div>
        <Button variant="outline" className="mt-4" onClick={() => { setCreated(false); setBusinessName(""); setNiche(""); setDescription(""); setWhatsapp(""); setProducts([{ id: crypto.randomUUID(), name: "", price: "", image: "" }]); }}>
          Criar outro catálogo
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">Criar catálogo</h1>
      <p className="mb-6 text-muted-foreground">Preencha as informações do negócio e adicione produtos.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Nome do negócio</Label>
            <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ex: Doces da Maria" />
          </div>
          <div>
            <Label>Nicho</Label>
            <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Ex: Confeitaria" />
          </div>
        </div>
        <div>
          <Label>Descrição do negócio</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o negócio..." rows={3} />
        </div>
        <div>
          <Label>WhatsApp (com DDD)</Label>
          <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="11999999999" />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <Label>Produtos</Label>
            <Button type="button" variant="outline" size="sm" onClick={addProduct} className="gap-1">
              <Plus className="h-3 w-3" /> Produto
            </Button>
          </div>
          <div className="space-y-4">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Produto {i + 1}</span>
                  {products.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeProduct(p.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Nome do produto" value={p.name} onChange={(e) => updateProduct(p.id, "name", e.target.value)} />
                  <Input placeholder="Preço (ex: R$ 29,90)" value={p.price} onChange={(e) => updateProduct(p.id, "price", e.target.value)} />
                </div>
                <div className="mt-3">
                  <Input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(p.id, e.target.files[0]); }} />
                  {p.image && <img src={p.image} alt="" className="mt-2 h-20 w-20 rounded-lg object-cover" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">Criar catálogo</Button>
      </form>
    </div>
  );
}
