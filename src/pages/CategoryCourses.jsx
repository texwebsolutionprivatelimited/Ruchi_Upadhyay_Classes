import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Users, BookOpen, Star, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePublicCourses } from '@/hooks/usePublicCourses';
import { useCategories } from '@/hooks/useCategories';

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const CategoryCourses = () => {
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  const { data: categories } = useCategories();
  const { data: allCourses, isLoading: coursesLoading } = usePublicCourses();

  const categoryInfo = categories?.find((c) => c.slug === category);

  if (!categoryInfo) {
    return (<div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {coursesLoading ? 'Loading...' : 'Category Not Found'}
        </h1>
        <Link to="/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
      <Footer />
    </div>);
  }

  const categoryCourses = allCourses?.filter((course) => course.category === categoryInfo.name) || [];

  const filteredCourses = categoryCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const totalStudents = categoryCourses.reduce((sum, c) => sum + (c.students || 0), 0);
  const avgRating = categoryCourses.length > 0
    ? (categoryCourses.reduce((sum, c) => sum + (c.rating || 0), 0) / categoryCourses.length).toFixed(1)
    : '0';

  const relatedCategories = categories?.filter((c) => c.slug !== category).slice(0, 3) || [];

  return (<div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero Section */}
    <section className={`pt-24 pb-16 bg-gradient-to-br ${categoryInfo.gradient}`}>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <Link to="/courses">
            <Button variant="outline" size="sm" className="text-white hover:bg-white/10 border-white/20 bg-white/5 backdrop-blur-sm shadow-sm transition-all rounded-xl mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Courses
            </Button>
          </Link>

          <div className="text-6xl mb-4">{categoryInfo.icon}</div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white">
            {categoryInfo.name} Chemistry
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {categoryInfo.description}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-6">
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">{categoryCourses.length} Courses</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              <span className="font-semibold">{totalStudents.toLocaleString()} Students</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-semibold">{avgRating} Rating</span>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto relative pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground mt-2" />
            <Input placeholder={`Search ${categoryInfo.name} courses...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-background focus:text-foreground" />
          </div>
        </motion.div>
      </div>
    </section>

    {/* Filters */}
    <section className="py-6 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by level:</span>
            {levels.map((level) => (<Button key={level} variant={selectedLevel === level ? 'default' : 'secondary'} size="sm" onClick={() => setSelectedLevel(level)}>
              {level}
            </Button>))}
          </div>
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span> courses
          </p>
        </div>
      </div>
    </section>

    {/* Courses Grid */}
    <section className="py-12">
      <div className="container mx-auto px-4">
        {filteredCourses.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course, index) => (<CourseCard key={course.id} course={course} index={index} />))}
        </div>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
            No courses found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery('');
            setSelectedLevel('All Levels');
          }}>
            Clear Filters
          </Button>
        </motion.div>)}
      </div>
    </section>

    {/* Related Categories */}
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-8 text-center">
          Explore Other Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedCategories.map((cat, index) => (<motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
            <Link to={`/courses/${cat.slug}`}>
              <div className={`p-6 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white hover:scale-105 transition-transform`}>
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-heading font-semibold text-lg mb-1">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.description}</p>
              </div>
            </Link>
          </motion.div>))}
        </div>
      </div>
    </section>

    <Footer />
  </div>);
};
export default CategoryCourses;
