import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, Sparkles, MessageSquare, Target, Zap, ShieldCheck, Search } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Category = "Pain" | "Benefit" | "Hook" | "Authority";

interface MessageIdea {
  id: string;
  text: string;
  category: Category;
}

const categoryIcons = {
  Pain: <Target className="h-4 w-4" />,
  Benefit: <Zap className="h-4 w-4" />,
  Hook: <Search className="h-4 w-4" />,
  Authority: <ShieldCheck className="h-4 w-4" />,
};

const categoryLabels = {
  Pain: "Ponto de Dor",
  Benefit: "Benefício Direto",
  Hook: "Curiosidade/Gancho",
  Authority: "Autoridade",
};

export default function MessageGenerator() {
  const [niche, setNiche] = useState("");
  const [messages, setMessages] = useState<MessageIdea[]>([]);
  const [activeTab, setActiveTab] = useState<Category | "All">("All");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMessages = () => {
    if (!niche) {
      toast.error("Coloque o nicho do seu cliente para personalizar as mensagens.");
      return;
    }

    setIsGenerating(true);

    // Procedural Engine Logic
    // In a real app, this could be an AI call. Here we use an advanced template system
    // to generate varied, professional-grade prospecting messages.

    setTimeout(() => {
      const nichePrefix = niche.toLowerCase();

      const newMessages: MessageIdea[] = [
        // PAIN POINTS
        {
          id: crypto.randomUUID(),
          category: "Pain",
          text: `Olá! Notei que sua ${nichePrefix} ainda usa processos manuais no Instagram. Isso não está tomando muito o seu tempo de atendimento que poderia ser vendas?`,
        },
        {
          id: crypto.randomUUID(),
          category: "Pain",
          text: `Oi! Percebi que é difícil ver todos os seus produtos de ${nichePrefix} sem ter que subir todo o feed. Já pensou em uma vitrine que organiza tudo pra você?`,
        },
        {
          id: crypto.randomUUID(),
          category: "Pain",
          text: `Olá, tudo bem? Vi sua ${nichePrefix} e achei incrível. Mas sinto que enviar preços um por um no direct pode estar fazendo você perder clientes apressados...`,
        },

        // BENEFITS
        {
          id: crypto.randomUUID(),
          category: "Benefit",
          text: `Oi! Criei uma demonstração de como sua ${nichePrefix} pode vender 3x mais com um catálogo profissional. Posso te enviar o link?`,
        },
        {
          id: crypto.randomUUID(),
          category: "Benefit",
          text: `Olá! Trabalho com tecnologia para ${nichePrefix} e montei um sistema onde seu cliente escolhe o produto e já cai no seu WhatsApp com o pedido pronto. Quer ver?`,
        },
        {
          id: crypto.randomUUID(),
          category: "Benefit",
          text: `Tudo bem? Imagine sua ${nichePrefix} com uma vitrine premium que funciona 24h por dia, sem você precisar responder "qual o preço?". Fiz um exemplo pra você!`,
        },

        // HOOKS
        {
          id: crypto.randomUUID(),
          category: "Hook",
          text: `Oi! Vi um detalhe no perfil da sua ${nichePrefix} que pode estar afastando novos clientes. Posso te dar uma dica rápida?`,
        },
        {
          id: crypto.randomUUID(),
          category: "Hook",
          text: `Olá! Estava analisando o mercado de ${nichePrefix} na sua região e encontrei uma oportunidade que você pode aproveitar hoje. Quer saber qual é?`,
        },

        // AUTHORITY
        {
          id: crypto.randomUUID(),
          category: "Authority",
          text: `Olá! Ajudo donos de ${nichePrefix} a automatizarem suas vendas pelo WhatsApp. Montei um caso de sucesso que pode se aplicar exatamente ao seu negócio.`,
        },
        {
          id: crypto.randomUUID(),
          category: "Authority",
          text: `Bom dia! Sou especialista em posicionamento digital para ${nichePrefix}. Desenvolvi uma estrutura de catálogo que já ajudou dezenas de empreendedores. Posso te mostrar?`,
        }
      ];

      setMessages(newMessages);
      setIsGenerating(false);
      toast.success("Centenas de ideias prontas para prospectar!");
    }, 800);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Mensagem copiada!");
  };

  const filteredMessages = activeTab === "All"
    ? messages
    : messages.filter(m => m.category === activeTab);

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="mb-10 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          <MessageSquare className="h-4 w-4" /> Inteligência de Abordagem
        </motion.div>
        <h1 className="text-4xl font-extrabold tracking-tight">Gerador de Prospecção</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Gere centenas de abordagens magnéticas para atrair clientes em qualquer nicho.
        </p>
      </div>

      <div className="mb-10 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 space-y-2">
            <Label className="text-muted-foreground">Qual o nicho do seu cliente?</Label>
            <div className="relative">
              <Input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Barbearia, Doceria, Loja de Roupas..."
                className="h-14 pl-12 bg-background"
                onKeyDown={(e) => e.key === 'Enter' && generateMessages()}
              />
              <Search className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <Button
            onClick={generateMessages}
            disabled={isGenerating}
            className="h-14 gap-3 px-8 text-lg font-bold shadow-lg"
          >
            {isGenerating ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Sparkles className="h-5 w-5" />}
            Gerar Estratégias
          </Button>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b pb-4">
            <Button
              size="sm"
              variant={activeTab === "All" ? "default" : "ghost"}
              onClick={() => setActiveTab("All")}
            >
              Todas
            </Button>
            {(Object.keys(categoryLabels) as Category[]).map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={activeTab === cat ? "default" : "ghost"}
                onClick={() => setActiveTab(cat)}
                className="gap-2"
              >
                {categoryIcons[cat]} {categoryLabels[cat]}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-4">
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/60">
                      {categoryIcons[msg.category]}
                      {categoryLabels[msg.category]}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90 italic">
                      "{msg.text}"
                    </p>
                  </div>
                  <Button
                    onClick={() => copy(msg.text)}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 border-primary/20 hover:bg-primary/5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                  >
                    <Copy className="h-3 w-3" /> Copiar Mensagem
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
