import { Beaker, Atom, Flame, FlaskConical, Dna, Database } from 'lucide-react';

const chemistryConcepts = [
  { text: "Organic Chemistry", icon: FlaskConical, color: "text-red-400" },
  { text: "Inorganic Chemistry", icon: Atom, color: "text-blue-400" },
  { text: "Physical Chemistry", icon: Beaker, color: "text-green-400" },
  { text: "Chemical Kinetics", icon: Flame, color: "text-amber-400" },
  { text: "Thermodynamics", icon: Beaker, color: "text-purple-400" },
  { text: "Atomic Structure", icon: Atom, color: "text-teal-400" },
  { text: "Chemical Bonding", icon: FlaskConical, color: "text-pink-400" },
  { text: "Electrochemistry", icon: Flame, color: "text-yellow-400" },
  { text: "Coordination Compounds", icon: Database, color: "text-cyan-400" },
  { text: "Biomolecules", icon: Dna, color: "text-emerald-400" },
  { text: "Periodic Table", icon: Database, color: "text-orange-400" },
  { text: "Hydrocarbons ⌬", icon: FlaskConical, color: "text-indigo-400" },
  { text: "Redox Reactions (e⁻ transfer)", icon: Flame, color: "text-rose-400" },
  { text: "Ideal Gas Law (PV = nRT)", icon: Beaker, color: "text-sky-400" },
  { text: "Avogadro's Number (6.022 × 10²³)", icon: Atom, color: "text-lime-400" },
  { text: "Benzene Ring (C₆H₆) ⌬", icon: FlaskConical, color: "text-violet-400" },
  { text: "Chemical Equilibrium (⇌)", icon: Database, color: "text-fuchsia-400" },
  { text: "pH Scale & Buffers", icon: Beaker, color: "text-yellow-500" },
  { text: "Polymerization", icon: Dna, color: "text-orange-500" },
  { text: "Spectroscopy", icon: Atom, color: "text-pink-500" },
  { text: "Quantum Chemistry", icon: Atom, color: "text-indigo-500" },
  { text: "Solid State Chemistry", icon: Database, color: "text-cyan-500" },
  { text: "Metallurgy & Extraction", icon: Flame, color: "text-amber-500" },
];

const ChemistryMarquee = () => {
  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-20 bg-secondary/10 border-y border-border overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          🧪 Chemistry Universe
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          Explore the Magic of Molecules
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          From basic formulas to complex reactions, master every concept with expert-curated paths
        </p>
      </div>

      <div className="relative py-4 bg-primary/5 border-y border-primary/10 overflow-hidden select-none">
        <div className="marquee-container flex">
          <div className="marquee-content flex gap-8 whitespace-nowrap">
            {/* First sequence of concepts */}
            {chemistryConcepts.map((concept, index) => (
              <div key={index} className="inline-flex items-center gap-3 mx-4 text-base sm:text-lg font-heading font-semibold text-foreground/80 hover:text-primary transition-colors cursor-default">
                <concept.icon className={`w-5 h-5 ${concept.color} animate-pulse`} />
                <span>{concept.text}</span>
              </div>
            ))}
            {/* Duplicate sequence for continuous scrolling */}
            {chemistryConcepts.map((concept, index) => (
              <div key={`dup-${index}`} className="inline-flex items-center gap-3 mx-4 text-base sm:text-lg font-heading font-semibold text-foreground/80 hover:text-primary transition-colors cursor-default">
                <concept.icon className={`w-5 h-5 ${concept.color} animate-pulse`} />
                <span>{concept.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChemistryMarquee;
