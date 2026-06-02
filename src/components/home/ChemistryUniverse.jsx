import { motion } from 'framer-motion';
import { Beaker, Atom, FlaskConical, GraduationCap, Settings, Leaf } from 'lucide-react';

const academicDomains = [
  {
    title: "Class 9 Chemistry",
    formulaParts: [
      { text: "H", color: "text-[#cc1111]" },
      { text: "2", color: "text-foreground", isSub: true },
      { text: "O", color: "text-foreground" },
      { text: ", ", color: "text-muted-foreground" },
      { text: "Na", color: "text-foreground" },
      { text: "Cl", color: "text-[#cc1111]" },
      { text: ", ", color: "text-muted-foreground" },
      { text: "C", color: "text-[#cc1111]" },
      { text: "O", color: "text-foreground" },
      { text: "2", color: "text-foreground", isSub: true }
    ],
    description: "Build a rock-solid foundation with simple conceptual clarity, basic chemical formulas, valence, and fundamental chemical combinations.",
    icon: GraduationCap,
    gradient: "from-rose-500 to-red-600",
    shadow: "shadow-red-500/20",
    badge: "Foundation (Class 9)"
  },
  {
    title: "Class 10 Chemistry",
    formulaParts: [
      { text: "C", color: "text-foreground" },
      { text: "H", color: "text-foreground" },
      { text: "4", color: "text-[#cc1111]", isSub: true },
      { text: ", ", color: "text-muted-foreground" },
      { text: "N", color: "text-foreground" },
      { text: "H", color: "text-foreground" },
      { text: "3", color: "text-[#cc1111]", isSub: true },
      { text: ", ", color: "text-muted-foreground" },
      { text: "Mg", color: "text-foreground" },
      { text: "(OH)", color: "text-[#cc1111]" },
      { text: "2", color: "text-[#cc1111]", isSub: true }
    ],
    description: "Master board-specific chemical equations, acid-base reactions, metallurgy, and organic carbon compounds with high-scoring tricks.",
    icon: Beaker,
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    badge: "Board Exams (Class 10)"
  },
  {
    title: "Class 11 Chemistry",
    formulaParts: [
      { text: "H", color: "text-[#cc1111]" },
      { text: "2", color: "text-foreground", isSub: true },
      { text: "S", color: "text-foreground" },
      { text: "O", color: "text-foreground" },
      { text: "4", color: "text-[#cc1111]", isSub: true },
      { text: ", ", color: "text-muted-foreground" },
      { text: "K", color: "text-[#cc1111]" },
      { text: "N", color: "text-foreground" },
      { text: "O", color: "text-foreground" },
      { text: "3", color: "text-[#cc1111]", isSub: true }
    ],
    description: "Bridge to advanced chemistry. Deep dive into quantum models, molecular hybridization, chemical equilibrium, and basic organic mechanisms.",
    icon: Atom,
    gradient: "from-green-500 to-teal-600",
    shadow: "shadow-green-500/20",
    badge: "IIT-JEE / NEET (Class 11)"
  },
  {
    title: "Class 12 Chemistry",
    formulaParts: [
      { text: "C", color: "text-[#cc1111]" },
      { text: "6", color: "text-foreground", isSub: true },
      { text: "H", color: "text-[#cc1111]" },
      { text: "12", color: "text-foreground", isSub: true },
      { text: "O", color: "text-[#cc1111]" },
      { text: "6", color: "text-foreground", isSub: true },
      { text: ", ", color: "text-muted-foreground" },
      { text: "Fe", color: "text-foreground" },
      { text: "2", color: "text-[#cc1111]", isSub: true },
      { text: "O", color: "text-foreground" },
      { text: "3", color: "text-foreground", isSub: true }
    ],
    description: "Achieve board excellence + competitive edge in chemical kinetics, coordination compounds, electrochemistry, and organic reaction mechanisms.",
    icon: FlaskConical,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    badge: "Boards & Competitive (Class 12)"
  },
  {
    title: "Engineering Chemistry",
    formulaParts: [
      { text: "H", color: "text-[#cc1111]" },
      { text: "2", color: "text-foreground", isSub: true },
      { text: "O", color: "text-foreground" },
      { text: ", ", color: "text-muted-foreground" },
      { text: "Ca", color: "text-foreground" },
      { text: "C", color: "text-[#cc1111]" },
      { text: "O", color: "text-foreground" },
      { text: "3", color: "text-foreground", isSub: true },
      { text: ", polymers", color: "text-[#cc1111]" }
    ],
    description: "Tailored college curriculum for B.Tech/B.E. students covering water treatment methods, phase rule, corrosion engineering, and advanced polymers.",
    icon: Settings,
    gradient: "from-purple-500 to-fuchsia-600",
    shadow: "shadow-purple-500/20",
    badge: "University Level (B.Tech)"
  },
  {
    title: "Environmental Science",
    formulaParts: [
      { text: "C", color: "text-[#cc1111]" },
      { text: "O", color: "text-foreground" },
      { text: "2", color: "text-foreground", isSub: true },
      { text: ", ", color: "text-muted-foreground" },
      { text: "C", color: "text-foreground" },
      { text: "H", color: "text-foreground" },
      { text: "4", color: "text-[#cc1111]", isSub: true },
      { text: ", ", color: "text-muted-foreground" },
      { text: "S", color: "text-[#cc1111]" },
      { text: "O", color: "text-foreground" },
      { text: "2", color: "text-foreground", isSub: true }
    ],
    description: "Understand ecological systems, ozone depletion, pollutant analysis, sustainable green technology, and natural resource conservation methods.",
    icon: Leaf,
    gradient: "from-cyan-500 to-sky-600",
    shadow: "shadow-cyan-500/20",
    badge: "EVS Core"
  }
];

const ChemistryUniverse = () => {
  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-20 bg-secondary/10 border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            🎓 Chemistry Classes
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Explore Our Chemistry Offerings
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            From middle school basics to advanced engineering courses, learn with Dr. Ruchi Upadhyay for guaranteed academic success.
          </p>
        </div>

        {/* Dynamic Interactive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          {academicDomains.map((domain, index) => (
            <motion.div
              key={domain.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:${domain.shadow} hover:border-primary/20 transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.gradient} flex items-center justify-center text-white shadow-lg`}>
                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                      <domain.icon className="w-6 h-6" />
                    </motion.div>
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase bg-secondary px-2.5 py-1 rounded-full">
                    {domain.badge}
                  </span>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-2">
                  {domain.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  {domain.description}
                </p>
              </div>

              {/* Card Footer: Topics list styled identically to the screenshot */}
              <div className="pt-4 border-t border-border mt-auto">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">
                  Core Formulas Studied:
                </span>
                <code className="text-xs md:text-sm font-semibold bg-primary/5 px-2.5 py-1.5 rounded-lg font-mono block whitespace-normal break-words leading-relaxed overflow-x-auto">
                  {domain.formulaParts.map((part, pidx) => (
                    part.isSub ? (
                      <sub key={pidx} className={`text-[0.65em] align-baseline bottom-[-0.2em] relative font-extrabold ${part.color}`}>
                        {part.text}
                      </sub>
                    ) : (
                      <span key={pidx} className={part.color}>
                        {part.text}
                      </span>
                    )
                  ))}
                </code>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChemistryUniverse;
