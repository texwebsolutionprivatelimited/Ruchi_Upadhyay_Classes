import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const funChemistryTexts = [
  "Synthesizing elements...",
  "Balancing chemical equations...",
  "Igniting Bunsen burner...",
  "Diluting acidic solutions...",
  "Stirring the catalysts...",
  "Measuring molecular weight...",
  "Exchanging valence electrons...",
  "Polishing the periodic table...",
  "Calculating covalent bonds...",
  "Precipitating beautiful crystals...",
  "Charging atomic orbitals..."
];

export const ChemistryLoader = ({ size = "md", className = "", showText = true }) => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!showText) return;
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % funChemistryTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [showText]);

  // Dimension mapping
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-28 h-28",
    lg: "w-40 h-40",
    xl: "w-52 h-52"
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex flex-col items-center justify-center gap-6 p-6 ${className}`}>
      {/* Self-contained CSS for high-quality, complex animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes chem-slosh {
          0%, 100% { d: path('M20 70 C 32 67, 42 73, 50 70 C 58 67, 68 73, 80 70 L 83 78 A 3 3 0 0 1 80 81 H 20 A 3 3 0 0 1 17 78 Z'); }
          50% { d: path('M20 70 C 32 73, 42 67, 50 70 C 58 73, 68 67, 80 70 L 83 78 A 3 3 0 0 1 80 81 H 20 A 3 3 0 0 1 17 78 Z'); }
        }
        @keyframes chem-bubble-1 {
          0% { transform: translateY(0) scale(0.4); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
        }
        @keyframes chem-bubble-2 {
          0% { transform: translateY(0) scale(0.3); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateY(-52px) scale(1); opacity: 0; }
        }
        @keyframes chem-bubble-3 {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-30px) scale(1.3); opacity: 0; }
        }
        @keyframes chem-bubble-4 {
          0% { transform: translateY(0) scale(0.4); opacity: 0; }
          25% { opacity: 1; }
          85% { opacity: 0.9; }
          100% { transform: translateY(-45px) scale(0.8); opacity: 0; }
        }
        @keyframes chem-steam {
          0% { transform: translateY(0) translateX(0) scale(0.8); opacity: 0; }
          50% { opacity: 0.4; transform: translateY(-10px) translateX(2px) scale(1.1); }
          100% { transform: translateY(-22px) translateX(-2px) scale(1.3); opacity: 0; }
        }
        .animate-chem-slosh {
          animation: chem-slosh 2.5s ease-in-out infinite;
        }
        .animate-chem-bubble-1 {
          animation: chem-bubble-1 1.8s ease-in-out infinite;
        }
        .animate-chem-bubble-2 {
          animation: chem-bubble-2 2.2s ease-in-out infinite;
        }
        .animate-chem-bubble-3 {
          animation: chem-bubble-3 1.5s ease-in-out infinite;
        }
        .animate-chem-bubble-4 {
          animation: chem-bubble-4 2s ease-in-out infinite;
        }
        .animate-chem-steam {
          animation: chem-steam 2.5s ease-in-out infinite;
        }
      `}} />

      {/* Main Loader Graphic */}
      <div className={`relative ${currentSizeClass} flex items-center justify-center`}>
        
        {/* Orbital Atom Ring 1 */}
        <div className="absolute inset-0 rounded-full border border-dashed border-primary/25 animate-[spin_8s_linear_infinite]" />
        
        {/* Orbital Atom Ring 2 */}
        <div className="absolute inset-0 rounded-full border border-dashed border-accent/20 rotate-45 animate-[spin_12s_linear_infinite_reverse]" />

        {/* Orbiting Electron 1 */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full"
        >
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary shadow-glow shadow-primary animate-pulse" />
        </motion.div>

        {/* Orbiting Electron 2 */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full rotate-[120deg]"
        >
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-accent-glow animate-pulse" />
        </motion.div>

        {/* The Flask SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-4/5 h-4/5 z-10 drop-shadow-[0_0_15px_rgba(var(--primary),0.2)]"
        >
          {/* Steam / Fumes from Neck */}
          <path d="M48 10 Q50 6 52 10 Q54 14 50 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-accent/60 animate-chem-steam" style={{ animationDelay: '0s' }} />
          <path d="M52 12 Q54 8 50 12 Q48 16 52 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary/40 animate-chem-steam" style={{ animationDelay: '1.2s' }} />
          
          {/* Flask Outer Glass Frame */}
          <path 
            d="M38 20 H62 M41 20 V33 L18 78 A 4 4 0 0 0 22 83 H78 A 4 4 0 0 0 82 78 L59 33 V20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-foreground/20 dark:text-foreground/30"
          />

          {/* Liquid Level Indicator Markings */}
          <line x1="33" y1="55" x2="38" y2="55" stroke="currentColor" strokeWidth="2" className="text-foreground/15 dark:text-foreground/20" />
          <line x1="28" y1="65" x2="35" y2="65" stroke="currentColor" strokeWidth="2" className="text-foreground/15 dark:text-foreground/20" />
          <line x1="23" y1="75" x2="30" y2="75" stroke="currentColor" strokeWidth="2" className="text-foreground/15 dark:text-foreground/20" />

          {/* Colored Chemical Liquid inside Flask */}
          <path 
            d="M20 70 C 32 67, 42 73, 50 70 C 58 67, 68 73, 80 70 L 83 78 A 3 3 0 0 1 80 81 H 20 A 3 3 0 0 1 17 78 Z"
            fill="url(#chemLiquidGrad)" 
            className="animate-chem-slosh"
          />

          {/* Glowing Highlight line inside liquid */}
          <path 
            d="M22 75 Q 50 78 78 75" 
            fill="none" 
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            className="pointer-events-none" 
          />

          {/* Boiling Bubbles inside liquid */}
          {/* Bubble 1 */}
          <circle cx="45" cy="74" r="3.5" fill="url(#bubbleGrad)" className="animate-chem-bubble-1" />
          {/* Bubble 2 */}
          <circle cx="56" cy="76" r="2.5" fill="url(#bubbleGrad)" className="animate-chem-bubble-2" />
          {/* Bubble 3 */}
          <circle cx="34" cy="75" r="4" fill="url(#bubbleGrad)" className="animate-chem-bubble-3" />
          {/* Bubble 4 */}
          <circle cx="63" cy="73" r="3" fill="url(#bubbleGrad)" className="animate-chem-bubble-4" />

          {/* Gradients definitions */}
          <defs>
            {/* Primary Chemical Gradient */}
            <linearGradient id="chemLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 72%, 45%)" />
              <stop offset="60%" stopColor="hsl(0, 72%, 35%)" />
              <stop offset="100%" stopColor="hsl(350, 70%, 25%)" />
            </linearGradient>
            
            {/* Glossy Bubbles Gradient */}
            <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
              <stop offset="100%" stopColor="hsl(0, 72%, 45%)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Glowing glass reflection effect */}
        <div className="absolute w-[18%] h-[35%] bg-gradient-to-r from-white/25 to-transparent -rotate-[22deg] top-[30%] left-[28%] rounded-full blur-[1px] pointer-events-none z-20" />
      </div>

      {/* Welcome & Shifting Subtitle */}
      {showText && (
        <div className="text-center space-y-1.5 sm:space-y-2 max-w-sm sm:max-w-md px-4 shrink-0">
          <h2 className="text-base sm:text-lg md:text-2xl font-medium tracking-wide text-muted-foreground/90 font-heading">
            Welcome to
          </h2>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-heading leading-tight">
            Ruchi Upadhyay Classes
          </h1>
          <div className="h-6 overflow-hidden flex items-center justify-center mt-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={textIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="text-[10px] sm:text-xs md:text-sm font-bold tracking-widest text-muted-foreground uppercase text-center"
              >
                {funChemistryTexts[textIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChemistryLoader;
