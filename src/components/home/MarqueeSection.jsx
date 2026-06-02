import { Sparkles, Award, BookOpen, Trophy, Users, Star, Youtube } from 'lucide-react';

const announcements = [
  { icon: Sparkles, text: 'New Batch Starting - Class 12 Chemistry' },
  { icon: Youtube, text: 'Free YouTube Video Lectures & Playlists Now Live!' },
  { icon: Award, text: '100% Result in Previous Year Board Exams' },
  { icon: BookOpen, text: 'Free Demo Class Available' },
  { icon: Youtube, text: 'Learn Polymer & EVS Visually on YouTube!' },
  { icon: Trophy, text: 'IIT-JEE 2024 Results: 50+ Selections' },
  { icon: Users, text: 'Join 50,000+ Successful Students' },
  { icon: Star, text: 'Rated 4.9/5 by Students' },
];

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

const MarqueeSection = () => {
  return (
    <section className="bg-card border-y border-border py-6 flex flex-col gap-6 overflow-hidden select-none">
      {/* Row 1: Announcements (Left scrolling) */}
      <div className="marquee-container flex">
        <div className="marquee-content flex gap-12 whitespace-nowrap">
          {/* First sequence */}
          {announcements.map((item, index) => (
            <div key={index} className="inline-flex items-center gap-3 mx-8 text-foreground/90 font-heading font-bold text-lg">
              <item.icon className="w-5 h-5 text-[#cc1111]" />
              <span>{item.text}</span>
            </div>
          ))}
          {/* Duplicate sequence for seamless loop */}
          {announcements.map((item, index) => (
            <div key={`dup-${index}`} className="inline-flex items-center gap-3 mx-8 text-foreground/90 font-heading font-bold text-lg">
              <item.icon className="w-5 h-5 text-[#cc1111]" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Thin elegant separator line between marquees */}
      <div className="w-full h-[1px] bg-border/50" />

      {/* Row 2: Chemical Formulas (Right scrolling) */}
      <div className="marquee-container flex">
        <div className="marquee-content-reverse flex gap-12 whitespace-nowrap">
          {/* First sequence */}
          {formulas.map((formula, idx) => (
            <div key={idx} className="inline-flex items-center mx-8 font-heading font-extrabold text-2xl tracking-wider">
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
          {/* Duplicate sequence for seamless loop */}
          {formulas.map((formula, idx) => (
            <div key={`dup-${idx}`} className="inline-flex items-center mx-8 font-heading font-extrabold text-2xl tracking-wider">
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
    </section>
  );
};

export default MarqueeSection;
