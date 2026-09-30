import { useNavigate, useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Lock,
  Download,
  ChevronLeft,
  BookOpen,
  Search,
  ShoppingCart,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FolderCategoryIcon } from '@/components/ui/FolderCategoryIcon';
import { FolderCheckoutModal } from '@/components/checkout/FolderCheckoutModal';
import { useNotes } from '@/hooks/useNotes';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  useIsAdmin,
  useCoursesList,
  useUserPurchases,
  useCategoryPurchases,
  useBuyCategory,
} from '@/hooks/useAdmin';
import { getAllFolders, getFolderPrice, sortChapters } from '@/utils/folderPricing';

const Notes = () => {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { enrolledCourses } = useCourses();
  const { data: allCourses } = useCoursesList();
  const { data: isAdmin } = useIsAdmin();
  const { data: purchases } = useUserPurchases();
  const { data: categoryPurchases } = useCategoryPurchases();
  const { mutate: buyCategory, isPending: isBuyingCategory } = useBuyCategory();

  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutFolder, setCheckoutFolder] = useState(null);

  // Fetch all notes
  const { data: allNotes, isLoading: notesLoading } = useNotes();

  // Unified folders list: ONLY SHOW FOLDERS UPLOADED BY ADMIN (onlyWithItems = true)
  const folders = useMemo(() => {
    return getAllFolders('notes', allNotes || [], true);
  }, [allNotes]);

  // If URL category is present, find matching folder (also check all folders just in case)
  const currentFolder = useMemo(() => {
    if (!urlCategory) return null;
    const all = getAllFolders('notes', allNotes || [], false);
    return all.find(
      (f) => f.slug === urlCategory || f.name.toLowerCase() === urlCategory.toLowerCase()
    );
  }, [urlCategory, allNotes]);

  // Chapters in the current folder (sorted naturally Chapter 1, 2, 3...)
  const folderChapters = useMemo(() => {
    if (!currentFolder) return [];
    const matched = (allNotes || []).filter((n) => n.category === currentFolder.name);
    return sortChapters(matched);
  }, [currentFolder, allNotes]);

  // Current folder's price
  const currentFolderPrice = currentFolder
    ? getFolderPrice(currentFolder.name, 'notes', allNotes)
    : 0;

  // Access check for folder
  // strictCheck: true ignores admin role to check if real purchase or free setting exists
  const checkFolderAccess = (categoryName, strictCheck = false) => {
    if (!user) return false;
    if (isAdmin && !strictCheck) return true;

    const price = getFolderPrice(categoryName, 'notes', allNotes);
    if (price === 0) return true; // Free folder

    // Check if category purchase exists
    const isCategoryPurchased = categoryPurchases?.some(
      (cp) =>
        cp.category === categoryName &&
        (cp.content_type === 'notes' || cp.content_type === 'both')
    );
    if (isCategoryPurchased) return true;

    // Check if enrolled in course in the same category
    const isCourseEnrolled = enrolledCourses?.some((ec) => {
      const courseDetails = allCourses?.find((c) => c.id === ec.course_id);
      return courseDetails?.category === categoryName;
    });
    if (isCourseEnrolled) return true;

    return false;
  };

  const isCurrentFolderUnlocked = currentFolder ? checkFolderAccess(currentFolder.name) : false;
  const isCurrentFolderPurchasedOrFree = currentFolder ? checkFolderAccess(currentFolder.name, true) : false;

  const checkNoteAccess = (note) => {
    if (!user) return false;
    if (isAdmin) return true;
    if (isCurrentFolderUnlocked) return true;
    if (checkFolderAccess(note.category)) return true;

    const isNotePurchased = purchases?.some((p) => p.note_id === note.id);
    if (isNotePurchased) return true;

    return false;
  };

  // Handle Buy Folder
  const handleBuyFolder = (folderName, price) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to purchase notes folders',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setCheckoutFolder({
      name: folderName,
      type: 'notes',
      price: price || 0,
    });
  };

  // Direct download PDF handler
  const handleDownloadPdf = (fileUrl, title) => {
    if (!fileUrl) {
      toast({
        title: 'File not available',
        description: 'No PDF document has been attached for this chapter yet.',
        variant: 'destructive',
      });
      return;
    }
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  // Filtered chapters for current folder
  const filteredChapters = useMemo(() => {
    if (!searchQuery) return folderChapters;
    return folderChapters.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folderChapters, searchQuery]);

  // Filtered folders for main list
  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24 pb-16">
        <AnimatePresence mode="wait">
          {/* VIEW 1: Main Category Folders Grid (Only shows folders uploaded by admin) */}
          {!currentFolder ? (
            <motion.div
              key="folders-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <section className="pt-6 pb-8 md:pt-10 md:pb-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                <div className="container mx-auto px-3 sm:px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto"
                  >
                    <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-3 sm:mb-4">
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs md:text-sm font-semibold">Study Material Folders</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-2 sm:mb-3">
                      Notes & <span className="text-primary">Study Material</span>
                    </h1>
                    <p className="text-xs sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                      Choose a folder below to access and download chapter-wise notes.
                    </p>
                  </motion.div>
                </div>
              </section>

              {/* Search Bar */}
              <section className="py-4 sm:py-6 border-b border-border/60">
                <div className="container mx-auto px-3 sm:px-4">
                  <div className="relative w-full max-w-md mx-auto">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search folders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 sm:h-11 rounded-xl bg-card border-border/80 shadow-sm text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </section>

              {/* Folders Grid */}
              <section className="py-6 sm:py-10">
                <div className="container mx-auto px-3 sm:px-4">
                  {notesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-56 bg-secondary/50 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : filteredFolders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filteredFolders.map((folder, index) => {
                        const isPurchasedOrFree = checkFolderAccess(folder.name, true);
                        const folderPrice = getFolderPrice(folder.name, 'notes', allNotes);
                        const chapters = (allNotes || []).filter((n) => n.category === folder.name);
                        const pdfCount = chapters.filter((c) => c.file_url).length;

                        return (
                          <motion.div
                            key={folder.name}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.4 }}
                          >
                            <div className="group relative rounded-2xl sm:rounded-3xl border border-border/70 bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-12px_rgba(123,17,19,0.14)] flex flex-col h-full overflow-hidden p-4 sm:p-6 justify-between">
                              {/* Top Accent Stripe */}
                              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary opacity-80 group-hover:opacity-100 transition-opacity" />

                              {/* Subtle Ambient Background Sheen */}
                              <div className="absolute -top-20 -right-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                              <div>
                                {/* Header Row: Vector Icon + Status/Price Pill */}
                                <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                                  <FolderCategoryIcon
                                    category={folder.name}
                                    iconHint={folder.icon}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl"
                                    iconClassName="w-6 h-6 sm:w-7 sm:h-7"
                                  />

                                  <div>
                                    {isPurchasedOrFree ? (
                                      <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[11px] sm:text-xs font-bold shadow-xs">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>UNLOCKED</span>
                                      </div>
                                    ) : folderPrice > 0 ? (
                                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                        <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[11px] sm:text-xs font-black shadow-xs">
                                          <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                          <span>₹{folderPrice}</span>
                                        </div>
                                        {isAdmin && (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25">
                                            Admin
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary text-foreground/80 border border-border text-[11px] sm:text-xs font-bold">
                                        <span>FREE</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Folder Meta & Title */}
                                <div className="mt-3.5 sm:mt-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-primary/80">
                                      Study Folder
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                                      {chapters.length} Chapters
                                    </span>
                                  </div>

                                  <h3 className="text-lg sm:text-2xl font-bold font-heading text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {folder.name}
                                  </h3>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                    {folder.description || 'Complete syllabus notes with chapter-wise downloadable PDFs.'}
                                  </p>
                                </div>

                                {/* Stats Chips */}
                                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border/60">
                                  <div className="bg-secondary/40 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 border border-border/40 text-[11px] sm:text-xs">
                                    <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span className="font-semibold text-foreground truncate">
                                      {chapters.length} Chapters
                                    </span>
                                  </div>

                                  <div className="bg-secondary/40 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 border border-border/40 text-[11px] sm:text-xs">
                                    <FileText className="w-3.5 h-3.5 text-accent shrink-0" />
                                    <span className="font-semibold text-foreground truncate">
                                      {pdfCount} PDFs
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* CTA Action Area */}
                              <div className="pt-4 mt-3.5 border-t border-border/60">
                                {isPurchasedOrFree ? (
                                  <Button
                                    variant="gradient"
                                    className="w-full h-10 sm:h-11 rounded-xl text-xs sm:text-sm gap-2 font-bold shadow-md group/btn"
                                    onClick={() => navigate(`/notes/${folder.slug}`)}
                                  >
                                    <FolderOpen className="w-4 h-4" />
                                    Open Chapters
                                    <ArrowRight className="w-4 h-4 ml-auto group-hover/btn:translate-x-1.5 transition-transform" />
                                  </Button>
                                ) : isAdmin ? (
                                  <div className="space-y-1.5">
                                    <Button
                                      variant="gradient"
                                      className="w-full h-10 sm:h-11 rounded-xl text-xs sm:text-sm gap-2 font-bold shadow-md group/btn"
                                      onClick={() => navigate(`/notes/${folder.slug}`)}
                                    >
                                      <FolderOpen className="w-4 h-4" />
                                      Open Chapters (Admin)
                                      <ArrowRight className="w-4 h-4 ml-auto group-hover/btn:translate-x-1.5 transition-transform" />
                                    </Button>
                                    <button
                                      type="button"
                                      onClick={() => handleBuyFolder(folder.name, folderPrice)}
                                      className="w-full text-center text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors py-0.5 flex items-center justify-center gap-1"
                                    >
                                      <ShoppingCart className="w-3 h-3" />
                                      Test Student Checkout (₹{folderPrice})
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <Button
                                      variant="gradient"
                                      className="w-full h-10 sm:h-11 rounded-xl text-xs sm:text-sm gap-1.5 sm:gap-2 font-bold shadow-md"
                                      disabled={isBuyingCategory}
                                      onClick={() => handleBuyFolder(folder.name, folderPrice)}
                                    >
                                      <ShoppingCart className="w-4 h-4" />
                                      {folderPrice > 0
                                        ? `Unlock Pack • ₹${folderPrice}`
                                        : 'Unlock for Free'}
                                    </Button>

                                    <button
                                      type="button"
                                      onClick={() => navigate(`/notes/${folder.slug}`)}
                                      className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors py-1 flex items-center justify-center gap-1"
                                    >
                                      Browse Chapters Preview
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-card rounded-2xl border border-border">
                      <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-3" />
                      <h3 className="text-xl font-bold text-foreground mb-1">No Folders Uploaded Yet</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Notes folders uploaded by the administrator will automatically appear here.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : (
            /* VIEW 2: Inside Category Folder (Only Chapter Name + Download Button, No Description) */
            <motion.div
              key="folder-chapters"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Folder Header */}
              <section className="pt-5 pb-6 md:pt-8 md:pb-10 bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border/60">
                <div className="container mx-auto px-3 sm:px-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/notes')}
                    className="mb-3 sm:mb-4 h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-background/80 backdrop-blur-sm border-border/70 text-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 gap-1.5 text-xs font-semibold transition-all shadow-sm group"
                  >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    All Folders
                  </Button>

                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 sm:gap-3.5">
                        <FolderCategoryIcon
                          category={currentFolder.name}
                          iconHint={currentFolder.icon}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl shadow-sm"
                          iconClassName="w-6 h-6 sm:w-7 sm:h-7"
                        />
                        <div>
                          <Badge variant="outline" className="text-[10px] sm:text-xs mb-1 font-semibold">
                            Study Folder
                          </Badge>
                          <h1 className="text-xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground">
                            {currentFolder.name}
                          </h1>
                        </div>
                      </div>
                    </div>

                    {/* Unlock Status / Buy Box */}
                    <div className="w-full lg:w-auto">
                      {isCurrentFolderUnlocked ? (
                        <div className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">
                              Folder Unlocked
                            </p>
                            <p className="text-[11px] sm:text-xs text-muted-foreground">
                              All {folderChapters.length} chapters available for download
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-5 bg-card border border-primary/20 rounded-xl sm:rounded-2xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                              Folder Price
                            </span>
                            <span className="text-xl sm:text-2xl font-black text-primary">
                              {currentFolderPrice > 0 ? `₹${currentFolderPrice}` : 'FREE'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                              Unlocks all {folderChapters.length} chapters & PDFs
                            </p>
                          </div>
                          <Button
                            variant="gradient"
                            size="lg"
                            className="w-full sm:w-auto h-10 sm:h-11 px-5 sm:px-6 rounded-xl font-bold gap-2 shadow-md text-xs sm:text-sm"
                            disabled={isBuyingCategory}
                            onClick={() => handleBuyFolder(currentFolder.name, currentFolderPrice)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {currentFolderPrice > 0
                              ? `Buy Folder (₹${currentFolderPrice})`
                              : 'Unlock Free'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Chapters List (Only Chapter Name + Download Button) */}
              <section className="py-6 sm:py-10">
                <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
                      Chapters ({folderChapters.length})
                    </h2>

                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search chapter..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 text-xs h-9 rounded-xl"
                      />
                    </div>
                  </div>

                  {filteredChapters && filteredChapters.length > 0 ? (
                    <div className="space-y-2.5 sm:space-y-3">
                      {filteredChapters.map((chapter, index) => {
                        const hasAccess = checkNoteAccess(chapter);

                        return (
                          <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => {
                              if (!hasAccess) handleBuyFolder(currentFolder.name, currentFolderPrice);
                            }}
                            className={`group p-3 sm:p-4 rounded-xl sm:rounded-2xl border bg-card border-border/80 hover:border-primary/50 transition-all duration-300 hover:shadow-md flex items-center justify-between gap-2.5 sm:gap-4 ${
                              !hasAccess ? 'cursor-pointer' : ''
                            }`}
                          >
                            {/* Chapter Index Badge & Chapter Name */}
                            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border border-primary/20 shadow-sm group-hover:scale-105 transition-transform">
                                {index + 1}
                              </div>
                              <h3 className="font-bold text-foreground text-xs sm:text-base truncate group-hover:text-primary transition-colors">
                                {chapter.title}
                              </h3>
                            </div>

                            {/* Download Button / Lock Button */}
                            <div className="shrink-0">
                              {hasAccess ? (
                                <Button
                                  variant="gradient"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadPdf(chapter.file_url, chapter.title);
                                  }}
                                  className="rounded-xl text-[11px] sm:text-xs gap-1.5 sm:gap-2 font-bold px-3 sm:px-5 h-9 sm:h-10 shadow-md hover:shadow-lg transition-all group-hover:scale-105"
                                >
                                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  Download
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyFolder(currentFolder.name, currentFolderPrice);
                                  }}
                                  className="rounded-xl border-primary/40 text-primary hover:text-primary hover:border-primary hover:bg-primary/15 h-9 w-9 p-0 flex items-center justify-center shrink-0 shadow-sm transition-all"
                                  title="Locked - Click to unlock folder"
                                  aria-label="Locked chapter"
                                >
                                  <Lock className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-16 text-center bg-card rounded-2xl border border-border">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                      <h4 className="text-base font-bold text-foreground">No chapters in this folder</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                        Chapters uploaded by the administrator will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Folder Unlock Checkout Modal */}
      <FolderCheckoutModal
        open={!!checkoutFolder}
        onOpenChange={(open) => {
          if (!open) setCheckoutFolder(null);
        }}
        folder={checkoutFolder}
        onUnlockSuccess={(f) => {
          navigate(`/notes/${f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
        }}
      />

      <Footer />
    </div>
  );
};

export default Notes;
