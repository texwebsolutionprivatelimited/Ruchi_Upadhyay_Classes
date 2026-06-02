import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroContent = () => {
  return (<section className="pt-4 pb-16 md:pt-6 md:pb-20 bg-gradient-to-b from-secondary/50 to-background">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] sm:text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Welcome to Ruchi Upadhyay Classes
        </span>

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-4 sm:mb-6 leading-tight">
          Master Chemistry with{' '}
          <span className="text-primary italic">Expert Guidance</span>
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
          Comprehensive coaching for Class 10, Class 12, IIT-JEE, NEET, Engineering Chemistry & Environmental Science
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/courses" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Explore Courses
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/Ytclass" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <Play className="w-5 h-5" />
              Watch Classes
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>);
};

export default HeroContent;
