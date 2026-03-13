import { TrendingUp, ShoppingBag, Cake, UtensilsCrossed, Palette, Gem, Package, Baby, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

const niches = [
  { icon: ShoppingBag, name: "Roupas femininas", desc: "Alta demanda por catálogos de moda online." },
  { icon: Cake, name: "Doces e confeitaria", desc: "Confeiteiros precisam mostrar seus produtos." },
  { icon: UtensilsCrossed, name: "Marmitaria", desc: "Cardápios digitais para delivery." },
  { icon: Palette, name: "Maquiagem", desc: "Catálogos de produtos de beleza." },
  { icon: Gem, name: "Bijuterias", desc: "Vitrines online para acessórios." },
  { icon: Package, name: "Produtos artesanais", desc: "Artesãos que vendem em redes sociais." },
  { icon: Baby, name: "Loja infantil", desc: "Roupas e acessórios para crianças." },
  { icon: Dumbbell, name: "Loja fitness", desc: "Suplementos e roupas esportivas." },
];

export default function Niches() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Nichos com alta demanda</h1>
      </div>
      <p className="mb-8 text-muted-foreground">Esses nichos possuem grande volume de negócios que vendem apenas pelas redes sociais e podem se beneficiar de um catálogo online.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {niches.map((n, i) => (
          <motion.div
            key={n.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-4 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="rounded-lg bg-primary/10 p-2.5">
              <n.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{n.name}</h3>
              <p className="text-sm text-muted-foreground">{n.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
