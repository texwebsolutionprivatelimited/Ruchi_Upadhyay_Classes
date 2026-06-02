import { motion } from 'framer-motion';

const formulas = [
  {
    parts: [
      { text: "C", color: "text-[#cc1111]" },
      { text: "6", color: "text-foreground", isSub: true },
      { text: "H", color: "text-[#cc1111]" },
      { text: "12", color: "text-foreground", isSub: true },
      { text: "O", color: "text-[#cc1111]" },
      { text: "6", color: "text-foreground", isSub: true }
    ]
  },
  {
    parts: [
      { text: "C", color: "text-foreground" },
      { text: "H", color: "text-foreground" },
      { text: "4", color: "text-[#cc1111]", isSub: true }
    ]
  },
  {
    parts: [
      { text: "H", color: "text-[#cc1111]" },
      { text: "2", color: "text-foreground", isSub: true },
      { text: "S", color: "text-foreground" },
      { text: "O", color: "text-foreground" },
      { text: "4", color: "text-[#cc1111]", isSub: true }
    ]
  },
  {
    parts: [
      { text: "N", color: "text-foreground" },
      { text: "H", color: "text-foreground" },
      { text: "3", color: "text-[#cc1111]", isSub: true }
    ]
  },
  {
    parts: [
      { text: "C", color: "text-[#cc1111]" },
      { text: "O", color: "text-foreground" },
      { text: "2", color: "text-foreground", isSub: true }
    ]
  },
  {
    parts: [
      { text: "K", color: "text-[#cc1111]" },
      { text: "N", color: "text-foreground" },
      { text: "O", color: "text-foreground" },
      { text: "3", color: "text-[#cc1111]", isSub: true }
    ]
  },
  {
    parts: [
      { text: "Fe", color: "text-foreground" },
      { text: "2", color: "text-[#cc1111]", isSub: true },
      { text: "O", color: "text-foreground" },
      { text: "3", color: "text-foreground", isSub: true }
    ]
  },
  {
    parts: [
      { text: "Mg", color: "text-foreground" },
      { text: "(OH)", color: "text-[#cc1111]" },
      { text: "2", color: "text-[#cc1111]", isSub: true }
    ]
  },
  {
    parts: [
      { text: "H", color: "text-[#cc1111]" },
      { text: "2", color: "text-foreground", isSub: true },
      { text: "O", color: "text-foreground" }
    ]
  },
  {
    parts: [
      { text: "Na", color: "text-foreground" },
      { text: "Cl", color: "text-[#cc1111]" }
    ]
  }
];

const FormulasMarquee = () => {
  return (
    <div className="bg-card border-y border-border py-4 overflow-hidden select-none">
      <div className="marquee-container flex">
        <div className="marquee-content flex gap-12 whitespace-nowrap">
          {/* First sequence */}
          {formulas.map((formula, idx) => (
            <div key={idx} className="inline-flex items-center mx-6 font-heading font-extrabold text-2xl tracking-wider">
              {formula.parts.map((part, pidx) => (
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
            </div>
          ))}
          {/* Duplicate sequence for seamless infinite loop */}
          {formulas.map((formula, idx) => (
            <div key={`dup-${idx}`} className="inline-flex items-center mx-6 font-heading font-extrabold text-2xl tracking-wider">
              {formula.parts.map((part, pidx) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormulasMarquee;
