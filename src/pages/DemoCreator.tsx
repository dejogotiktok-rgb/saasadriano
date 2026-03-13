import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const niches: Record<string, { products: { name: string; price: string }[]; desc: string }> = {
  "Roupas femininas": {
    desc: "Loja de moda feminina com peças exclusivas e tendências da estação.",
    products: [
      { name: "Vestido Floral", price: "R$ 89,90" },
      { name: "Blusa Cropped", price: "R$ 49,90" },
      { name: "Calça Wide Leg", price: "R$ 79,90" },
    ],
  },
  "Confeitaria": {
    desc: "Doces artesanais feitos com muito carinho e ingredientes selecionados.",
    products: [
      { name: "Bolo de Chocolate", price: "R$ 65,00" },
      { name: "Brigadeiro Gourmet (10un)", price: "R$ 25,00" },
      { name: "Torta de Morango", price: "R$ 55,00" },
    ],
  },
  "Marmitaria": {
    desc: "Marmitas fitness e tradicionais com ingredientes frescos.",
    products: [
      { name: "Marmita Fitness", price: "R$ 22,00" },
      { name: "Marmita Tradicional", price: "R$ 18,00" },
      { name: "Kit Semanal (5 marmitas)", price: "R$ 85,00" },
    ],
  },
};

export default function DemoCreator() {
  const [instagramLink, setInstagramLink] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [demoGenerated, setDemoGenerated] = useState(false);

  const generate = () => {
    if (!selectedNiche && !instagramLink) {
      toast.error("Selecione um nicho ou cole um link do Instagram.");
      return;
    }
    setDemoGenerated(true);
    toast.success("Demonstração gerada!");
  };

  const nicheData = niches[selectedNiche];
  const suggestedMessage = "Montei um exemplo de catálogo para sua loja para mostrar como seus produtos poderiam ser organizados online. Posso te enviar?";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">Criar demonstração</h1>
      <p className="mb-6 text-muted-foreground">Gere demonstrações automáticas para enviar a clientes em potencial.</p>

      <div className="space-y-4">
        <div>
          <Label>Link do Instagram (opcional)</Label>
          <Input value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} placeholder="https://instagram.com/nomedapagina" />
        </div>

        <div>
          <Label>Ou selecione um nicho</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.keys(niches).map((n) => (
              <Button key={n} variant={selectedNiche === n ? "default" : "outline"} size="sm" onClick={() => setSelectedNiche(n)}>
                {n}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={generate} className="w-full gap-2">
          <Eye className="h-4 w-4" /> Gerar demonstração
        </Button>
      </div>

      {demoGenerated && nicheData && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="mb-1 text-lg font-semibold">{selectedNiche}</h2>
            <p className="mb-4 text-sm text-muted-foreground">{nicheData.desc}</p>
            <div className="space-y-3">
              {nicheData.products.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm font-semibold text-primary">{p.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Mensagem sugerida</span>
            </div>
            <p className="mb-3 text-sm leading-relaxed">{suggestedMessage}</p>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => { navigator.clipboard.writeText(suggestedMessage); toast.success("Mensagem copiada!"); }}>
              <Copy className="h-3 w-3" /> Copiar
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
