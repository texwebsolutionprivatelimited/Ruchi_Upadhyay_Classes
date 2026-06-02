import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Play, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
const slides = [
    {
        id: 1,
        title: 'Master New Skills',
        subtitle: 'Learn & Earn Rewards',
        description: 'Join 100,000+ learners transforming their careers with gamified learning experiences.',
        image: '/placeholder.svg',
        stats: { students: '100K+', courses: '500+', rating: '4.9' },
        gradient: 'from-primary/20 via-transparent to-accent/20',
    },
    {
        id: 2,
        title: 'Compete & Win',
        subtitle: 'Gamified Learning',
        description: 'Earn XP, unlock badges, and climb the leaderboard while mastering new skills.',
        image: '/placeholder.svg',
        stats: { students: '50K+', courses: '200+', rating: '4.8' },
        gradient: 'from-accent/20 via-transparent to-success/20',
    },
    {
        id: 3,
        title: 'Expert Instructors',
        subtitle: 'Learn from the Best',
        description: 'Industry professionals sharing real-world knowledge and practical skills.',
        image: '/placeholder.svg',
        stats: { students: '75K+', courses: '350+', rating: '4.9' },
        gradient: 'from-success/20 via-transparent to-primary/20',
    },
];
const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (titleRef.current) {
            gsap.fromTo(titleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }
    }, [currentSlide]);
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    return (<div ref={heroRef} className="relative min-h-[90vh] overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
        }}/>
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} transition-all duration-1000`}/>

      {/* Floating Elements */}
      <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-primary/10 blur-3xl"/>
      <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-accent/10 blur-3xl"/>

      <div className="container mx-auto px-4 relative z-10">
        <div className="min-h-[90vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5 }} className="space-y-8">
                <div className="space-y-4">
                  <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium">
                    <Star className="w-4 h-4 fill-current"/>
                    {slides[currentSlide].subtitle}
                  </motion.span>

                  <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-background leading-tight">
                    {slides[currentSlide].title}
                  </h1>

                  <p className="text-lg md:text-xl text-background/80 max-w-lg">
                    {slides[currentSlide].description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8">
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-primary">
                      <Users className="w-5 h-5"/>
                      <span className="text-2xl font-bold text-background">{slides[currentSlide].stats.students}</span>
                    </div>
                    <span className="text-sm text-background/60">Active Learners</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-accent">
                      <Play className="w-5 h-5"/>
                      <span className="text-2xl font-bold text-background">{slides[currentSlide].stats.courses}</span>
                    </div>
                    <span className="text-sm text-background/60">Courses</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-warning">
                      <Star className="w-5 h-5 fill-current"/>
                      <span className="text-2xl font-bold text-background">{slides[currentSlide].stats.rating}</span>
                    </div>
                    <span className="text-sm text-background/60">Average Rating</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-4">
                  <Button variant="hero" size="xl">
                    Start Learning Free
                  </Button>
                  <Button variant="outline" size="xl" className="border-background/30 text-background hover:bg-background/10 hover:text-background">
                    <Play className="w-5 h-5 mr-2"/>
                    Watch Demo
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Image/Illustration */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block relative">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 rounded-3xl gradient-primary opacity-20 blur-3xl"/>
                <div className="relative bg-card/10 backdrop-blur-sm rounded-3xl border border-background/10 p-8 h-full flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full gradient-accent flex items-center justify-center animate-bounce-gentle">
                      <Play className="w-16 h-16 text-accent-foreground"/>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-heading font-bold text-background">Ready to Start?</h3>
                      <p className="text-background/60">Begin your learning journey today</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-3">
              {slides.map((_, index) => (<button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'w-8 bg-primary'
                : 'w-2 bg-background/30 hover:bg-background/50'}`}/>))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button onClick={prevSlide} className="p-3 rounded-full bg-background/10 hover:bg-background/20 text-background transition-colors">
                <ChevronLeft className="w-5 h-5"/>
              </button>
              <button onClick={nextSlide} className="p-3 rounded-full bg-background/10 hover:bg-background/20 text-background transition-colors">
                <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default HeroCarousel;
