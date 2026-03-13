import { useState } from "react";
import { useCatalogs, type Product } from "@/contexts/CatalogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Check, ExternalLink, Copy, Sparkles, AlertTriangle, Clock, MapPin, Share2, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CatalogCreator() {
  const { addCatalog } = useCatalogs();
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [hours, setHours] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");

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

  const generatePromptText = () => {
    const productsList = products.filter(p => p.name).map(p => `- **${p.name}**: ${p.price}`).join("\n");

    let nicheSpecificAdvice = "";
    const lowerNiche = niche.toLowerCase();

    if (lowerNiche.includes("barber") || lowerNiche.includes("salao")) {
      nicheSpecificAdvice = "- Adicione uma seção de 'Nossos Serviços' com preços claros.\n- Inclua um botão de agendamento que direcione para o WhatsApp ou sistema de reserva.\n- Crie uma galeria de fotos de 'Antes e Depois' ou cortes realizados.";
    } else if (lowerNiche.includes("restaurante") || lowerNiche.includes("comida") || lowerNiche.includes("doce")) {
      nicheSpecificAdvice = "- Crie um menu digital interativo com categorias (entradas, pratos, bebidas).\n- Adicione opção de 'Carrinho' ou 'Pedido Rápido' via WhatsApp.\n- Destaque os pratos mais vendidos com fotos grandes e atraentes.";
    } else if (lowerNiche.includes("loja") || lowerNiche.includes("venda") || lowerNiche.includes("ecommerce")) {
      nicheSpecificAdvice = "- Foco total na vitrine de produtos com filtros de categoria.\n- Botão 'Comprar Agora' em destaque.\n- Seção de depoimentos de clientes para gerar confiança.";
    } else {
      nicheSpecificAdvice = "- Foque em apresentar os diferenciais do negócio de forma visual e direta.\n- Facilite o contato do cliente em todas as seções.";
    }

    return `Aja como um Especialista em UX/UI e Engenheiro de Software Sênior. Sua tarefa é criar um site de "Vitrino Digital" (Showcase) de alto padrão, focado em conversão e estética premium.

**CONTEXTO DO NEGÓCIO:**
- **Nome:** ${businessName}
- **Nicho:** ${niche}
- **A Visão do Dono:** ${description}

**DETALHES DE CONTATO E OPERAÇÃO:**
- **WhatsApp:** ${whatsapp}
- **Horário de Funcionamento:** ${hours || "Não informado"}
- **Endereço/Localização:** ${address || "Não informado"}
- **Instagram:** ${instagram || "@"}

**ITENS / SERVIÇOS / PRODUTOS:**
${productsList || "O usuário descreveu na visão acima."}

**DIRETRIZES TÉCNICAS E DE DESIGN:**
- Tecnologia: React, Tailwind CSS, Framer Motion (para micro-interações fluidas).
- Design System: Use uma paleta de cores moderna (Vibrante mas elegante), tipografia clean (Inter ou Montserrat).
- Estrutura: Hero Section Impactante, Seção Sobre, Vitrine de Itens, Seção de Contato/Localização e Footer.
- Funcionalidade: Botões de call-to-action (CTA) amigáveis que abrem o WhatsApp com uma mensagem pré-preenchida.

**RECOMENDAÇÕES ESPECÍFICAS PARA ESTE NICHO:**
${nicheSpecificAdvice}

Por favor, gere o código completo, responsivo e pronto para uso deste catálogo digital.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !niche) { toast.error("Preencha o nome e nicho do negócio."); return; }

    const validProducts = products.filter((p) => p.name);
    const s = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const prompt = generatePromptText();

    try {
      await addCatalog({
        businessName,
        slug: s,
        niche,
        description,
        whatsapp,
        products: validProducts,
        metadata: { hours, address, instagram }
      });
      setGeneratedPrompt(prompt);
      setCreated(true);
      toast.success("Sistema gerou um prompt inteligente!");
    } catch (err) {
      toast.error("Erro ao processar. Tente novamente.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Prompt copiado com sucesso!");
  };

  if (created) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-3xl">
        <div className="rounded-2xl border bg-card p-4 shadow-xl sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary shadow-inner">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Prompt Inteligente Gerado!</h1>
                <p className="text-muted-foreground">Analisei suas ideias e criei a estrutura perfeita.</p>
              </div>
            </div>
          </div>

          <div className="group relative mb-8">
            <div className="absolute right-4 top-4 z-10 flex gap-2">
              <Button size="sm" variant="secondary" className="gap-2 bg-background/80 backdrop-blur" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" /> Copiar Código
              </Button>
            </div>
            <div className="max-h-[400px] overflow-y-auto rounded-xl bg-muted/50 p-6 pt-16 font-mono text-sm leading-relaxed text-muted-foreground shadow-inner border">
              {generatedPrompt.split('\n').map((line, i) => (
                <div key={i} className="mb-2">{line}</div>
              ))}
            </div>
          </div>

          <div className="mb-8 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-bold text-primary">Último Passo!</h3>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Vá ao **Gerador (Lovable)** e cole este prompt no chat. Ele vai ler todas as suas informações e construir o site automaticamente.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button className="flex-1 gap-3 py-8 text-xl font-bold shadow-lg" onClick={() => window.open("https://lovable.dev/dashboard", "_blank")}>
              Abrir Lovable Agora <ExternalLink className="h-6 w-6" />
            </Button>
            <Button variant="ghost" className="py-8" onClick={() => setCreated(false)}>
              Ajustar Informações
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          Inteligência para Negócios
        </motion.div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Prepare sua Vitrine</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Conte-nos sobre seu empreendimento. Vamos gerar o prompt ideal para criar seu catálogo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-8 rounded-3xl border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><Sparkles className="h-5 w-5" /></div>
            <h3 className="text-lg font-bold">Dados Principais</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-foreground/70">Nome Comercial</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ex: Barber Shop Imperial" className="h-12 bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/70">Nicho do Negócio</Label>
              <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Ex: Barbearia Profissional" className="h-12 bg-muted/30" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground/70">Sua Visão / Informações Gerais</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que seu negócio faz, seus diferenciais e o que quer passar para o cliente..."
              rows={5}
              className="resize-none bg-muted/30 p-4"
            />
          </div>
        </div>

        <div className="space-y-8 rounded-3xl border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><Clock className="h-5 w-5" /></div>
            <h3 className="text-lg font-bold">Operação e Contato</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-foreground/70 flex items-center gap-2"><Clock className="h-3 w-3" /> Horários</Label>
              <Input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Seg a Sex: 09h às 19h" className="h-11 bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/70 flex items-center gap-2"><MapPin className="h-3 w-3" /> Localização</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Bairro ou Cidade" className="h-11 bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/70 flex items-center gap-2"><Share2 className="h-3 w-3" /> Instagram</Label>
              <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@seu_perfil" className="h-11 bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/70 flex items-center gap-2">WhatsApp</Label>
              <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="11999999999" className="h-11 bg-muted/30" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary"><ListChecks className="h-5 w-5" /></div>
              <h3 className="text-lg font-bold">Itens, Serviços ou Detalhes</h3>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addProduct} className="gap-2 border-primary/30 hover:bg-primary/5">
              <Plus className="h-4 w-4" /> Adicionar Outro
            </Button>
          </div>

          <div className="grid gap-4">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-primary/40">Registro {i + 1}</span>
                  {products.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeProduct(p.id)} className="h-8 w-8 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">O que é?</Label>
                    <Input placeholder="Ex: Corte Degradê ou Rodízio" value={p.name} onChange={(e) => updateProduct(p.id, "name", e.target.value)} className="bg-muted/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Valor / Detalhe</Label>
                    <Input placeholder="Ex: R$ 45,00 ou Incluso Bebida" value={p.price} onChange={(e) => updateProduct(p.id, "price", e.target.value)} className="bg-muted/20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full gap-3 py-10 text-2xl font-black shadow-2xl transition-all active:scale-[0.98] group" size="lg">
          <Sparkles className="h-8 w-8 transition-transform group-hover:rotate-12" /> GERAR SISTEMA INTELIGENTE
        </Button>
      </form>
    </div>
  );
}
