import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Grid, List, BookOpen } from 'lucide-react';
import ChemistryLoader from '@/components/ui/ChemistryLoader';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCoursesList } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
const categories = ['All', 'Class 10', 'Class 12', 'IIT-JEE', 'NEET', 'Engineering Chemistry', 'Environmental Science'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const validCategories = ['Class 10', 'Class 12', 'IIT-JEE', 'NEET', 'Engineering Chemistry', 'Environmental Science'];
const Courses = () => {
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [viewMode, setViewMode] = useState('grid');
  // Handle URL category param
  useEffect(() => {
    if (urlCategory) {
      // Find the proper display name for the slug
      const slugMap = {
        'class-10': 'Class 10',
        'class-12': 'Class 12',
        'iit-jee': 'IIT-JEE',
        'neet': 'NEET',
        'engineering': 'Engineering Chemistry',
        'environmental': 'Environmental Science'
      };
      const displayName = slugMap[urlCategory.toLowerCase()];
      if (displayName) {
        setSelectedCategory(displayName);
      }
    }
  }, [urlCategory]);
  const { data: dbCourses, isLoading } = useCoursesList();
  // Transform database courses to Course type
  const courses = (dbCourses || [])
    .filter(course => validCategories.includes(course.category))
    .map(course => ({
      id: course.id,
      title: course.title,
      description: course.description || '',
      instructor: course.instructor,
      price: course.price,
      originalPrice: course.original_price || undefined,
      image: course.image_url || '/placeholder.svg',
      category: course.category,
      duration: course.duration || '0 hours',
      lessons: course.lessons,
      level: course.level,
      rating: course.rating || 4.8,
      students: course.students || 0,
      xpReward: course.xp_reward,
      startDate: course.start_date || undefined,
      endDate: course.end_date || undefined,
      batchInfo: course.batch_info || undefined,
      status: course.status || 'upcoming',
      targetAudience: course.target_audience || undefined,
      whatsappLink: course.whatsapp_link || undefined,
      language: course.language || 'English',
    }));
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });
  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('courses-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'courses'
      }, () => {
        // The useCoursesList hook will automatically refetch
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (<div className="min-h-screen bg-background">
    <Navbar />

    <main className="pt-20 md:pt-24 pb-16">
      {/* Hero Section */}
      <section className="pt-6 pb-8 md:pt-8 md:pb-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 md:mb-6">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base font-medium">Our Courses</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Explore Our <span className="text-primary">Courses</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
              Discover hundreds of courses designed to help you master new skills and advance your career
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative px-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 md:h-14 text-base md:text-lg rounded-xl shadow-sm" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 md:py-8 border-b border-border overflow-hidden bg-white/5 backdrop-blur-sm sticky top-[80px] md:top-[96px] z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6">
            {/* Categories - Scrollable on mobile with gradient indicators */}
            <div className="relative -mx-4 px-4 md:mx-0 md:px-0 overflow-hidden">
              {/* Left Scroll Gradient */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background via-background/40 to-transparent z-10 pointer-events-none sm:hidden" />
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar scroll-smooth">
                {categories.map((category) => (<Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(category)} className="whitespace-nowrap rounded-full px-5 h-9 text-xs sm:text-sm font-medium transition-all duration-300">
                  {category}
                </Button>))}
              </div>

              {/* Right Scroll Gradient */}
              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background via-background/40 to-transparent z-10 pointer-events-none sm:hidden" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="hidden sm:block text-muted-foreground order-2 sm:order-1">
                Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span> courses
              </p>

              {/* Level & View */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-4 order-1 sm:order-2">
                <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="h-10 px-4 rounded-xl border border-border bg-card text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1 sm:flex-none sm:min-w-[140px]">
                  {levels.map((level) => (<option key={level} value={level}>{level}</option>))}
                </select>

                <div className="flex bg-secondary/50 rounded-xl p-1 shrink-0">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}>
                    <Grid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 sm:hidden px-1">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredCourses.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort:</span>
              <select className="h-8 px-2 rounded-lg border border-border bg-card text-card-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Popular</option>
                <option>Rated</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {isLoading ? (<div className="flex items-center justify-center py-10">
            <ChemistryLoader size="md" />
          </div>) : filteredCourses.length > 0 ? (<div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredCourses.map((course, index) => (<CourseCard key={course.id} course={course} index={index} />))}
          </div>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground mb-6">
              {courses.length === 0
                ? 'No courses have been added yet. Check back later!'
                : 'Try adjusting your search or filters'}
            </p>
            {courses.length > 0 && (<Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLevel('All Levels');
            }}>
              Clear Filters
            </Button>)}
          </motion.div>)}
        </div>
      </section>
    </main>

    <Footer />
  </div>);
};
export default Courses;
