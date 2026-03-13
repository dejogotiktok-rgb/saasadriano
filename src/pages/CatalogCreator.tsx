import { useState } from "react";
import { useCatalogs, type Product } from "@/contexts/CatalogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Check, ExternalLink, Copy, Sparkles, AlertTriangle } from "lucide-react";
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
  const [generatedPrompt, setGeneratedPrompt] = useState("");

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

  const generatePromptText = (name: string, nicheStr: string, desc: string, wa: string, prods: Product[]) => {
    const productsList = prods.map(p => `- **${p.name}**: ${p.price}`).join("\n");

    return `Crie um site de catálogo digital (Showcase) profissional e moderno para o seguinte negócio:

**Informações do Negócio:**
- **Nome:** ${name}
- **Nicho:** ${nicheStr}
- **Descrição:** ${desc}
- **WhatsApp para contato:** ${wa}

**Lista de Produtos:**
${productsList}

**Requisitos de Design:**
- Design limpo, premium e focado em conversão.
- Cores harmoniosas (estilo moderno).
- Carrossel de produtos ou grade elegante.
- Botão "Pedir no WhatsApp" em cada produto.
- Responsivo para dispositivos móveis.
- Adicione fotos de placeholder de alta qualidade relacionadas ao nicho.

Por favor, gere a estrutura completa e funcional do frontend para este catálogo.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !niche) { toast.error("Preencha o nome e nicho do negócio."); return; }
    const validProducts = products.filter((p) => p.name && p.price);
    if (validProducts.length === 0) { toast.error("Adicione pelo menos um produto."); return; }

    const s = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const prompt = generatePromptText(businessName, niche, description, whatsapp, validProducts);

    try {
      await addCatalog({ businessName, slug: s, niche, description, whatsapp, products: validProducts });
      setGeneratedPrompt(prompt);
      setCreated(true);
      toast.success("Prompt gerado com sucesso!");
    } catch (err) {
      toast.error("Erro ao processar ideias. Tente outro nome de negócio.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Prompt copiado para a área de transferência!");
  };

  if (created) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl">
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Ideias processadas!</h1>
                <p className="text-sm text-muted-foreground">Aqui está o seu prompt pronto para o gerador.</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setCreated(false)}>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute right-3 top-3">
              <Button size="sm" variant="secondary" className="gap-2" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" /> Copiar
              </Button>
            </div>
            <pre className="max-h-[300px] overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted p-4 pt-12 text-sm text-muted-foreground">
              {generatedPrompt}
            </pre>
          </div>

          <div className="mb-8 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-700 dark:text-yellow-400">Próximo Passo Importante:</p>
                <p className="text-yellow-600/90 dark:text-yellow-400/80">
                  Clique no botão abaixo para ir ao **Gerador (Lovable)**. Assim que chegar lá, **cole este prompt no chat** para que o catálogo seja construído automaticamente para você.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1 gap-2 py-6 text-lg" onClick={() => window.open("https://lovable.dev/dashboard", "_blank")}>
              Ir para o Gerador <ExternalLink className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="py-6" onClick={() => setCreated(false)}>
              Criar Novas Ideias
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">O que você tem em mente?</h1>
        <p className="mt-2 text-muted-foreground">
          Deixe suas ideias aqui. Nossa inteligência criará um prompt perfeito para o gerador transformar seu sonho em realidade.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome do negócio</Label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Doces da Maria"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Nicho</Label>
              <Input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Confeitaria"
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>O que você quer vender? (Ideias e Detalhes)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva seu negócio, sua visão e o que o torna especial..."
              rows={4}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label>WhatsApp para suporte (opcional)</Label>
            <Input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="11999999999"
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <Label className="text-lg font-semibold">Seus Produtos/Serviços</Label>
            <Button type="button" variant="outline" size="sm" onClick={addProduct} className="gap-2 border-primary/20 hover:bg-primary/5">
              <Plus className="h-4 w-4" /> Adicionar Produto
            </Button>
          </div>

          <div className="grid gap-4">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/30"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Produto {i + 1}</span>
                  {products.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeProduct(p.id)} className="h-8 w-8 p-0 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Nome do produto</Label>
                    <Input placeholder="Ex: Bolo de Chocolate" value={p.name} onChange={(e) => updateProduct(p.id, "name", e.target.value)} className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Preço aproximado</Label>
                    <Input placeholder="Ex: R$ 50,00" value={p.price} onChange={(e) => updateProduct(p.id, "price", e.target.value)} className="bg-background" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full gap-2 py-8 text-xl font-bold shadow-lg transition-transform hover:scale-[1.01]" size="lg">
          <Sparkles className="h-6 w-6" /> Gerar Prompt para o Catálogo
        </Button>
      </form>
    </div>
  );
}
