import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What courses are available on this platform?',
    answer: 'We offer comprehensive chemistry courses for Class 10, Class 12, IIT-JEE, NEET, Engineering Chemistry, and Environmental Science. Each course is designed by expert educators with years of experience.',
  },
  {
    question: 'How do I enroll in a course?',
    answer: 'Simply create an account, browse our courses, and click "Enroll Now" on any course you want to join. You can start learning immediately after enrollment.',
  },
  {
    question: 'Are there any free courses available?',
    answer: 'Yes! We offer several free courses and demo classes to help you get started. You can also access free notes and practice tests to supplement your learning.',
  },
  {
    question: 'What is the XP reward system?',
    answer: 'XP (Experience Points) is our gamification system that rewards you for completing courses, tests, and maintaining learning streaks. Earn XP to climb the leaderboard and unlock badges!',
  },
  {
    question: 'Can I access courses on mobile devices?',
    answer: 'Yes, our platform is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktops. Learn anytime, anywhere!',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee on all paid courses. If you\'re not satisfied with your purchase, contact us within 30 days for a full refund.',
  },
  {
    question: 'How can I contact support?',
    answer: 'You can reach our support team through the Contact page, email us at info@ruchiupadhyay.in, or call us at +91 72258 14452. We typically respond within 24 hours.',
  },
  {
    question: 'Are the courses self-paced?',
    answer: 'Yes, all our courses are self-paced. You can learn at your own speed and revisit lessons as many times as needed. There are no deadlines or time limits.',
  },
];

const FAQSection = () => {
  const halfLength = Math.ceil(faqs.length / 2);
  const leftColFaqs = faqs.slice(0, halfLength);
  const rightColFaqs = faqs.slice(halfLength);

  return (<section className="pt-8 pb-16 md:pt-12 md:pb-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <HelpCircle className="w-4 h-4" />
          <span className="font-medium text-xs sm:text-sm">FAQ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Got questions? We've got answers. Find everything you need to know about our courses and platform.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full"
      >
        {/* Left Column Accordion */}
        <Accordion type="single" collapsible className="space-y-4 w-full">
          {leftColFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-left-${index}`} 
              className="bg-card border border-border rounded-xl px-4 md:px-6 overflow-hidden hover:border-primary/20 transition-colors w-full"
            >
              <AccordionTrigger className="hover:no-underline py-4 md:py-5 text-left">
                <span className="font-semibold text-foreground text-sm sm:text-base">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 md:pb-5 text-muted-foreground text-xs sm:text-sm leading-relaxed text-left">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Right Column Accordion */}
        <Accordion type="single" collapsible className="space-y-4 w-full">
          {rightColFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-right-${index}`} 
              className="bg-card border border-border rounded-xl px-4 md:px-6 overflow-hidden hover:border-primary/20 transition-colors w-full"
            >
              <AccordionTrigger className="hover:no-underline py-4 md:py-5 text-left">
                <span className="font-semibold text-foreground text-sm sm:text-base">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 md:pb-5 text-muted-foreground text-xs sm:text-sm leading-relaxed text-left">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>);
};

export default FAQSection;
