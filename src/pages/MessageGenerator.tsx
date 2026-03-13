import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const styles = ["Curta", "Direta", "Amigável", "Profissional"] as const;

const templates: Record<string, string[]> = {
  Curta: [
    "Oi! Vi que você vende pelo Instagram. Criei um catálogo online de exemplo para você. Posso te mostrar?",
    "Olá! Tenho uma ideia que pode ajudar suas vendas. Posso te mostrar um catálogo digital?",
  ],
  Direta: [
    "Olá, vi que você vende pelo Instagram e criei um exemplo de catálogo online que pode ajudar seus clientes a visualizar melhor seus produtos. Posso te mostrar como ficaria?",
    "Oi! Notei que você vende online e montei um catálogo digital de demonstração para sua loja. Quer ver como ficou?",
  ],
  Amigável: [
    "Oii! 😊 Tudo bem? Vi sua lojinha no Instagram e achei incrível! Criei um catálogo online de exemplo que pode te ajudar a organizar seus produtos. Posso te enviar?",
    "Oi! Adorei seus produtos! 💕 Montei um exemplo de catálogo digital para sua loja, acho que pode te ajudar bastante. Quer dar uma olhada?",
  ],
  Profissional: [
    "Prezado(a), identifiquei seu negócio nas redes sociais e desenvolvi uma demonstração de catálogo digital que pode otimizar a apresentação dos seus produtos aos clientes. Gostaria de conhecer a solução?",
    "Bom dia! Trabalho com soluções digitais para pequenos negócios e preparei uma demonstração personalizada de catálogo online para sua loja. Podemos agendar uma apresentação?",
  ],
};

export default function MessageGenerator() {
  const [businessType, setBusinessType] = useState("");
  const [style, setStyle] = useState<typeof styles[number]>("Direta");
  const [message, setMessage] = useState("");

  const generate = () => {
    const msgs = templates[style];
    const base = msgs[Math.floor(Math.random() * msgs.length)];
    setMessage(businessType ? base.replace("seus produtos", `seus produtos de ${businessType}`) : base);
  };

  const copy = () => {
    navigator.clipboard.writeText(message);
    toast.success("Mensagem copiada!");
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 text-2xl font-bold">Gerar mensagem de abordagem</h1>
      <p className="mb-6 text-muted-foreground">Crie mensagens personalizadas para prospectar clientes.</p>

      <div className="space-y-4">
        <div>
          <Label>Tipo de negócio (opcional)</Label>
          <Input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Ex: Confeitaria, Moda feminina..." />
        </div>

        <div>
          <Label>Estilo da abordagem</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {styles.map((s) => (
              <Button key={s} type="button" variant={style === s ? "default" : "outline"} size="sm" onClick={() => setStyle(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={generate} className="w-full gap-2">
          <Sparkles className="h-4 w-4" /> Gerar mensagem
        </Button>

        {message && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5">
            <p className="mb-4 text-sm leading-relaxed">{message}</p>
            <Button onClick={copy} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" /> Copiar mensagem
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
