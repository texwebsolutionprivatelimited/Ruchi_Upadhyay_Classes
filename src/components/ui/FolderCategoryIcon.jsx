import React from 'react';
import {
  GraduationCap,
  BookOpen,
  FlaskConical,
  Beaker,
  Atom,
  Cpu,
  Target,
  Sparkles,
  Layers,
  Folder,
  Award,
  Globe,
  Dna,
} from 'lucide-react';

// Maps any category name or icon hint to a high quality Lucide icon component
export const getFolderLucideIcon = (categoryName, iconHint) => {
  const name = String(categoryName || '').toLowerCase().trim();
  const hint = String(iconHint || '').toLowerCase().trim();

  // Explicit hints
  if (hint.includes('grad') || hint.includes('cap') || hint.includes('🎓')) return GraduationCap;
  if (hint.includes('cpu') || hint.includes('eng') || hint.includes('⚙')) return Cpu;
  if (hint.includes('flask') || hint.includes('chem') || hint.includes('🧪')) return FlaskConical;
  if (hint.includes('beaker') || hint.includes('⚗')) return Beaker;
  if (hint.includes('atom') || hint.includes('physics')) return Atom;
  if (hint.includes('target') || hint.includes('jee') || hint.includes('🎯')) return Target;
  if (hint.includes('book') || hint.includes('read') || hint.includes('📖') || hint.includes('📘') || hint.includes('📚')) return BookOpen;

  // Name based heuristics
  if (name.includes('10')) return GraduationCap;
  if (name.includes('9')) return BookOpen;
  if (name.includes('11')) return Atom;
  if (name.includes('12')) return Award;
  if (name.includes('engineering') || name.includes('polytechnic') || name.includes('applied')) return Cpu;
  if (name.includes('organic')) return FlaskConical;
  if (name.includes('physical')) return Beaker;
  if (name.includes('inorganic')) return Dna;
  if (name.includes('environment') || name.includes('eco') || name.includes('earth')) return Globe;
  if (name.includes('jee') || name.includes('neet') || name.includes('entrance') || name.includes('competitive')) return Target;
  if (name.includes('foundation') || name.includes('basic')) return BookOpen;

  return Layers;
};

/**
 * Renders a crisp vector icon inside a modern styled squircle badge.
 * Guaranteed: NO EMOJIS!
 */
export const FolderCategoryIcon = ({
  category = '',
  iconHint = '',
  className = 'w-13 h-13 rounded-2xl',
  iconClassName = 'w-6 h-6',
  variant = 'default', // 'default', 'subtle', 'accent'
}) => {
  const IconComponent = getFolderLucideIcon(category, iconHint);

  const variantStyles = {
    default: 'bg-primary/10 text-primary border border-primary/20 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary',
    accent: 'bg-accent/15 text-accent border border-accent/25 shadow-sm group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent',
    subtle: 'bg-secondary text-foreground/80 border border-border/80 shadow-sm',
  };

  return (
    <div
      className={`flex items-center justify-center shrink-0 transition-all duration-300 ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      <IconComponent className={`transition-transform duration-300 group-hover:scale-110 ${iconClassName}`} />
    </div>
  );
};

export default FolderCategoryIcon;
