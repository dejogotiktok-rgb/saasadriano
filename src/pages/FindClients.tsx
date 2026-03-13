import { Search, Instagram, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const keywords = [
  "loja feminina", "doces caseiros", "manicure", "bijuteria",
  "marmitaria", "loja online", "salgados", "bolos decorados",
  "roupas infantis", "artesanato", "cosméticos naturais", "fitness",
];

const steps = [
  { title: "Busque no Instagram", desc: "Procure por perfis com as palavras-chave abaixo na bio ou nome." },
  { title: "Analise o perfil", desc: "Verifique se o negócio vende apenas pelas redes sociais, sem site ou catálogo." },
  { title: "Crie uma demonstração", desc: "Use o Vitrino para criar um catálogo de exemplo e envie para o cliente." },
  { title: "Envie a mensagem", desc: "Use o gerador de mensagens para criar uma abordagem personalizada." },
];

export default function FindClients() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">Encontrar clientes</h1>
      <p className="mb-6 text-muted-foreground">Aprenda a encontrar pequenos negócios que precisam de um catálogo digital.</p>

      <div className="mb-8 space-y-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 rounded-xl border bg-card p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {i + 1}
            </div>
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Search className="h-5 w-5" /> Palavras-chave para buscar
      </h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <a
            key={kw}
            href={`https://www.instagram.com/explore/tags/${kw.replace(/\s+/g, "")}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            <Instagram className="h-3 w-3" /> {kw}
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
}
