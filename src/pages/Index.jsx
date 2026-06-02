import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Trophy, Star, Award, Play } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroBannerCarousel from '@/components/home/HeroBannerCarousel';
import HeroContent from '@/components/home/HeroContent';
import MarqueeSection from '@/components/home/MarqueeSection';
import VideosMarquee from '@/components/home/VideosMarquee';
import ChemistryUniverse from '@/components/home/ChemistryUniverse';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import CourseCard from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/button';
import Counter from '@/components/home/Counter';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      return data.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        instructor: course.instructor,
        price: course.price,
        originalPrice: course.original_price,
        image: course.image_url || '/placeholder.svg',
        category: course.category,
        duration: course.duration || '0 hours',
        lessons: course.lessons || 0,
        level: course.level || 'Beginner',
        rating: 4.8,
        students: 0,
        xpReward: course.xp_reward || 0,
        language: 'English',
        status: 'Active'
      }));
    },
  });

  const { data: badges, isLoading: badgesLoading } = useQuery({
    queryKey: ['public-badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  const MOCK_BADGES = [
    { id: 'mock-b1', name: 'First Reaction', description: 'Complete your first chemistry lesson', icon: '🧪', color: 'bg-emerald-500 text-white' },
    { id: 'mock-b2', name: 'Quick Learner', description: 'Complete 5 lessons in a single day', icon: '⚡', color: 'bg-amber-500 text-white' },
    { id: 'mock-b3', name: 'Streak Master', description: 'Maintain a 7-day learning streak', icon: '🔥', color: 'bg-rose-500 text-white' },
    { id: 'mock-b4', name: 'Quiz Champion', description: 'Score 100% on 3 chemical quizzes', icon: '🏆', color: 'bg-indigo-500 text-white' },
    { id: 'mock-b5', name: 'Periodic Guru', description: 'Master elements in periodic table challenges', icon: '⚛️', color: 'bg-purple-500 text-white' },
  ];

  const featuredCourses = courses || [];
  const displayBadges = badgesLoading
    ? MOCK_BADGES
    : [
        ...(badges || []).map(b => ({
          id: b.id,
          name: b.name,
          description: b.description,
          icon: b.icon,
          color: b.color || 'bg-primary'
        })),
        ...MOCK_BADGES.filter(mock => !(badges || []).some(db => db.name.toLowerCase() === mock.name.toLowerCase()))
      ].slice(0, 5);

  const stats = [
    { icon: Users, label: 'Chemistry Students', value: '50K+', color: 'text-primary' },
    { icon: BookOpen, label: 'Video Lectures', value: '1000+', color: 'text-accent' },
    { icon: Trophy, label: 'Questions Solved', value: '500K+', color: 'text-success' },
    { icon: Star, label: 'Average Rating', value: '4.9', color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner Carousel - Clean banner only */}
      <HeroBannerCarousel />

      {/* Hero Content - Text below banner */}
      <HeroContent />

      {/* Marquee Announcements */}
      <MarqueeSection />

      {/* Stats Section */}
      <section className="py-12 md:py-16 border-b border-border overflow-hidden select-none">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-4 md:p-6 rounded-2xl hover:bg-secondary/30 transition-colors">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1">
                <Counter value={stat.value} />
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>))}
          </div>
        </div>
      </section>

      {/* Chemistry Universe */}
      <div className="overflow-hidden">
        <ChemistryUniverse />
      </div>

      {/* Why Choose Us */}
      <div className="overflow-hidden">
        <WhyChooseUs />
      </div>

      {/* YouTube Videos Marquee Section */}
      <VideosMarquee />

      {/* Featured Courses Section */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center text-center gap-6 mb-12">
            <div className="w-full">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                ✨ Learning Path
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
                Featured <span className="text-primary italic">Courses</span>
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {coursesLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-[400px] bg-secondary/50 rounded-2xl animate-pulse" />)
            ) : featuredCourses.length > 0 ? (
              featuredCourses.map((course, index) => (<CourseCard key={course.id} course={course} index={index} />))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">No featured courses available at the moment.</div>
            )}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline" size="default">
                View All Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <div className="overflow-hidden">
        <TestimonialsSection />
      </div>

      {/* Badges Showcase */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Achievements
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Collect Amazing Badges
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Earn badges as you progress through courses and complete challenges
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto w-full">
            {badgesLoading ? (
              [1, 2, 3, 4, 5].map(i => <div key={i} className="h-48 bg-secondary/50 rounded-2xl animate-pulse flex-1 min-w-[140px] sm:min-w-[180px] max-w-[210px]" />)
            ) : displayBadges.map((badge, index) => (
              <motion.div 
                key={badge.id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.05, type: 'spring' }} 
                whileHover={{ scale: 1.05 }} 
                className="flex flex-col items-center justify-between gap-4 p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-xl w-full min-h-[200px] flex-1 min-w-[140px] sm:min-w-[180px] max-w-[210px]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${badge.color || 'bg-primary'} flex items-center justify-center text-2xl md:text-3xl shadow-lg`}>
                    {badge.icon}
                  </div>
                  <span className="font-semibold text-card-foreground text-center text-sm md:text-base leading-snug">{badge.name}</span>
                  <span className="text-xs text-muted-foreground text-center leading-relaxed">
                    {badge.description}
                  </span>
                </div>
                
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest leading-none">
                  Unlocked
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="overflow-hidden">
        <FAQSection />
      </div>

      {/* Contact Section */}
      <div className="overflow-hidden">
        <ContactSection />
      </div>

      {/* CTA Section */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-background">
              Ready to Master Chemistry?
            </h2>
            <p className="text-xl text-background/80 max-w-2xl mx-auto">
              Join thousands of students who are acing their exams with Ruchi Upadhyay Classes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/courses">
                <Button variant="hero" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/Ytclass">
                <Button variant="outline" size="xl" className="border-background/30 text-background hover:bg-background/10 hover:text-background">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Video Classes
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Index;
