import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, ExternalLink, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const suggestions = [
  { input: "site para loja", suggestion: "Crie um site profissional para uma loja online com catálogo de produtos, carrinho de compras e página de checkout." },
  { input: "sistema de pedidos", suggestion: "Desenvolva um sistema de pedidos com cardápio digital, notificações por WhatsApp e painel de gestão de pedidos." },
  { input: "landing page", suggestion: "Crie uma landing page de alta conversão com formulário de captura, seção de benefícios e depoimentos." },
  { input: "agendamento", suggestion: "Desenvolva um sistema de agendamento online com calendário, confirmação automática e lembretes." },
];

export default function AITools() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = () => {
    if (!description.trim()) return;
    const found = suggestions.find((s) => description.toLowerCase().includes(s.input));
    setResult(
      found?.suggestion ||
        `Com base na sua descrição "${description}", recomendamos criar uma solução digital personalizada. Use o botão abaixo para iniciar o projeto com IA.`
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Ferramentas IA</h1>
      </div>
      <p className="mb-8 text-muted-foreground">Descreva o serviço digital que deseja criar e receba sugestões de como implementá-lo.</p>

      <div className="space-y-4">
        <div>
          <Label>Descreva o que você quer criar</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Quero criar um site para uma loja de roupas..."
            rows={4}
          />
        </div>
        <Button onClick={handleGenerate} className="w-full gap-2">
          <Sparkles className="h-4 w-4" /> Gerar sugestão
        </Button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold">Sugestão</span>
            </div>
            <p className="mb-4 text-sm leading-relaxed">{result}</p>
            <Button
              onClick={() => window.open("https://lovable.dev", "_blank")}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" /> Criar com IA
            </Button>
          </div>
        </motion.div>
      )}

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Ideias populares</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((s) => (
            <button
              key={s.input}
              onClick={() => { setDescription(s.input); }}
              className="rounded-xl border bg-card p-4 text-left transition-shadow hover:shadow-md"
            >
              <span className="text-sm font-medium">{s.input}</span>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{s.suggestion}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
