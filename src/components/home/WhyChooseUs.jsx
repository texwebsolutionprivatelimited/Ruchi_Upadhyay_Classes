import { motion } from 'framer-motion';
import { GraduationCap, Video, FileText, Users, Clock, Award } from 'lucide-react';
const features = [
  {
    icon: GraduationCap,
    title: 'Expert Faculty',
    description: '10+ years of teaching experience with proven results',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Video,
    title: 'HD Video Lectures',
    description: 'Crystal clear video lessons available 24/7',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: FileText,
    title: 'Study Material',
    description: 'Comprehensive notes, PDFs, and practice papers',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Users,
    title: 'Doubt Sessions',
    description: 'Regular live doubt clearing sessions',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: Clock,
    title: 'Flexible Timing',
    description: 'Learn at your own pace, anytime, anywhere',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Award,
    title: 'Proven Results',
    description: '95%+ students score above 90% in exams',
    color: 'bg-accent/10 text-accent',
  },
];
const WhyChooseUs = () => {
  return (<section className="pt-8 pb-16 md:pt-12 md:pb-20">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
          <Award className="w-4 h-4" />
          Why Choose Us
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          The Best Chemistry Education
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience world-class chemistry education with our unique approach
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => (<motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }} className="bg-card rounded-2xl p-6 border border-border shadow-md hover:shadow-xl transition-all">
          <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}>
            <feature.icon className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-card-foreground mb-2">
            {feature.title}
          </h3>
          <p className="text-muted-foreground">
            {feature.description}
          </p>
        </motion.div>))}
      </div>
    </div>
  </section>);
};
export default WhyChooseUs;
