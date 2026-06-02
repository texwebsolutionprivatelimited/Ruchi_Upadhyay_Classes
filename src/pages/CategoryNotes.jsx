import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronRight, ArrowLeft, Clock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotes } from '@/hooks/useNotes';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast'; // Added this import
const CategoryNotes = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const categoryInfo = courseCategories.find(c => c.slug === category);
    const categoryName = categoryInfo?.name || '';
    const { user } = useAuth();
    const { data: isAdmin } = useIsAdmin();
    const { data: purchases } = useUserPurchases();
    const { enrolledCourses } = useCourses();
    const { data: notes, isLoading } = useNotes(categoryName || undefined);
    const { data: allCourses } = useCoursesList();
    const { mutate: buyNote } = useBuyNote();
    const hasAccess = (note) => {
        if (!user)
            return false;
        if (isAdmin)
            return true;
        const price = note.price ?? 0;
        if (price === 0)
            return true;
        // Check if individual note is purchased
        const isNotePurchased = purchases?.some(p => p.note_id === note.id);
        if (isNotePurchased)
            return true;
        // Check if course in the same category is purchased
        const isCategoryPurchased = enrolledCourses?.some(ec => {
            const courseDetails = allCourses?.find(c => c.id === ec.course_id);
            return courseDetails?.category === categoryName;
        });
        if (isCategoryPurchased)
            return true;
        return false;
    };
    const handleBuyNote = (note) => {
        if (!user) {
            toast({
                title: 'Please sign in',
                description: 'You need to be logged in to purchase notes',
                variant: 'destructive',
            });
            navigate('/login');
            return;
        }
        buyNote(note.id);
    };
    const filteredNotes = notes?.filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!categoryInfo) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
                <Button onClick={() => navigate('/notes')}>Go Back to Notes</Button>
            </div>
        </div>);
    }
    return (<div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-1 pt-20 md:pt-24">
            <AnimatePresence mode="wait">
                {!selectedNote ? (<motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-16">
                    {/* Hero Section */}
                    <section className="pt-6 pb-8 md:pt-8 md:pb-10 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                        <div className="container mx-auto px-4">
                            <Button variant="outline" onClick={() => navigate('/notes')} className="mb-4 h-9 px-4 rounded-xl bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back to All Notes
                            </Button>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl">{categoryInfo.icon}</span>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground">
                                        {categoryInfo.name} <span className="text-primary">Notes</span>
                                    </h1>
                                </div>
                                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{categoryInfo.description}</p>
                            </motion.div>
                        </div>
                    </section>

                    {/* Search */}
                    <section className="py-8 border-b border-border">
                        <div className="container mx-auto px-4">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                            </div>
                        </div>
                    </section>

                    {/* Notes Grid */}
                    <section className="py-12">
                        <div className="container mx-auto px-4">
                            {isLoading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="h-48 bg-secondary/50 rounded-2xl animate-pulse" />))}
                            </div>) : filteredNotes && filteredNotes.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredNotes.map((note, index) => (<motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                    <Card className="glass-card hover-lift transition-all duration-500 border-primary/5 h-full flex flex-col group relative overflow-visible">
                                        {/* Floating Badge */}
                                        <div className="absolute -top-3 -left-2 z-10 px-3 py-1 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold tracking-wider uppercase">
                                            {note.category}
                                        </div>

                                        <CardHeader className="pt-8">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(note.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <CardTitle className="text-xl font-heading font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {note.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="flex-1 flex flex-col px-6">
                                            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                                "{note.content}"
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                                                {hasAccess(note) ? (<Button variant="ghost" size="sm" className="w-full group/btn justify-between hover:bg-primary hover:text-white transition-all duration-300 text-primary font-semibold rounded-xl btn-premium-hover" onClick={() => setSelectedNote(note)}>
                                                    <span>Dive Deep Into Content</span>
                                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>) : !user ? (<Button variant="outline" size="sm" className="w-full group/enroll border-primary/20 hover:border-primary/50 text-xs py-5 rounded-xl bg-white/5 btn-premium-hover" onClick={() => {
                                                    toast({
                                                        title: 'Please sign in',
                                                        description: 'You need to be logged in to access notes',
                                                        variant: 'destructive',
                                                    });
                                                    navigate('/login');
                                                }}>
                                                    <Lock className="w-3.5 h-3.5 mr-2" />
                                                    Unlock Mastery Flow
                                                </Button>) : (<div className="flex flex-col gap-4 w-full">
                                                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-xl border border-primary/10">
                                                        <div className="flex items-center gap-2 text-primary font-bold">
                                                            <Lock className="w-4 h-4" />
                                                            <span className="text-lg">₹{note.price || 0}</span>
                                                        </div>
                                                        <Button variant="gradient" size="sm" className="px-6 rounded-lg btn-premium-hover shadow-lg" onClick={() => handleBuyNote(note)}>
                                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                                            Own Now
                                                        </Button>
                                                    </div>
                                                    <div className="relative h-px bg-gradient-to-r from-transparent via-border to-transparent my-1">
                                                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">or</span>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="w-full group/enroll border-primary/10 hover:bg-primary/5 text-[11px] h-10 rounded-xl btn-premium-hover" onClick={() => navigate(`/courses/${category}`)}>
                                                        <BookOpen className="w-3.5 h-3.5 mr-2" />
                                                        Get All-Access Pass
                                                    </Button>
                                                </div>)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>))}
                            </div>) : (<div className="text-center py-16">
                                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-2">No Notes Found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'Try adjusting your search' : 'Notes will appear here once added by admin'}
                                </p>
                            </div>)}
                        </div>
                    </section>
                </motion.div>) : (<motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="container mx-auto px-4 py-8 max-w-4xl">
                    <Button variant="outline" onClick={() => setSelectedNote(null)} className="mb-8 group h-9 px-4 rounded-xl bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to {categoryName}
                    </Button>

                    <Card className="border-border shadow-2xl bg-card overflow-hidden">
                        <div className={`h-2 w-full bg-gradient-to-r ${categoryInfo.gradient}`} />
                        <CardHeader className="p-4 md:p-6 lg:p-8 pb-2 md:pb-4">
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                <Badge variant="secondary" className={`bg-gradient-to-r ${categoryInfo.gradient} text-white border-none text-xs md:text-sm`}>
                                    {selectedNote.category}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground px-2 md:px-3 py-1 rounded-full bg-secondary/50">
                                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                    {new Date(selectedNote.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground leading-tight">
                                {selectedNote.title}
                            </h1>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 lg:p-8 pt-0">
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-foreground/90 text-sm md:text-base lg:text-lg leading-relaxed py-6 md:py-8 border-y border-border/50 my-6 md:my-8">
                                    {selectedNote.content}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 pt-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    {selectedNote.file_url && (<Button className="w-full sm:w-auto px-6 md:px-8 h-11 md:h-12 text-sm md:text-base font-medium" variant="gradient" onClick={() => window.open(selectedNote.file_url, '_blank')}>
                                        <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                        Download Study Material (PDF)
                                    </Button>)}
                                </div>
                                <Button variant="outline" className="w-full sm:w-auto px-6 md:px-8 h-11 md:h-12" onClick={() => setSelectedNote(null)}>
                                    Done Reading
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>)}
            </AnimatePresence>
        </main>

        <Footer />
    </div>);
};
export default CategoryNotes;
