import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, BookOpen, FileText, CheckSquare, Package, Download, Play, Clock, CheckCircle } from 'lucide-react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
const MyStore = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!authLoading && !user)
            navigate("/login");
    }, [user, authLoading, navigate]);
    useEffect(() => {
        const fetchPurchases = async () => {
            if (!user)
                return;
            try {
                // 1. Fetch current purchases
                const { data: purchasesData, error: purchaseError } = await supabase
                    .from("purchases")
                    .select("*, course:courses(title, image_url, instructor), test:tests(title, description), note:notes(title, content, file_url)")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });
                if (purchaseError)
                    throw purchaseError;
                // 2. Fetch enrolled courses to check for missing purchase records
                const { data: enrolledData, error: enrollError } = await supabase
                    .from("user_courses")
                    .select("course_id, enrolled_at");
                if (enrollError)
                    throw enrollError;
                // 3. Identify courses that are in user_courses but not in purchases
                const purchasedCourseIds = new Set(purchasesData?.map(p => p.course_id).filter(Boolean));
                const missingPurchases = enrolledData?.filter(e => !purchasedCourseIds.has(e.course_id)) || [];
                if (missingPurchases.length > 0) {
                    console.log("🔄 Syncing missing purchase records for courses:", missingPurchases.length);
                    const syncPromises = missingPurchases.map(missing => supabase.from("purchases").insert({
                        user_id: user.id,
                        course_id: missing.course_id,
                        amount: 0,
                        status: 'completed',
                        order_id: `SYNC_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                        payment_id: 'sync_backfill',
                        created_at: missing.enrolled_at,
                        paid_at: missing.enrolled_at
                    }));
                    await Promise.all(syncPromises);
                    // Re-fetch after sync to get complete list with relations
                    const { data: refreshedData } = await supabase
                        .from("purchases")
                        .select("*, course:courses(title, image_url, instructor), test:tests(title, description), note:notes(title, content, file_url)")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false });
                    // @ts-ignore
                    setPurchases(refreshedData || []);
                }
                else {
                    // @ts-ignore
                    setPurchases(purchasesData || []);
                }
            }
            catch (error) {
                console.error("Error fetching purchases:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPurchases();
    }, [user]);
    const ItemCard = ({ purchase }) => {
        let type = 'Unknown';
        let title = 'Unknown Item';
        let description = '';
        let image = null;
        let action = null;
        let Icon = Package;
        if (purchase.course) {
            type = 'Course';
            title = purchase.course.title;
            description = `By ${purchase.course.instructor}`;
            image = purchase.course.image_url;
            Icon = BookOpen;
            action = (<Button size="sm" onClick={() => navigate(`/course/${purchase.course_id}`)} className="w-full sm:w-auto">
          <Play className="w-4 h-4 mr-2"/> Start Learning
        </Button>);
        }
        else if (purchase.test) {
            type = 'Test Series';
            title = purchase.test.title;
            description = purchase.test.description || 'Practice Test';
            Icon = CheckSquare;
            action = (<Button size="sm" onClick={() => navigate(`/tests`)} className="w-full sm:w-auto">
          <Play className="w-4 h-4 mr-2"/> Attempt Test
        </Button>);
        }
        else if (purchase.note) {
            type = 'Notes';
            title = purchase.note.title;
            description = purchase.note.content || 'Study Material';
            Icon = FileText;
            action = purchase.note.file_url ? (<Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
          <a href={purchase.note.file_url} target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4 mr-2"/> Download
          </a>
        </Button>) : null;
        }
        return (<Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-48 h-48 md:h-auto relative overflow-hidden bg-secondary/30">
              {image ? (<img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>) : (<div className={`w-full h-full flex items-center justify-center ${type === 'Course' ? 'bg-primary/10 text-primary' :
                    type === 'Test Series' ? 'bg-accent/10 text-accent' : 'bg-green-500/10 text-green-600'}`}>
                  <Icon className="w-12 h-12"/>
                </div>)}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="backdrop-blur-md bg-background/80 border-border/50 font-bold uppercase tracking-wider text-[10px]">
                  {type}
                </Badge>
              </div>
            </div>

            <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                  <h3 className="font-heading font-bold text-lg sm:text-xl line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <div className="text-left sm:text-right shrink-0 flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0">
                    <p className="text-lg sm:text-xl font-black text-foreground">₹{purchase.amount}</p>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                      {format(new Date(purchase.created_at), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 max-w-lg leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'} className={purchase.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 text-[10px]' : 'text-[10px]'}>
                    {purchase.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1"/>}
                    {purchase.status || 'Pending'}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3"/>
                    Purchased {format(new Date(purchase.created_at), "HH:mm")}
                  </span>
                </div>
                {purchase.status === 'completed' && action}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>);
    };

    return (<div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 mb-8 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <ShoppingBag className="w-5 h-5"/>
                <span className="font-medium">Digital Library</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                My <span className="text-primary">Store</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Access all your purchased courses, tests, and study materials in one place.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (<div className="space-y-4">
                {[1, 2, 3].map((i) => (<Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full rounded-xl"/></CardContent></Card>))}
              </div>) : purchases.length === 0 ? (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="border-dashed border-2 bg-secondary/10 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-gradient"></div>
                  <CardContent className="p-16 text-center">
                    <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-10 h-10 text-muted-foreground/40"/>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Your library is empty</h3>
                    <p className="text-muted-foreground mb-8 max-w-xs mx-auto text-xs sm:text-sm">Start your learning journey by exploring our premium courses and materials.</p>
                    <Button size="lg" className="gradient-primary px-8 font-bold shadow-lg" onClick={() => navigate("/courses")}>
                      Browse Store
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>) : (<div className="space-y-4">
                {purchases.map((purchase, index) => (<motion.div key={purchase.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                    <ItemCard purchase={purchase}/>
                  </motion.div>))}
              </div>)}
          </div>
        </section>
      </main>
      <Footer />
    </div>);
};

export default MyStore;
