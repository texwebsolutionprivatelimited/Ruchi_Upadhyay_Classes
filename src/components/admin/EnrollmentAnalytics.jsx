import { motion } from 'framer-motion';
import { Users, BookOpen, Trophy, TrendingUp, GraduationCap, Clock, Award, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEnrollmentAnalytics } from '@/hooks/useEnrollmentAnalytics';
const EnrollmentAnalytics = () => {
    const { data: analytics, isLoading } = useEnrollmentAnalytics();
    if (isLoading) {
        return (<div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/>
      </div>);
    }
    const stats = [
        {
            label: 'Total Enrollments',
            value: analytics?.totalEnrollments || 0,
            icon: Users,
            color: 'bg-primary',
            change: '+12%'
        },
        {
            label: 'Active Students',
            value: analytics?.activeStudents || 0,
            icon: GraduationCap,
            color: 'bg-accent',
            change: '+8%'
        },
        {
            label: 'Courses Completed',
            value: analytics?.totalCompletions || 0,
            icon: Trophy,
            color: 'bg-success',
            change: '+15%'
        },
        {
            label: 'Avg. Completion Rate',
            value: `${analytics?.avgCompletionRate || 0}%`,
            icon: TrendingUp,
            color: 'bg-warning',
            change: '+5%'
        },
    ];
    return (<div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-primary-foreground"/>
              </div>
              <Badge variant="secondary" className="text-success">
                {stat.change}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Popular Courses */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">Popular Courses</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground"/>
          </div>
          
          <div className="space-y-4">
            {analytics?.popularCourses && analytics.popularCourses.length > 0 ? (analytics.popularCourses.map((course, index) => (<div key={course.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-card-foreground truncate">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.enrollments} enrollments</p>
                  </div>
                  <Badge variant="secondary">{course.category}</Badge>
                </div>))) : (<div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50"/>
                <p>No enrollment data yet</p>
              </div>)}
          </div>
        </motion.div>

        {/* Completion Rates by Course */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">Completion Rates</h3>
            <Award className="w-5 h-5 text-muted-foreground"/>
          </div>
          
          <div className="space-y-5">
            {analytics?.courseCompletionRates && analytics.courseCompletionRates.length > 0 ? (analytics.courseCompletionRates.map((course) => (<div key={course.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-card-foreground text-sm truncate max-w-[200px]">
                      {course.title}
                    </p>
                    <span className="text-sm text-muted-foreground">{course.completionRate}%</span>
                  </div>
                  <Progress value={course.completionRate} className="h-2"/>
                </div>))) : (<div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-50"/>
                <p>No completion data yet</p>
              </div>)}
          </div>
        </motion.div>
      </div>

      {/* Recent Enrollments */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Recent Enrollments</h3>
          <Clock className="w-5 h-5 text-muted-foreground"/>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Course</th>
                <th className="pb-3 font-medium">Progress</th>
                <th className="pb-3 font-medium">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.recentEnrollments && analytics.recentEnrollments.length > 0 ? (analytics.recentEnrollments.map((enrollment) => (<tr key={enrollment.id} className="border-b border-border/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {enrollment.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-card-foreground">
                          {enrollment.username || 'Anonymous'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">{enrollment.courseTitle}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Progress value={enrollment.progress} className="h-2 w-20"/>
                        <span className="text-sm text-muted-foreground">{enrollment.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>))) : (<tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No enrollments yet
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>);
};
export default EnrollmentAnalytics;
