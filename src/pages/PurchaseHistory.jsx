import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  ShoppingBag,
  BookOpen,
  FileText,
  CheckSquare,
  Package,
  Download,
  Play,
  Clock,
  CheckCircle,
  Receipt,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { downloadInvoicePdf } from '@/utils/generateInvoicePdf';
import { useHasCourses } from '@/hooks/useAdmin';
import { defaultChapterTests } from '@/data/chapterTests';
import { toast } from 'sonner';

const PurchaseHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: hasCourses } = useHasCourses();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'courses' | 'notes' | 'tests'
  const [downloadingId, setDownloadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchAllPurchases = async () => {
      if (!user) return;
      try {
        setLoading(true);

        // 1. Fetch category/folder package purchases (Notes Folders, Test Series Bundles)
        let categoryData = [];
        try {
          const { data: catData, error: catError } = await supabase
            .from("category_purchases")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (catError) {
            console.warn("Could not fetch category purchases:", catError.message);
          } else {
            categoryData = catData || [];
          }
        } catch (catErr) {
          console.warn("Error fetching category purchases:", catErr);
        }

        // 2. Fetch individual purchases (Courses, single Tests, single Notes)
        let purchasesData = [];
        try {
          const { data: pData, error: pError } = await supabase
            .from("purchases")
            .select("*, course:courses(title, image_url, instructor, category), test:tests(title, description, category), note:notes(title, content, file_url, category)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (pError) {
            console.warn("Rich purchases join failed, falling back to basic query:", pError.message);
            const { data: fallbackData } = await supabase
              .from("purchases")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false });
            purchasesData = fallbackData || [];
          } else {
            purchasesData = pData || [];
          }
        } catch (pErr) {
          console.warn("Error fetching individual purchases:", pErr);
        }

        // 3. Build lookup maps for tests, notes, and courses to guarantee proper titles & metadata
        const testsLookup = new Map();
        (defaultChapterTests || []).forEach((dt) => {
          if (dt?.id) testsLookup.set(dt.id, dt);
        });

        try {
          const { data: dbTests } = await supabase.from('tests').select('id, title, description, category');
          (dbTests || []).forEach((t) => {
            if (t?.id) testsLookup.set(t.id, t);
          });
        } catch (e) {}

        const notesLookup = new Map();
        try {
          const { data: dbNotes } = await supabase.from('notes').select('id, title, content, file_url, category');
          (dbNotes || []).forEach((n) => {
            if (n?.id) notesLookup.set(n.id, n);
          });
        } catch (e) {}

        const coursesLookup = new Map();
        try {
          const { data: dbCourses } = await supabase.from('courses').select('id, title, image_url, instructor, category');
          (dbCourses || []).forEach((c) => {
            if (c?.id) coursesLookup.set(c.id, c);
          });
        } catch (e) {}

        // 4. Normalize and combine real purchased items
        const unifiedList = [];
        const seenKeys = new Set();

        // Add standard individual purchases
        (purchasesData || []).forEach((p) => {
          let type = 'Course';
          let title = 'Study Item';
          let description = '';
          let image = null;
          let fileUrl = null;
          let category = 'Academic';

          if (p.test || p.test_id) {
            type = 'Test Series';
            const testInfo = p.test || testsLookup.get(p.test_id);
            title = testInfo?.title || 'Test Series Assessment';
            description = testInfo?.description || 'Practice Assessment & Solutions';
            category = testInfo?.category || 'Tests';
          } else if (p.note || p.note_id) {
            type = 'Notes';
            const noteInfo = p.note || notesLookup.get(p.note_id);
            title = noteInfo?.title || 'Study Material';
            description = noteInfo?.content || 'Study Material & Revision PDF';
            fileUrl = noteInfo?.file_url;
            category = noteInfo?.category || 'Notes';
          } else if (p.course || p.course_id) {
            type = 'Course';
            const courseInfo = p.course || coursesLookup.get(p.course_id);
            title = courseInfo?.title || 'Comprehensive Course';
            description = courseInfo?.instructor ? `By ${courseInfo.instructor}` : 'Comprehensive Course';
            image = courseInfo?.image_url;
            category = courseInfo?.category || 'Courses';
          }

          const uniqueKey = `p_${p.id || p.order_id}`;
          if (!seenKeys.has(uniqueKey)) {
            seenKeys.add(uniqueKey);
            unifiedList.push({
              id: p.id,
              uniqueKey,
              type,
              title,
              description,
              image,
              fileUrl,
              category,
              amount: Number(p.amount || 0),
              orderId: p.order_id || `ORD_${p.id}`,
              paymentId: p.payment_id || 'online_payment',
              status: p.status || 'completed',
              createdAt: p.created_at || new Date().toISOString(),
              pointsDiscount: Number(p.points_discount || 0),
              raw: p,
            });
          }
        });

        // Add category / folder purchases (Notes Folders and Test Series Folders)
        (categoryData || []).forEach((cp) => {
          const contentType = (cp.content_type || 'notes').toLowerCase();
          const isTests = contentType === 'tests';
          const isBoth = contentType === 'both';
          const isNotes = contentType === 'notes' || isBoth;

          // If tests or both, add Test Series card
          if (isTests || isBoth) {
            const type = 'Test Series';
            const title = `${cp.category} Full Test Series`;
            const description = `All chapter-wise mock tests and practice question banks for ${cp.category}`;
            const uniqueKey = `cat_tests_${cp.id || cp.order_id}`;

            if (!seenKeys.has(uniqueKey)) {
              seenKeys.add(uniqueKey);
              unifiedList.push({
                id: cp.id,
                uniqueKey,
                type,
                isCategoryBundle: true,
                categoryName: cp.category,
                title,
                description,
                image: null,
                category: cp.category,
                amount: Number(cp.amount || 0),
                orderId: cp.order_id || `CAT_${cp.id}`,
                paymentId: cp.payment_id || 'online_payment',
                status: cp.status || 'completed',
                createdAt: cp.created_at || new Date().toISOString(),
                pointsDiscount: 0,
                raw: cp,
              });
            }
          }

          // If notes or both, add Notes card
          if (isNotes) {
            const type = 'Notes';
            const title = `${cp.category} Complete Notes Pack`;
            const description = `Complete folder of high-yield revision PDF notes for ${cp.category}`;
            const uniqueKey = `cat_notes_${cp.id || cp.order_id}`;

            if (!seenKeys.has(uniqueKey)) {
              seenKeys.add(uniqueKey);
              unifiedList.push({
                id: cp.id,
                uniqueKey,
                type,
                isCategoryBundle: true,
                categoryName: cp.category,
                title,
                description,
                image: null,
                category: cp.category,
                amount: isBoth ? 0 : Number(cp.amount || 0),
                orderId: cp.order_id || `CAT_${cp.id}`,
                paymentId: cp.payment_id || 'online_payment',
                status: cp.status || 'completed',
                createdAt: cp.created_at || new Date().toISOString(),
                pointsDiscount: 0,
                raw: cp,
              });
            }
          }
        });

        // Sort newest first
        unifiedList.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPurchases(unifiedList);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPurchases();
  }, [user]);

  // Filter and search purchases
  const filteredPurchases = useMemo(() => {
    return purchases.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.orderId?.toLowerCase().includes(q);

      const matchesType =
        activeFilter === 'all' ||
        (activeFilter === 'courses' && item.type === 'Course') ||
        (activeFilter === 'notes' && item.type === 'Notes') ||
        (activeFilter === 'tests' && item.type === 'Test Series');

      return matchesSearch && matchesType;
    });
  }, [purchases, searchQuery, activeFilter]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPurchases.length / pageSize));
  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPurchases.slice(start, start + pageSize);
  }, [filteredPurchases, currentPage, pageSize]);

  // Download official receipt / invoice PDF
  const handleDownloadInvoice = async (item) => {
    try {
      setDownloadingId(item.uniqueKey);
      const studentName =
        user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';

      await downloadInvoicePdf({
        orderId: item.orderId,
        paymentId: item.paymentId,
        studentName,
        studentEmail: user?.email,
        userId: user?.id,
        itemTitle: item.title,
        itemType: item.type,
        category: item.category,
        amount: item.amount,
        pointsDiscount: item.pointsDiscount || 0,
        date: item.createdAt,
        status: item.status,
      });

      toast.success(`Invoice downloaded for "${item.title}"`);
    } catch (err) {
      toast.error('Could not generate invoice: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const ItemCard = ({ purchase }) => {
    let Icon = Package;
    let action = null;

    if (purchase.type === 'Course') {
      Icon = BookOpen;
      action = (
        <Button
          size="sm"
          onClick={() => navigate(`/course/${purchase.raw?.course_id || ''}`)}
          className="rounded-xl gradient-primary text-xs font-bold gap-1.5 shadow-sm"
        >
          <Play className="w-3.5 h-3.5" /> Start Learning
        </Button>
      );
    } else if (purchase.type === 'Test Series') {
      Icon = CheckSquare;
      const targetCategory = purchase.categoryName || purchase.category;
      const targetSlug = targetCategory
        ? targetCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : '';
      action = (
        <Button
          size="sm"
          onClick={() => navigate(targetSlug ? `/tests/${targetSlug}` : '/tests')}
          className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-bold gap-1.5 shadow-sm"
        >
          <Play className="w-3.5 h-3.5" /> Attempt Tests
        </Button>
      );
    } else if (purchase.type === 'Notes') {
      Icon = FileText;
      if (purchase.fileUrl) {
        action = (
          <Button size="sm" variant="outline" asChild className="rounded-xl text-xs font-bold gap-1.5">
            <a href={purchase.fileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-3.5 h-3.5" /> Download Notes
            </a>
          </Button>
        );
      } else {
        const slug = purchase.categoryName
          ? purchase.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          : '';
        action = (
          <Button
            size="sm"
            onClick={() => navigate(`/notes/${slug}`)}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" /> Open Notes
          </Button>
        );
      }
    }

    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 rounded-2xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Visual Thumbnail / Icon Box */}
            <div className="w-full md:w-52 h-36 sm:h-44 md:h-auto relative overflow-hidden bg-secondary/30 flex items-center justify-center">
              {purchase.image ? (
                <img
                  src={purchase.image}
                  alt={purchase.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center p-3 sm:p-4 text-center ${
                    purchase.type === 'Course'
                      ? 'bg-primary/10 text-primary'
                      : purchase.type === 'Test Series'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-emerald-500/10 text-emerald-600'
                  }`}
                >
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 mb-1.5 sm:mb-2" />
                  <span className="text-[11px] sm:text-xs font-bold">{purchase.category}</span>
                </div>
              )}

              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                <Badge
                  variant="secondary"
                  className="backdrop-blur-md bg-background/90 border-border/50 font-bold uppercase tracking-wider text-[9px] sm:text-[10px]"
                >
                  {purchase.type}
                </Badge>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1 p-3.5 sm:p-5 md:p-6 flex flex-col justify-between">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-col xs:flex-row justify-between items-start gap-1.5 xs:gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading font-bold text-sm sm:text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {purchase.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
                      {purchase.description}
                    </p>
                  </div>

                  <div className="text-left xs:text-right shrink-0">
                    <p className="text-base sm:text-xl font-black text-foreground">
                      ₹{purchase.amount}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold">
                      {format(new Date(purchase.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <Badge
                    variant="outline"
                    className="text-[9px] sm:text-[10px] font-mono text-muted-foreground bg-secondary/30 truncate max-w-[200px]"
                  >
                    Order: #{purchase.orderId?.slice(-10) || purchase.orderId}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons & Status */}
              <div className="mt-3.5 sm:mt-5 pt-3 sm:pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] sm:text-[10px] font-semibold"
                  >
                    <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                    {purchase.status === 'completed' ? 'Active Access' : purchase.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {format(new Date(purchase.createdAt), "hh:mm a")}
                  </span>
                </div>

                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto">
                  {/* Download Official Receipt / Invoice Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloadingId === purchase.uniqueKey}
                    onClick={() => handleDownloadInvoice(purchase)}
                    className="rounded-xl border-border hover:border-primary hover:bg-primary/5 text-xs font-bold gap-1.5 h-8 sm:h-9 flex-1 sm:flex-initial"
                    title="Download Official Tax Receipt / Payment Invoice (PDF)"
                  >
                    <Receipt className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">Download Invoice</span>
                  </Button>

                  {/* Primary Resource Action */}
                  <div className="flex-1 sm:flex-initial [&>button]:w-full [&>button]:h-8 [&>button]:sm:h-9 [&>button]:text-xs">
                    {action}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const totalSpent = purchases.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 mb-6 md:mb-8 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 md:mb-6">
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-semibold text-xs md:text-sm">My Purchases & Digital Library</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black text-foreground mb-3 md:mb-4">
                My <span className="text-primary">Purchases</span> & Invoices
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Access your unlocked courses, downloadable notes folders, test series, and official
                payment receipts in one place.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-4xl">
          {/* Quick Metrics Bar */}
          {!loading && purchases.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center shadow-xs">
                <p className="text-[9px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider truncate">
                  Total Items
                </p>
                <p className="text-base sm:text-2xl font-black text-foreground mt-0.5">
                  {purchases.length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center shadow-xs">
                <p className="text-[9px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider truncate">
                  Courses & Packs
                </p>
                <p className="text-base sm:text-2xl font-black text-primary mt-0.5">
                  {purchases.filter((p) => p.type === 'Course').length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center shadow-xs">
                <p className="text-[9px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider truncate">
                  Invested
                </p>
                <p className="text-base sm:text-2xl font-black text-emerald-600 mt-0.5 truncate">
                  ₹{totalSpent}
                </p>
              </div>
            </div>
          )}

          {/* Search & Filter Tabs */}
          {!loading && purchases.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              {/* Type Switcher Tabs */}
              <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    activeFilter === 'all'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All ({purchases.length})
                </button>
                {hasCourses && (
                  <button
                    onClick={() => setActiveFilter('courses')}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      activeFilter === 'courses'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Courses ({purchases.filter((p) => p.type === 'Course').length})
                  </button>
                )}
                <button
                  onClick={() => setActiveFilter('notes')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    activeFilter === 'notes'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Notes ({purchases.filter((p) => p.type === 'Notes').length})
                </button>
                <button
                  onClick={() => setActiveFilter('tests')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    activeFilter === 'tests'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Tests ({purchases.filter((p) => p.type === 'Test Series').length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs h-9 rounded-xl w-full"
                />
              </div>
            </div>
          )}

          {/* List of Purchases */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-24 w-full rounded-xl" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : purchases.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="border-dashed border-2 bg-secondary/10 overflow-hidden relative rounded-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"></div>
                  <CardContent className="p-12 md:p-16 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <Package className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">No purchases yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-xs sm:text-sm">
                      {hasCourses
                        ? "Start your learning journey by exploring our premium courses, downloadable notes, and test series."
                        : "Start your learning journey by exploring our downloadable notes folders and test series."}
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {hasCourses && (
                        <Button
                          size="default"
                          className="gradient-primary px-6 font-bold shadow-md rounded-xl"
                          onClick={() => navigate("/courses")}
                        >
                          Browse Courses
                        </Button>
                      )}
                      <Button
                        variant={hasCourses ? "outline" : "default"}
                        size="default"
                        className={`${!hasCourses ? "gradient-primary shadow-md" : ""} px-6 font-bold rounded-xl`}
                        onClick={() => navigate("/notes")}
                      >
                        Browse Notes
                      </Button>
                      <Button
                        variant="outline"
                        size="default"
                        className="px-6 font-bold rounded-xl"
                        onClick={() => navigate("/tests")}
                      >
                        Browse Tests
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : filteredPurchases.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <Search className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                <h4 className="font-bold text-sm text-foreground">No matching items found</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search query or filter.
                </p>
              </div>
            ) : (
              <>
                {paginatedPurchases.map((purchase, index) => (
                  <motion.div
                    key={purchase.uniqueKey}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <ItemCard purchase={purchase} />
                  </motion.div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground gap-2.5">
                    <span>
                      Page <strong className="text-foreground">{currentPage}</strong> of{' '}
                      <strong className="text-foreground">{totalPages}</strong> ({filteredPurchases.length} items)
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="h-8 rounded-lg px-2 sm:px-2.5 text-xs gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Prev</span>
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                        .map((page, index, array) => {
                          const showEllipsis = index > 0 && page - array[index - 1] > 1;
                          return (
                            <div key={page} className="flex items-center">
                              {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                              <Button
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                className={`h-8 w-8 p-0 rounded-lg text-xs font-bold ${
                                  currentPage === page ? 'bg-primary text-primary-foreground' : ''
                                }`}
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="h-8 rounded-lg px-2 sm:px-2.5 text-xs gap-1"
                      >
                        <span className="hidden xs:inline">Next</span> <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseHistory;
