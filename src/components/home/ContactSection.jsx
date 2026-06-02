import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    content: 'Bhopal, MP - 462022',
  },
  {
    icon: Phone,
    title: 'Phone',
    content: '+91 72258 14452',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'info@ruchiupadhyay.in',
  },
  {
    icon: Clock,
    title: 'Timings',
    content: 'Mon - Sat: 5:00 PM - 10:00 PM',
  },
];
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };
  return (<section className="pt-8 pb-16 md:pt-12 md:pb-20" id="contact">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Phone className="w-4 h-4" />
          Get In Touch
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          Contact Us
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message!
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
          <div className="bg-card rounded-2xl p-4 sm:p-8 border border-border shadow-lg">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-card-foreground mb-6">
              Contact Information
            </h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (<motion.div key={info.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex items-start gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <info.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-card-foreground text-sm md:text-base">{info.title}</h4>
                  <p className="text-muted-foreground text-sm break-words">{info.content}</p>
                </div>
              </motion.div>))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-card rounded-2xl overflow-hidden border border-border h-[180px] sm:h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p>Interactive Map Coming Soon</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-4 sm:p-8 border border-border shadow-lg space-y-6">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-card-foreground mb-6">
              Send a Message
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Full Name
                </label>
                <Input placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Email
                  </label>
                  <Input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Phone
                  </label>
                  <Input type="tel" placeholder="+91 72258 14452" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Message
                </label>
                <Textarea placeholder="How can we help you?" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  </section>);
};
export default ContactSection;
