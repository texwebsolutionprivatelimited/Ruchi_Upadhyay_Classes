import { motion } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const MOCK_TESTIMONIALS = [
  {
    id: 'mock-1',
    name: 'Priya Sharma',
    role: 'Class 12th Board - 98% in Chemistry',
    content: 'I went from struggling in physical chemistry to scoring 98% in my Boards! Ruchi ma\'am\'s detailed notes made formulas incredibly easy to master.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-2',
    name: 'Rahul Verma',
    role: 'IIT-JEE Prep Student (AIR-850)',
    content: 'Ruchi ma\'am\'s coaching style is elite. Her inorganic and organic lectures cleared my doubts and helped me secure AIR 850 in JEE Advanced!',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-3',
    name: 'Sneha Gupta',
    role: 'NEET Special Student (680+ Score)',
    content: 'The NEET mock tests and question-solving tricks were a lifesaver. I scored 680+ thanks to her amazing shortcuts for physical chemistry numericals!',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-4',
    name: 'Amit Patel',
    role: 'Class 10th Board - 100/100 in Science',
    content: 'I scored a perfect 100/100 in Science! Ruchi ma\'am makes basic reactions and equations so fun, simple, and visual.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-5',
    name: 'Divya Bansal',
    role: 'Class 9th Foundation - 99% in Chemistry',
    content: 'The foundation course for Class 9 made complex bonding and formulas incredibly easy and interesting, leading to a solid 99% in chemistry!',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-6',
    name: 'Karan Verma',
    role: 'Class 10th Board - Science Top Ranker',
    content: 'The board-oriented practice papers were spot-on! Ruchi ma\'am taught us how to write clear, perfect answers to score full marks in Class 10.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-7',
    name: 'Ananya Singh',
    role: 'B.Tech Engineering Chemistry Student',
    content: 'Even for college Engineering Chemistry, the crystalline lattice lectures explained here were outstanding. Ruchi ma\'am is simply the best!',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-8',
    name: 'Vikram Rathore',
    role: 'Environmental Science Student',
    content: 'The Environmental Science lectures were exceptionally detailed and practical. Her real-world case studies made it my highest-scoring subject!',
    rating: 5,
    createdAt: new Date().toISOString()
  },
];

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      console.log('Fetching testimonials from Supabase...');
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);
        if (error) throw error;
        return data || [];
      }
      catch (error) {
        console.error('Failed to fetch testimonials, falling back to empty list:', error);
        return [];
      }
    },
  });

  // Smart Merge: Database entries + non-overlapping Mock entries, limited to exactly 8 reviews for a balanced 4x2 grid
  const displayTestimonials = isLoading 
    ? MOCK_TESTIMONIALS 
    : [
        ...(testimonials || []).map(t => ({
          id: t.id,
          name: t.name,
          role: t.role,
          content: t.content,
          rating: t.rating,
          createdAt: t.created_at
        })),
        ...MOCK_TESTIMONIALS.filter(mock => !(testimonials || []).some(db => db.name.toLowerCase() === mock.name.toLowerCase()))
      ].slice(0, 8);

  return (<section className="pt-8 pb-16 md:pt-12 md:pb-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Quote className="w-4 h-4" />
          Student Testimonials
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          What Our Students Say
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Hear from our successful students who achieved their dreams
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayTestimonials.map((testimonial, index) => (<motion.div key={testimonial.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} className="bg-card rounded-2xl p-4 md:p-5 border border-border shadow-md relative flex flex-col justify-between min-h-[170px] md:min-h-[190px] transition-all">
          <div>
            {/* Quote icon */}
            <div className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-md">
              <Quote className="w-4 h-4 text-white" />
            </div>

            {/* Rating */}
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: testimonial.rating }).map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />))}
            </div>

            {/* Content */}
            <p className="text-muted-foreground text-xs md:text-sm mb-4 italic leading-relaxed">
              "{testimonial.content}"
            </p>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2.5 mt-2 pt-3 border-t border-border/50">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground text-xs md:text-sm leading-snug">{testimonial.name}</h4>
              <p className="text-[9px] text-muted-foreground font-medium mt-0.5 leading-none">{testimonial.role}</p>
            </div>
          </div>
        </motion.div>))}
      </div>
    </div>
  </section>);
};

export default TestimonialsSection;
