import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Search, BarChart3, PieChart, Activity, Settings, Bell, LogOut, Menu, X, FileText, ClipboardList, Video, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin, useNotes, useTests, useCoursesList } from '@/hooks/useAdmin';
import AdminNotes from '@/components/admin/AdminNotes';
import AdminTests from '@/components/admin/AdminTests';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminCurriculum from '@/components/admin/AdminCurriculum';
import AdminUsers from '@/components/admin/AdminUsers';
import EnrollmentAnalytics from '@/components/admin/EnrollmentAnalytics';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { data: notes } = useNotes();
  const { data: tests } = useTests();
  const { data: courses } = useCoursesList();

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin && user) {
      // User is logged in but not admin - show message
    }
  }, [isAdmin, isCheckingAdmin, user]);

  const stats = [
    { label: 'Total Courses', value: courses?.length || 0, change: '+5%', icon: BookOpen, color: 'bg-primary' },
    { label: 'Total Tests', value: tests?.length || 0, change: '+12%', icon: ClipboardList, color: 'bg-accent' },
    { label: 'Total Notes', value: notes?.length || 0, change: '+8%', icon: FileText, color: 'bg-success' },
    { label: 'Active Items', value: (courses?.filter(c => c.is_active).length || 0) + (tests?.filter(t => t.is_active).length || 0), change: '+15%', icon: Trophy, color: 'bg-warning' },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: Video },
    { id: 'tests', label: 'Tests', icon: ClipboardList },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'users', label: 'User Roles', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-4">You need to be logged in to access the admin panel.</p>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    </div>);
  }

  if (isCheckingAdmin) {
    return (<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    </div>);
  }

  if (!isAdmin) {
    return (<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4">
          You don't have admin privileges. Contact an administrator to get access.
        </p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    </div>);
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return <AdminCourses />;
      case 'curriculum':
        return <AdminCurriculum />;
      case 'tests':
        return <AdminTests />;
      case 'notes':
        return <AdminNotes />;
      case 'users':
        return <AdminUsers />;
      case 'analytics':
        return <EnrollmentAnalytics />;
      case 'overview':
      default:
        return (<div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-2xl p-4 md:p-6 border border-border">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className={`p-2.5 md:p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                </div>
                <Badge variant="secondary" className="text-success text-[10px] md:text-xs">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xl md:text-3xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</p>
            </motion.div>))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-5 md:p-6 border border-border cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('courses')}>
              <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-primary mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Courses</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Manage courses and content</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl p-5 md:p-6 border border-border cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('tests')}>
              <ClipboardList className="w-8 h-8 md:w-10 md:h-10 text-accent mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Tests</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Create and manage tests</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card rounded-2xl p-5 md:p-6 border border-border cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('notes')}>
              <FileText className="w-8 h-8 md:w-10 md:h-10 text-success mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Notes</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Manage study materials</p>
            </motion.div>
          </div>

          {/* Activity Placeholder */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-card rounded-2xl p-4 md:p-6 border border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
              <h2 className="text-base md:text-lg font-heading font-semibold text-card-foreground">
                Platform Activity
              </h2>
              <div className="flex gap-1.5 md:gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                <Button variant="secondary" size="sm" className="text-[10px] md:text-xs">Daily</Button>
                <Button variant="ghost" size="sm" className="text-[10px] md:text-xs">Weekly</Button>
                <Button variant="ghost" size="sm" className="text-[10px] md:text-xs">Monthly</Button>
              </div>
            </div>
            <div className="h-48 md:h-64 flex items-center justify-center bg-secondary/30 rounded-xl">
              <div className="text-center p-4">
                <Activity className="w-8 h-8 md:w-12 md:h-12 mx-auto text-muted-foreground mb-2 md:mb-3" />
                <p className="text-xs md:text-sm text-muted-foreground">Activity chart loading...</p>
              </div>
            </div>
          </motion.div>
        </div>);
    }
  };

  return (<div className="min-h-screen bg-background flex">
    {/* Sidebar Overlay for Mobile */}
    {sidebarOpen && (<div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />)}

    {/* Sidebar */}
    <motion.aside
      initial={false}
      animate={{
        width: sidebarOpen ? 256 : (window.innerWidth < 1024 ? 0 : 80),
        x: (window.innerWidth < 1024 && !sidebarOpen) ? -256 : 0
      }}
      className="fixed left-0 top-0 bottom-0 bg-card border-r border-border z-50 flex flex-col overflow-hidden shadow-2xl lg:shadow-none"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {sidebarOpen && (<span className="text-xl font-heading font-bold text-foreground">
          Admin <span className="text-primary italic font-black">Panel</span>
        </span>)}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        {sidebarItems.map((item) => (<button key={item.id} onClick={() => {
          setActiveTab(item.id);
          if (window.innerWidth < 1024)
            setSidebarOpen(false);
        }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}>
          <item.icon className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="font-semibold">{item.label}</span>}
        </button>))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="font-semibold">Logout</span>}
        </button>
      </div>
    </motion.aside>

    {/* Main Content */}
    <main className={`flex-1 transition-all flex flex-col min-w-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
      {/* Header */}
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden" aria-label="Open sidebar">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-heading font-semibold text-foreground capitalize truncate">
            {activeTab}
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 w-48 lg:w-64" />
          </div>
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 sm:p-6 flex-1 overflow-x-hidden">
        {renderContent()}
      </div>
    </main>
  </div>);
};

export default AdminDashboard;
