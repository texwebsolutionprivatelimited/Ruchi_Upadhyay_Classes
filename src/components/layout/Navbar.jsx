import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileDropdown from '@/components/layout/ProfileDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin, useHasCourses } from '@/hooks/useAdmin';
import ruchiLogo from '@/assets/ruchi-logo.png';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'All Courses', path: '/courses' },
  { name: 'Classes', path: '/Ytclass' },
  { name: 'Notes', path: '/notes' },
  { name: 'Tests', path: '/tests' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const { data: hasCourses } = useHasCourses();

  const { data: showLeaderboard } = useQuery({
    queryKey: ['navbar-leaderboard-eligibility', user?.id],
    queryFn: async () => {
      if (!user) return false;
      try {
        const { count: courseCount, error: courseError } = await supabase
          .from('user_courses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (courseError) throw courseError;

        if (courseCount && courseCount > 0) return true;

        const { count: testCount, error: testError } = await supabase
          .from('test_results')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (testError) throw testError;

        return (testCount && testCount > 0);
      } catch (err) {
        console.error('Error checking leaderboard eligibility:', err);
        return false;
      }
    },
    enabled: !!user,
    initialData: false,
  });

  const filteredNavLinks = navLinks.filter(link => {
    // Only show All Courses if admin has created at least one course
    if (link.path === '/courses' && !hasCourses) {
      return false;
    }
    if (link.path === '/leaderboard') {
      return showLeaderboard;
    }
    return true;
  });

  const isLinkActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-card/85 backdrop-blur-md shadow-lg border-b border-border/80' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-14 md:h-16' : 'h-20 md:h-24'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={ruchiLogo} 
              alt="Logo" 
              className={`transition-all duration-300 w-auto ${
                scrolled ? 'h-8 md:h-10' : 'h-11 md:h-15'
              }`} 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {filteredNavLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`relative text-base font-semibold transition-colors hover:text-primary ${
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div 
                      layoutId="navbar-indicator" 
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full shadow-sm" 
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop/Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="hidden sm:block">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" aria-label="Admin Panel">
                      <Shield className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <ProfileDropdown />
              </div>
            ) : (
              <Link to="/login" className="hidden lg:block">
                <Button variant="gradient" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-xl hover:bg-secondary transition-colors border border-transparent active:border-primary/20"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="lg:hidden fixed inset-x-4 top-24 z-50 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden shadow-primary/5"
          >
            <div className="p-4 space-y-1">
              {filteredNavLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)} 
                    className={`flex items-center px-4 py-3 md:py-3.5 rounded-xl font-semibold text-base md:text-lg transition-all ${
                      active
                        ? 'bg-primary/10 text-primary font-bold shadow-xs'
                        : 'text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-border space-y-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)} className="block">
                        <Button variant="outline" className="w-full justify-start h-11 md:h-12 border-primary/50 text-primary hover:text-primary hover:border-primary hover:bg-primary/15 rounded-xl text-sm md:text-base transition-all">
                          <Shield className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="gradient" className="w-full h-11 md:h-12 rounded-xl text-sm md:text-base font-bold">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
