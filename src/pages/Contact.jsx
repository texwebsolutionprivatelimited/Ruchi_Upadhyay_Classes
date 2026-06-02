import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    content: '123 Chemistry Lane, Education City, India - 110001',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Phone,
    title: 'Call Us',
    content: '+91 98765 43210',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Mail,
    title: 'Email Us',
    content: 'contact@ruchichemistry.com',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    content: 'Mon - Sat: 9:00 AM - 8:00 PM',
    color: 'bg-warning/10 text-warning',
  },
];
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };
  return (<div className="min-h-screen bg-background">
    <Navbar />

    <main className="pt-20 md:pt-24 pb-16">
      {/* Hero Section */}
      <section className="pt-6 pb-8 md:pt-8 md:pb-10 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">We're Here to Help</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Get In <span className="text-primary">Touch</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have questions about our courses? Want to enroll? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (<motion.div key={info.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-2xl p-6 border border-border shadow-lg text-center">
              <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center mx-auto mb-4`}>
                <info.icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
                {info.title}
              </h3>
              <p className="text-muted-foreground text-sm">{info.content}</p>
            </motion.div>))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-5 sm:p-8 border border-border shadow-lg space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-card-foreground mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-muted-foreground">
                    Fill out the form and we'll get back to you within 24 hours.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Full Name *
                    </label>
                    <Input placeholder="Enter your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Email *
                      </label>
                      <Input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Phone *
                      </label>
                      <Input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Subject
                    </label>
                    <Input placeholder="What is this regarding?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Message *
                    </label>
                    <Textarea placeholder="Tell us how we can help you..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              {/* Map Placeholder */}
              <div className="bg-card rounded-2xl overflow-hidden border border-border h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-sm">Coming Soon</p>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
                <h3 className="text-xl font-heading font-bold text-card-foreground mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-card-foreground">How can I enroll in a course?</h4>
                    <p className="text-sm text-muted-foreground">
                      You can enroll online through our courses page or visit our center.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground">Do you offer demo classes?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! We offer free demo classes for all courses.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground">What are the batch timings?</h4>
                    <p className="text-sm text-muted-foreground">
                      We have morning, evening, and weekend batches available.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>);
};
export default Contact;
