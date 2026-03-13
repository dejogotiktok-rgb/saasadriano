import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eye, Sparkles, AlertCircle, ShoppingCart, Info, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { nicheDatabase } from "./Niches";

// Helper to generate content based on niche name
const generateDemoContent = (nicheName: string) => {
  const contentMap: Record<string, { desc: string; products: { name: string; price: string }[] }> = {
    "Doces e confeitaria": {
      desc: "Delícias artesanais feitas com ingredientes premium para adoçar seus melhores momentos.",
      products: [
        { name: "Bento Cake Personalizado", price: "R$ 45,00" },
        { name: "Caixa de Brigadeiros (12un)", price: "R$ 32,00" },
        { name: "Fatia de Bolo Red Velvet", price: "R$ 18,50" },
      ]
    },
    "Roupas femininas": {
      desc: "Moda que empodera. Peças selecionadas para mulheres que buscam estilo e conforto.",
      products: [
        { name: "Vestido Midi Satin", price: "R$ 149,90" },
        { name: "Blazer Alfaiataria", price: "R$ 189,00" },
        { name: "Body canelado Basic", price: "R$ 59,90" },
      ]
    },
    "Barbearia": {
      desc: "Onde o tradicional encontra o moderno. Cuide do seu visual com quem entende de estilo masculino.",
      products: [
        { name: "Corte Degradê + Barba", price: "R$ 75,00" },
        { name: "Hidratação de Fios", price: "R$ 30,00" },
        { name: "Pomada Modeladora Matte", price: "R$ 45,00" },
      ]
    },
    // Generic fallback generator
    "default": {
      desc: `Soluções profissionais e personalizadas de ${nicheName} para elevar seu padrão de qualidade.`,
      products: [
        { name: `Serviço Especializado de ${nicheName}`, price: "Sob consulta" },
        { name: `Pacote Individual ${nicheName}`, price: "R$ 97,00" },
        { name: `Consultoria Premium ${nicheName}`, price: "R$ 250,00" },
      ]
    }
  };

  return contentMap[nicheName as keyof typeof contentMap] || contentMap["default"];
};

export default function DemoCreator() {
  const [instagramLink, setInstagramLink] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [demoGenerated, setDemoGenerated] = useState(false);
  const [demoData, setDemoData] = useState<{ desc: string; products: { name: string; price: string }[] } | null>(null);

  const generate = () => {
    if (!selectedNiche && !instagramLink) {
      toast.error("Selecione um nicho ou insira um link para gerar a demonstração.");
      return;
    }

    const content = generateDemoContent(selectedNiche || "Seu Negócio");
    setDemoData(content);
    setDemoGenerated(true);
    toast.success("Demonstração inteligente gerada com sucesso!");
  };

  const suggestedMessage = `Olá! Vi o perfil da sua loja de ${selectedNiche || 'produtos'} e montei uma demonstração de como seus produtos ficariam em um catálogo digital premium. Posso te enviar o link para você ver?`;

  const allNiches = Object.entries(nicheDatabase).flatMap(([cat, list]) => list.map(n => ({ ...n, category: cat })));

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="mb-8 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          Simulador de Catálogo
        </motion.div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">Criar Demonstração</h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Gere uma amostra visual do seu serviço para conquistar novos clientes rapidamente.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground/80 font-bold">Link do Instagram do Prospect</Label>
              <Input
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                placeholder="https://instagram.com/loja_exemplo"
                className="h-12 bg-muted/20"
              />
              <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <Info className="h-3 w-3" /> Usamos o link para captar a identidade visual do cliente futuramente.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-foreground/80 font-bold">Ou selecione entre centenas de nichos</Label>
              <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 gap-2">
                  {allNiches.map((n) => (
                    <button
                      key={n.name}
                      onClick={() => setSelectedNiche(n.name)}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-left p-3 text-xs font-medium transition-all ${selectedNiche === n.name
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <n.icon className={`h-4 w-4 ${selectedNiche === n.name ? "text-white" : "text-primary/60"}`} />
                      <span className="truncate">{n.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={generate} className="w-full gap-3 py-8 text-xl font-black shadow-xl group">
              <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" /> GERAR DEMO INTELIGENTE
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!demoGenerated ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted bg-muted/10 p-10 text-center"
              >
                <div className="mb-4 rounded-2xl bg-muted p-4">
                  <Eye className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="font-bold text-muted-foreground">Prévia Adormecida</h3>
                <p className="text-xs text-muted-foreground/60 mt-2">Selecione um nicho ao lado e gere sua primeira demonstração profissional.</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Simulated Phone UI */}
                <div className="relative mx-auto h-[500px] w-full rounded-[40px] border-[8px] border-slate-900 bg-background shadow-2xl overflow-hidden">
                  <div className="absolute top-0 h-6 w-full bg-slate-900 flex justify-center">
                    <div className="h-4 w-20 rounded-b-xl bg-black" />
                  </div>
                  <div className="h-full overflow-y-auto pt-8 px-4 pb-10">
                    <div className="mb-6 flex flex-col items-center text-center">
                      <div className="h-16 w-16 mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <ShoppingCart className="h-8 w-8" />
                      </div>
                      <h4 className="text-lg font-black tracking-tight">{selectedNiche || "Loja Exemplo"}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1 px-4">{demoData?.desc}</p>
                    </div>

                    <div className="space-y-2">
                      {demoData?.products.map((p) => (
                        <div key={p.name} className="flex items-center justify-between rounded-2xl border bg-card/10 p-3 shadow-sm border-primary/10">
                          <div>
                            <p className="text-xs font-bold">{p.name}</p>
                            <span className="text-[10px] text-muted-foreground italic">Pronta entrega</span>
                          </div>
                          <span className="text-xs font-black text-primary">{p.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-center">
                      <div className="rounded-full bg-primary px-4 py-2 text-[8px] font-black text-white shadow-lg">PEDIR NO WHATSAPP</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <AlertCircle className="h-4 w-4" /> Scripts de Abordagem
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "{suggestedMessage}"
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 border-primary/30"
                    onClick={() => {
                      navigator.clipboard.writeText(suggestedMessage);
                      toast.success("Abordagem copiada!");
                    }}
                  >
                    <Copy className="h-3 w-3" /> Copiar abordagem
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
