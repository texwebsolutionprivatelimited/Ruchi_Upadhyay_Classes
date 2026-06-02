import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, BookOpen, ArrowRight, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ruchiLogo from '@/assets/ruchi-logo.png';
import { useAuth } from '@/contexts/AuthContext';
import { useReferrals } from '@/hooks/useReferrals';
import { z } from 'zod';
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});
const Login = () => {
  const [searchParams] = useSearchParams();
  const referralFromUrl = searchParams.get('ref');
  useEffect(() => {
    if (referralFromUrl) {
      console.log('📍 Storing referral code:', referralFromUrl);
      localStorage.setItem('pending_referral', referralFromUrl);
    }
  }, [referralFromUrl]);
  const [isLogin, setIsLogin] = useState(!referralFromUrl);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { signIn, signUp, user } = useAuth();
  const { applyReferralCode } = useReferrals();
  const navigate = useNavigate();
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    try {
      // Validate form data
      const schema = isLogin ? loginSchema : signupSchema;
      const result = schema.safeParse(formData);
      if (!result.success) {
        const fieldErrors = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate('/profile');
        }
      }
      else {
        const { user: newUser, error } = await signUp(formData.email, formData.password, formData.name);
        if (!error && newUser) {
          // Apply referral code if exists
          if (referralFromUrl) {
            console.log('🎁 Applying referral code for new user:', newUser.id);
            // Small delay to ensure DB trigger creates the profile first
            setTimeout(async () => {
              await applyReferralCode(referralFromUrl, newUser.id);
            }, 500);
          }
          navigate('/profile');
        }
      }
    }
    catch (error) {
      console.error('Auth error:', error);
    }
    finally {
      setIsSubmitting(false);
    }
  };
  return (<div className="min-h-screen grid lg:grid-cols-2">
    {/* Left - Form */}
    <div className="flex items-center justify-center p-5 sm:p-8 py-12 sm:py-8">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={ruchiLogo} alt="Ruchi Upadhyay Classes" className="h-14 w-auto" />
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            {isLogin ? 'Welcome back!' : 'Create account'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin
              ? 'Sign in to continue your learning journey'
              : 'Start your learning journey today'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-12 h-12" />
            </div>
            {errors.name && (<p className="text-destructive text-sm mt-1">{errors.name}</p>)}
          </motion.div>)}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-12 h-12" />
            </div>
            {errors.email && (<p className="text-destructive text-sm mt-1">{errors.email}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-12 pr-12 h-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (<p className="text-destructive text-sm mt-1">{errors.password}</p>)}
          </div>

          {isLogin && (<div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>)}

          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (<>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isLogin ? 'Signing In...' : 'Creating Account...'}
            </>) : (<>
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>)}
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center text-muted-foreground">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => {
            setIsLogin(!isLogin);
            setErrors({});
          }} className="text-primary font-medium hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>

    {/* Right - Hero */}
    <div className="hidden lg:flex gradient-hero relative overflow-hidden">
      {/* Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="flex items-center justify-center w-full p-12">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="text-center space-y-8">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-32 h-32 mx-auto rounded-3xl gradient-accent flex items-center justify-center shadow-2xl">
            <BookOpen className="w-16 h-16 text-accent-foreground" />
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-4xl font-heading font-bold text-background">
              Start Learning Today
            </h2>
            <p className="text-xl text-background/80 max-w-md">
              Join 100,000+ learners and transform your career with our gamified learning platform
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {['500+ Courses', '50K+ Hours', '4.9 Rating'].map((stat) => (<div key={stat} className="px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm text-background text-sm font-medium">
              {stat}
            </div>))}
          </div>
        </motion.div>
      </div>
    </div>
  </div>);
};
export default Login;
