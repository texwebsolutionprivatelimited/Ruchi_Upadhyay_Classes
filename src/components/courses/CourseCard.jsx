import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, Clock, Users, Zap, BookOpen, CheckCircle, Loader2, Play, Calendar, GraduationCap, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
const CourseCard = ({ course, index = 0, showProgress = false }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { enrollInCourse, isEnrolled, getProgress, refetch } = useCourses();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id);
  // Refetch when location changes (e.g., navigating back from course details)
  useEffect(() => {
    if (enrolled && user) {
      refetch();
    }
  }, [location.pathname, enrolled, user]);
  const discount = course.originalPrice
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0;
  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setIsEnrolling(true);
    await enrollInCourse(course.id);
    setIsEnrolling(false);
  };
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/course/${course.id}`;
    const shareData = {
      title: course.title,
      text: `Check out this course: ${course.title}`,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      }
      else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Course link copied to clipboard.",
        });
      }
    }
    catch (err) {
      console.error('Error sharing:', err);
    }
  };
  return (<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group">
    <Link to={`/course/${course.id}`} className="block">
      <div className="glass-card hover-lift transition-all duration-500 border-primary/5 overflow-hidden rounded-2xl relative">
        {/* Status Badge - Top Left */}
        {course.status && (<div className="absolute top-0 left-0 z-20">
          <div className="bg-accent text-accent-foreground px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-xl" style={{
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)'
          }}>
            {course.status}
          </div>
        </div>)}

        {/* Enhanced Image Section */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          {course.image ? (<img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />) : (<>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-white/40 group-hover:text-white/60 transition-colors duration-300" />
            </div>
          </>)}

          {/* Overlay gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Top Right Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
            {course.language && (<Badge className="bg-white text-gray-900 shadow-xl font-bold border-0">
              {course.language}
            </Badge>)}
            <button onClick={handleShare} className="bg-white hover:bg-gray-100 text-gray-900 p-2 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border-0">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Category Badge - Bottom Left */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="px-4 py-1.5 rounded-lg shadow-xl bg-primary text-primary-foreground text-[10px] md:text-xs font-bold tracking-widest uppercase border border-white/10">
              {course.category}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3.5 sm:p-6 space-y-4">
          {/* Title and Enrollment Status */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading font-bold text-base sm:text-xl text-card-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight flex-1">
                {course.title}
              </h3>
              {enrolled && (<Badge className="bg-success text-success-foreground shadow-sm shrink-0 h-5 px-2 text-[10px] font-bold">
                <CheckCircle className="w-3 h-3 mr-1" />
                Enrolled
              </Badge>)}
            </div>

            <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">{course.instructor}</span>
            </div>
          </div>

          {/* Target Audience */}
          {course.targetAudience && (<div className="flex items-center gap-2 text-[10px] md:text-sm text-foreground bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 shadow-sm w-fit">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold tracking-wide uppercase">{course.targetAudience}</span>
          </div>)}

          {/* Date Information */}
          {(course.startDate || course.endDate) && (<div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {course.startDate && `Starts on ${new Date(course.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              {course.startDate && course.endDate && ' • '}
              {course.endDate && `Ends on ${new Date(course.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            </span>
          </div>)}

          {/* Stats Row */}
          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm flex-wrap">
            <div className="flex items-center gap-1.5 text-foreground bg-secondary px-2.5 py-1.5 rounded-lg border border-border shadow-sm">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground bg-secondary px-2.5 py-1.5 rounded-lg border border-border shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold">{course.lessons} lessons</span>
            </div>
            <div className="flex items-center gap-1.5 bg-warning text-warning-foreground px-2.5 py-1.5 rounded-lg shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-black">{course.rating}</span>
            </div>
          </div>

          {/* Students and XP */}
          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 text-xs sm:text-sm">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-medium">{course.students.toLocaleString()} students</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-warning text-warning-foreground text-[11px] md:text-xs font-black shadow-md border border-white/10 shrink-0">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              +{course.xpReward} XP
            </div>
          </div>

          {/* Price Section */}
          <div className="pt-4 border-t border-primary/5 space-y-3">
            <div className="flex items-baseline flex-wrap gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-primary">₹{course.price}</span>
              {course.originalPrice && (<span className="text-base sm:text-lg text-muted-foreground line-through">
                ₹{course.originalPrice}
              </span>)}
              {discount > 0 && (<Badge className="bg-success text-success-foreground shadow-md text-xs font-bold px-2 py-1">
                <Zap className="w-3.5 h-3.5 mr-1 fill-current" />
                {discount}% OFF
              </Badge>)}
            </div>
            {!enrolled && course.originalPrice && (<p className="text-[10px] sm:text-xs text-muted-foreground">(FOR FULL BATCH)</p>)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {!enrolled ? (<>
              <Button variant="outline" size="sm" className="flex-1 border-primary/30 hover:bg-primary/5 text-primary font-bold rounded-xl btn-premium-hover">
                EXPLORE
              </Button>
              <Button variant="gradient" size="sm" onClick={handleEnroll} disabled={isEnrolling} className="flex-1 btn-premium-hover shadow-lg font-bold rounded-xl">
                {isEnrolling ? (<>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Enrolling...
                </>) : ('BUY NOW')}
              </Button>
            </>) : (<div className="flex justify-center">
              <Button variant="gradient" className="w-auto px-8 h-9 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-full group/btn relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                <span className="text-xs font-bold tracking-wide mr-2">RESUME</span>
                <Play className="w-3 h-3 fill-current group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </div>)}
          </div>
        </div>
      </div>
    </Link>
  </motion.div>);
};
export default CourseCard;
