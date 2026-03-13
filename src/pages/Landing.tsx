import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, MessageSquare, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const features = [
  { icon: BookOpen, title: "Catálogos Online", desc: "Crie catálogos profissionais em minutos para seus clientes." },
  { icon: MessageSquare, title: "Mensagens de Prospecção", desc: "Gere mensagens de abordagem personalizadas com IA." },
  { icon: Search, title: "Encontre Clientes", desc: "Descubra pequenos negócios que precisam de presença digital." },
  { icon: Sparkles, title: "Ferramentas IA", desc: "Use inteligência artificial para criar soluções digitais." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Vitrino</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" onClick={() => navigate("/login")}>Entrar</Button>
          <Button onClick={() => navigate("/signup")}>Começar grátis</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Plataforma para serviços digitais
          </span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
            Crie catálogos online e<br />
            <span className="text-primary">venda serviços digitais</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            O Vitrino ajuda você a criar catálogos profissionais, encontrar clientes e oferecer
            soluções digitais para pequenos negócios que vendem nas redes sociais.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => navigate("/signup")} className="gap-2">
              Começar agora <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Já tenho conta
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <f.icon className="mb-3 h-8 w-8 text-primary" />
              <h3 className="mb-1 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Vitrino. Todos os direitos reservados.
      </footer>
    </div>
  );
}
