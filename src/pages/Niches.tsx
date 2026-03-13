import {
  TrendingUp, ShoppingBag, Cake, UtensilsCrossed, Palette, Gem, Package, Baby,
  Dumbbell, Car, Home, Camera, Scissors, Dog, HeartPulse, HardHat, Coffee,
  Leaf, Music, Book, Search, Sparkles
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const nicheDatabase = {
  "Alimentação": [
    { name: "Doces e confeitaria", icon: Cake, demand: "Alta", potential: "Premium" },
    { name: "Marmitaria Fitness", icon: UtensilsCrossed, demand: "Muito Alta", potential: "Recorrência" },
    { name: "Hambúrgueres Artesanais", icon: UtensilsCrossed, demand: "Alta", potential: "Escalável" },
    { name: "Pães de Fermentação Natural", icon: Coffee, demand: "Média", potential: "Premium" },
    { name: "Comida Vegana/Vegetariana", icon: Leaf, demand: "Crescente", potential: "Nicho" },
    { name: "Cafeteria e Grãos", icon: Coffee, demand: "Alta", potential: "Estilo de Vida" },
    { name: "Buffet para Eventos", icon: UtensilsCrossed, demand: "Média", potential: "Ticket Médio Alto" },
    { name: "Sushi e Comida Japonesa", icon: UtensilsCrossed, demand: "Alta", potential: "Premium" },
  ],
  "Moda e Acessórios": [
    { name: "Roupas femininas", icon: ShoppingBag, demand: "Muito Alta", potential: "Alta Rotação" },
    { name: "Moda Praia", icon: ShoppingBag, demand: "Sazonal", potential: "Visual" },
    { name: "Bijuterias e Joias", icon: Gem, demand: "Alta", potential: "Envio Fácil" },
    { name: "Brechó Online", icon: Package, demand: "Crescente", potential: "Sustentável" },
    { name: "Moda Infantil", icon: Baby, demand: "Muito Alta", potential: "Fidelidade" },
    { name: "Roupas Fitness", icon: Dumbbell, demand: "Alta", potential: "Crescente" },
    { name: "Calçados e Tênis", icon: ShoppingBag, demand: "Alta", potential: "Estilo" },
    { name: "Moda Masculina", icon: ShoppingBag, demand: "Crescente", potential: "Fidelidade" },
  ],
  "Beleza e Estética": [
    { name: "Maquiagem", icon: Palette, demand: "Alta", potential: "Visual" },
    { name: "Design de Sobrancelhas", icon: Scissors, demand: "Alta", potential: "Serviço" },
    { name: "Barbearia", icon: Scissors, demand: "Muito Alta", potential: "Fidelidade" },
    { name: "Manicure e Nails", icon: Palette, demand: "Muito Alta", potential: "Recorrência" },
    { name: "Estética Facial/Corporal", icon: HeartPulse, demand: "Alta", potential: "Ticket Médio Alto" },
    { name: "Perfumaria e Essências", icon: Gem, demand: "Média", potential: "Presentes" },
  ],
  "Casa e Decoração": [
    { name: "Artesanato e DIY", icon: Package, demand: "Alta", potential: "Único" },
    { name: "Móveis Planejados", icon: Home, demand: "Alta", potential: "Ticket Alto" },
    { name: "Plantas e Jardinagem", icon: Leaf, demand: "Crescente", potential: "Bem Estar" },
    { name: "Quadros e Arte", icon: Palette, demand: "Média", potential: "Decoração" },
    { name: "Organização Doméstica", icon: Package, demand: "Crescente", potential: "Serviço" },
    { name: "Utensílios de Cozinha", icon: Home, demand: "Alta", potential: "Necessidade" },
  ],
  "Serviços e Profissionais": [
    { name: "Fotografia e Vídeo", icon: Camera, demand: "Alta", potential: "Portfólio" },
    { name: "Consultoria em Geral", icon: TrendingUp, demand: "Alta", potential: "Conhecimento" },
    { name: "Aulas de Música", icon: Music, demand: "Média", potential: "Recorrência" },
    { name: "Personal Trainer", icon: Dumbbell, demand: "Alta", potential: "Serviço" },
    { name: "Pet Shop e Banho/Tosa", icon: Dog, demand: "Muito Alta", potential: "Fidelidade" },
    { name: "Manutenção de Celulares", icon: HardHat, demand: "Alta", potential: "Essencial" },
    { name: "Cursos e Infoprodutos", icon: Book, demand: "Explosiva", potential: "Escalável" },
  ],
  "Automotivo": [
    { name: "Estética Automotiva", icon: Car, demand: "Alta", potential: "Visual" },
    { name: "Acessórios para Carros", icon: Package, demand: "Alta", potential: "Nicho" },
    { name: "Oficina Mecânica", icon: HardHat, demand: "Alta", potential: "Necessidade" },
    { name: "Aluguel de Veículos", icon: Car, demand: "Média", potential: "Recorrência" },
  ]
};

export default function Niches() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Object.keys(nicheDatabase);

  const allNiches = categories.flatMap(cat =>
    nicheDatabase[cat as keyof typeof nicheDatabase].map(n => ({ ...n, category: cat }))
  );

  const filteredNiches = allNiches.filter(n => {
    const matchesSearch = n.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? n.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          <TrendingUp className="h-4 w-4" /> Inteligência de Mercado
        </motion.div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Explorador de Nichos</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Descubra centenas de nichos lucrativos que precisam de um catálogo hoje mesmo.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquise entre centenas de nichos... (ex: Bolo, Roupa, Carro)"
            className="h-14 pl-12 bg-card shadow-sm"
          />
          <Search className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            Todos
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredNiches.map((n, i) => (
            <motion.div
              key={n.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i % 20 * 0.02 }}
              className="group flex items-start gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div className="rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <n.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">{n.category}</span>
                  <div className="flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
                    <Sparkles className="h-2 w-2" /> {n.potential}
                  </div>
                </div>
                <h3 className="font-bold text-foreground/90">{n.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Demanda: <span className="font-bold text-foreground/70">{n.demand}</span></span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredNiches.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground italic">Nenhum nicho encontrado para sua pesquisa. Tente outro tema!</p>
        </div>
      )}
    </div>
  );
}
