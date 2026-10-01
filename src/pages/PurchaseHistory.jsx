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

        // 1. Fetch individual purchases (Courses, single Tests, single Notes)
        const { data: purchasesData, error: purchaseError } = await supabase
          .from("purchases")
          .select("*, course:courses(title, image_url, instructor, category), test:tests(title, description, category), note:notes(title, content, file_url, category)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (purchaseError) throw purchaseError;

        // 2. Fetch category/folder package purchases (Notes Folders, Test Series Bundles)
        const { data: categoryData, error: catError } = await supabase
          .from("category_purchases")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (catError) {
          console.warn("Could not fetch category purchases:", catError.message);
        }

        // 3. Normalize and combine real purchased items
        const unifiedList = [];
        const seenKeys = new Set();

        // Add standard purchases
        (purchasesData || []).forEach((p) => {
          let type = 'Course';
          let title = 'Study Item';
          let description = '';
          let image = null;
          let fileUrl = null;
          let category = 'Academic';

          if (p.course) {
            type = 'Course';
            title = p.course.title;
            description = p.course.instructor ? `By ${p.course.instructor}` : 'Comprehensive Course';
            image = p.course.image_url;
            category = p.course.category || 'Courses';
          } else if (p.note) {
            type = 'Notes';
            title = p.note.title;
            description = p.note.content || 'Study Material & Revision PDF';
            fileUrl = p.note.file_url;
            category = p.note.category || 'Notes';
          } else if (p.test) {
            type = 'Test Series';
            title = p.test.title;
            description = p.test.description || 'Practice Assessment & Solutions';
            category = p.test.category || 'Tests';
          }

          const uniqueKey = `${p.id || p.order_id}`;
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
        });

        // Add category / folder purchases (Notes Folders and Test Series Folders)
        (categoryData || []).forEach((cp) => {
          const isNotes = (cp.content_type || 'notes') === 'notes';
          const type = isNotes ? 'Notes' : 'Test Series';
          const title = `${cp.category} ${isNotes ? 'Complete Notes Pack' : 'Full Test Series'}`;
          const description = isNotes
            ? `Complete folder of high-yield revision PDF notes for ${cp.category}`
            : `All chapter-wise mock tests and practice question banks for ${cp.category}`;
          const uniqueKey = `cat_${cp.id || cp.order_id}`;

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
  const handleDownloadInvoice = (item) => {
    try {
      setDownloadingId(item.uniqueKey);
      const studentName =
        user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';

      downloadInvoicePdf({
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
      action = (
        <Button
          size="sm"
          onClick={() => navigate('/tests')}
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
            <div className="w-full md:w-52 h-44 md:h-auto relative overflow-hidden bg-secondary/30 flex items-center justify-center">
              {purchase.image ? (
                <img
                  src={purchase.image}
                  alt={purchase.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center p-4 text-center ${
                    purchase.type === 'Course'
                      ? 'bg-primary/10 text-primary'
                      : purchase.type === 'Test Series'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-emerald-500/10 text-emerald-600'
                  }`}
                >
                  <Icon className="w-12 h-12 mb-2" />
                  <span className="text-xs font-bold">{purchase.category}</span>
                </div>
              )}

              <div className="absolute top-3 left-3">
                <Badge
                  variant="secondary"
                  className="backdrop-blur-md bg-background/90 border-border/50 font-bold uppercase tracking-wider text-[10px]"
                >
                  {purchase.type}
                </Badge>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {purchase.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {purchase.description}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-lg sm:text-xl font-black text-foreground">
                      ₹{purchase.amount}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold">
                      {format(new Date(purchase.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono text-muted-foreground bg-secondary/30"
                  >
                    Order: {purchase.orderId}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons & Status */}
              <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {purchase.status === 'completed' ? 'Active Access' : purchase.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {format(new Date(purchase.createdAt), "hh:mm a")}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Download Official Receipt / Invoice Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloadingId === purchase.uniqueKey}
                    onClick={() => handleDownloadInvoice(purchase)}
                    className="rounded-xl border-border hover:border-primary hover:bg-primary/5 text-xs font-bold gap-1.5 h-9"
                    title="Download Official Tax Receipt / Payment Invoice (PDF)"
                  >
                    <Receipt className="w-3.5 h-3.5 text-primary" />
                    Download Invoice
                  </Button>

                  {/* Primary Resource Action */}
                  {action}
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
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Total Items
                </p>
                <p className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
                  {purchases.length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Courses & Packs
                </p>
                <p className="text-xl sm:text-2xl font-black text-primary mt-0.5">
                  {purchases.filter((p) => p.type === 'Course').length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Total Invested
                </p>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
                  ₹{totalSpent}
                </p>
              </div>
            </div>
          )}

          {/* Search & Filter Tabs */}
          {!loading && purchases.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
              {/* Type Switcher Tabs */}
              <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl overflow-x-auto">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === 'notes'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Notes ({purchases.filter((p) => p.type === 'Notes').length})
                </button>
                <button
                  onClick={() => setActiveFilter('tests')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                  className="pl-9 text-xs h-9 rounded-xl"
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
                  <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                    <span>
                      Page <strong className="text-foreground">{currentPage}</strong> of{' '}
                      <strong className="text-foreground">{totalPages}</strong> ({filteredPurchases.length} total items)
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="h-8 rounded-lg px-2.5 text-xs gap-1"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          className={`h-8 w-8 p-0 rounded-lg text-xs font-bold ${
                            currentPage === page ? 'bg-primary text-primary-foreground' : ''
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="h-8 rounded-lg px-2.5 text-xs gap-1"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
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
