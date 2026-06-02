import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from '@/components/ui/accordion';
const courseFaqs = [
    {
        question: 'How long do I have access to this course?',
        answer: 'Once enrolled, you have lifetime access to this course. You can learn at your own pace and revisit the content anytime.',
    },
    {
        question: 'Is there a certificate upon completion?',
        answer: 'Yes! Upon completing all lessons and passing the final assessment, you will receive a certificate of completion that you can download and share.',
    },
    {
        question: 'Can I download the course materials?',
        answer: 'Yes, all downloadable resources including PDFs, notes, and practice problems can be downloaded for offline access.',
    },
    {
        question: 'What if I have questions during the course?',
        answer: 'You can reach out to our support team or post your questions in the course discussion section. Our instructors and community members are always ready to help.',
    },
    {
        question: 'Is there a refund policy?',
        answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with the course, contact us within 30 days of purchase for a full refund.',
    },
    {
        question: 'How many XP will I earn from this course?',
        answer: 'The XP reward is displayed on the course card. You earn XP upon completing the course, which helps you climb the leaderboard and unlock badges.',
    },
];
const CourseFAQ = ({ courseTitle }) => {
    return (<section className="py-12">
      <div className="container mx-auto px-4">
        <div className="lg:max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <HelpCircle className="w-4 h-4"/>
              <span className="font-medium">Course FAQ</span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Common questions about this course
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {courseFaqs.map((faq, index) => (<AccordionItem key={index} value={`course-faq-${index}`} className="bg-card border border-border rounded-xl px-6 overflow-hidden">
                <AccordionTrigger className="hover:no-underline py-4 text-left">
                  <span className="font-semibold text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>))}
          </Accordion>
        </div>
      </div>
    </section>);
};
export default CourseFAQ;
