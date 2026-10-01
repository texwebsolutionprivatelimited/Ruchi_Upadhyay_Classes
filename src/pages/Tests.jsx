import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Award,
  Clock,
  ArrowRight,
  Lock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Trophy,
  Zap,
  RotateCcw,
  Home,
  ShoppingCart,
  CheckCircle2,
  FolderOpen,
  ClipboardList,
  Search,
  HelpCircle,
  ShieldAlert,
  AlertTriangle,
  Eye,
  FileCheck2,
  Check,
  Flame,
  ListFilter,
  Bookmark,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { FolderCategoryIcon } from '@/components/ui/FolderCategoryIcon';
import { FolderCheckoutModal } from '@/components/checkout/FolderCheckoutModal';
import { TestInstructionsModal } from '@/components/tests/TestInstructionsModal';
import { TestSubmitConfirmModal } from '@/components/tests/TestSubmitConfirmModal';
import { TestTabSwitchWarningModal } from '@/components/tests/TestTabSwitchWarningModal';
import { useTests } from '@/hooks/useTests';
import {
  useIsAdmin,
  useCoursesList,
  useUserPurchases,
  useCategoryPurchases,
  useBuyCategory,
  useUpdateFolderPrice,
} from '@/hooks/useAdmin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getAllFolders, getFolderPrice, sortChapters } from '@/utils/folderPricing';

const Tests = () => {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams();
  const { user, addXP } = useAuth();
  const { toast } = useToast();
  const { data: isAdmin } = useIsAdmin();
  const { enrolledCourses } = useCourses();
  const { data: allCourses } = useCoursesList();
  const { data: purchases } = useUserPurchases();
  const { data: categoryPurchases } = useCategoryPurchases();
  const { mutate: buyCategory, isPending: isBuyingCategory } = useBuyCategory();

  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutFolder, setCheckoutFolder] = useState(null);

  // Admin Price Setting State
  const updateFolderPrice = useUpdateFolderPrice();
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [priceFolderTarget, setPriceFolderTarget] = useState(null);
  const [newPriceValue, setNewPriceValue] = useState(299);
  const [isFreeToggle, setIsFreeToggle] = useState(false);

  const handleOpenPriceDialog = (folder) => {
    setPriceFolderTarget(folder);
    const currPrice = getFolderPrice(folder.name, 'tests', allTests);
    setNewPriceValue(currPrice);
    setIsFreeToggle(currPrice === 0);
    setIsPriceDialogOpen(true);
  };

  const handleSavePrice = async (e) => {
    e.preventDefault();
    if (!priceFolderTarget) return;

    const finalPrice = isFreeToggle ? 0 : Math.max(0, Number(newPriceValue) || 0);

    await updateFolderPrice.mutateAsync({
      category: priceFolderTarget.name,
      type: 'tests',
      price: finalPrice,
    });

    setIsPriceDialogOpen(false);
    setPriceFolderTarget(null);
  };

  // Fetch all tests
  const { data: allTests, isLoading: testsLoading } = useTests();

  // Fetch user's previous test results from Supabase
  const { data: userTestResults, refetch: refetchUserTestResults } = useQuery({
    queryKey: ['user-test-results', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const { data, error } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', user.id);
        if (error) {
          return [];
        }
        return data || [];
      } catch (e) {
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Test Player State
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [testCompleted, setTestCompleted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modals & Anti-Cheat State
  const [instructionsTest, setInstructionsTest] = useState(null);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [isTabWarningOpen, setIsTabWarningOpen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins default

  // Helper to fetch saved past attempt from localStorage or DB
  const getSavedAttempt = (testId) => {
    const key = `rc_test_attempt_${user?.id || 'guest'}_${testId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    const dbRes = userTestResults?.find((r) => r.test_id === testId);
    if (dbRes) {
      return {
        testId,
        score: dbRes.score,
        total_questions: dbRes.total_questions,
        xp_earned: dbRes.xp_earned,
        completed_at: dbRes.completed_at,
        answers: [],
      };
    }
    return null;
  };

  // Unified folders list: ONLY SHOW FOLDERS UPLOADED BY ADMIN (onlyWithItems = true)
  const folders = useMemo(() => {
    return getAllFolders('tests', allTests || [], true);
  }, [allTests]);

  // If URL category is present, find matching folder
  const currentFolder = useMemo(() => {
    if (!urlCategory) return null;
    const all = getAllFolders('tests', allTests || [], false);
    return all.find(
      (f) => f.slug === urlCategory || f.name.toLowerCase() === urlCategory.toLowerCase()
    );
  }, [urlCategory, allTests]);

  // Tests in the current folder (sorted naturally Chapter 1, 2, 3...)
  const folderTests = useMemo(() => {
    if (!currentFolder) return [];
    const matched = (allTests || []).filter((t) => t.category === currentFolder.name);
    return sortChapters(matched);
  }, [currentFolder, allTests]);

  // Current folder's price
  const currentFolderPrice = currentFolder
    ? getFolderPrice(currentFolder.name, 'tests', allTests)
    : 0;

  // Folder Access Check
  // strictCheck: true ignores admin role to check if real purchase or free setting exists
  const checkFolderAccess = (categoryName, strictCheck = false) => {
    if (!user) return false;
    if (isAdmin && !strictCheck) return true;

    const price = getFolderPrice(categoryName, 'tests', allTests);
    if (price === 0) return true;

    const isCategoryPurchased = categoryPurchases?.some(
      (cp) =>
        cp.category?.toLowerCase().trim() === categoryName?.toLowerCase().trim() &&
        (cp.content_type === 'tests' || cp.content_type === 'notes' || cp.content_type === 'both')
    );
    if (isCategoryPurchased) return true;

    const isCourseEnrolled = enrolledCourses?.some((ec) => {
      const courseDetails = allCourses?.find((c) => c.id === ec.course_id);
      return courseDetails?.category === categoryName;
    });
    if (isCourseEnrolled) return true;

    return false;
  };

  const isCurrentFolderUnlocked = currentFolder ? checkFolderAccess(currentFolder.name) : false;
  const isCurrentFolderPurchasedOrFree = currentFolder ? checkFolderAccess(currentFolder.name, true) : false;

  const checkTestAccess = (test) => {
    if (!user) return false;
    if (isAdmin) return true;
    if (isCurrentFolderUnlocked) return true;
    if (checkFolderAccess(test.category)) return true;

    const isTestPurchased = purchases?.some((p) => p.test_id === test.id);
    if (isTestPurchased) return true;

    return false;
  };

  // Handle Buy Folder
  const handleBuyFolder = (folderName, price) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to purchase test series',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setCheckoutFolder({
      name: folderName,
      type: 'tests',
      price: price || 0,
    });
  };

  // --- Anti-Cheat: Tab Switch & Activity Monitoring ---
  useEffect(() => {
    if (!selectedTest || testCompleted || reviewMode) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setIsTabWarningOpen(true);
          if (next >= 3) {
            handleFinalSubmit(true);
          }
          return next;
        });
      }
    };

    const handleBlur = () => {
      setTabSwitchCount((prev) => {
        const next = prev + 1;
        setIsTabWarningOpen(true);
        if (next >= 3) {
          handleFinalSubmit(true);
        }
        return next;
      });
    };

    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && ['c', 'v', 'u', 's', 'p', 'a'].includes(e.key.toLowerCase())) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        toast({
          title: 'Action Blocked 🛡️',
          description: 'Copying, inspecting, or shortcut keys are prohibited during test.',
          variant: 'destructive',
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTest, testCompleted, reviewMode]);

  // --- Countdown Timer ---
  useEffect(() => {
    if (!selectedTest || testCompleted || reviewMode) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: 'Time is up! ⏳',
            description: 'Your test is being submitted automatically.',
          });
          handleFinalSubmit(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTest, testCompleted, reviewMode]);

  // Format MM:SS for countdown timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to identify question category
  const getQuestionTypeInfo = (q) => {
    const text = (q?.question || '').toLowerCase();
    if (text.includes('[case study') || text.startsWith('case study')) {
      return {
        label: 'Case Study Question',
        className: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
      };
    }
    if (text.includes('assertion (a)') || text.startsWith('assertion:')) {
      return {
        label: 'Assertion & Reason',
        className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
      };
    }
    return {
      label: 'Multiple Choice (MCQ)',
      className: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    };
  };

  // Click on a test in the folder list
  const handleTestCardClick = (test) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to take tests',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    if (!checkTestAccess(test)) {
      handleBuyFolder(test.category, currentFolderPrice);
      return;
    }

    const pastAttempt = getSavedAttempt(test.id);
    if (pastAttempt) {
      // User has already given this test - NO RE-ATTEMPT ALLOWED!
      // Open directly in review/solutions mode!
      setSelectedTest(test);
      setAnswers(pastAttempt.answers || []);
      setTestCompleted(true);
      setReviewMode(true);
      return;
    }

    // New attempt: Open Instructions & Terms modal
    setInstructionsTest(test);
  };

  // Confirmed Start from Instructions Modal
  const handleConfirmedStart = (test) => {
    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers(new Array(test.questions?.length || 0).fill(undefined));
    setMarkedForReview(new Set());
    setTestCompleted(false);
    setReviewMode(false);
    setTabSwitchCount(0);
    setTimeLeft((test.duration_minutes || 30) * 60);
  };

  // Option selection (NO instant reveal during test!)
  const handleSelectOption = (optionIndex) => {
    if (testCompleted || reviewMode) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = optionIndex;
      return next;
    });
  };

  // Clear answer for current question
  const handleClearResponse = (qIdx) => {
    if (testCompleted || reviewMode) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = undefined;
      return next;
    });
  };

  // Toggle mark for review
  const handleToggleMarkForReview = (qIdx) => {
    if (testCompleted || reviewMode) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(qIdx)) {
        next.delete(qIdx);
      } else {
        next.add(qIdx);
      }
      return next;
    });
  };

  // Calculate score breakdown
  const calculateScore = () => {
    if (!selectedTest || !selectedTest.questions || selectedTest.questions.length === 0)
      return {
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        total: 0,
        percentage: 0,
        obtainedMarks: 0,
        totalMarks: 0,
        xp: 0,
      };

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let obtainedMarks = 0;
    let totalMarks = 0;

    selectedTest.questions.forEach((q, i) => {
      const qPoints = q.points || 2;
      totalMarks += qPoints;
      const userAns = answers[i];
      if (userAns === undefined || userAns === null) {
        unattempted++;
      } else if (userAns === q.correctAnswer) {
        correct++;
        obtainedMarks += qPoints;
      } else {
        incorrect++;
      }
    });

    const totalQuestions = selectedTest.questions.length;
    const percentage = Math.round((obtainedMarks / (totalMarks || 1)) * 100) || 0;
    const xpBase = selectedTest.reward_points || selectedTest.total_marks || 50;
    const xpEarned = Math.round((percentage / 100) * xpBase) || 0;

    return {
      correct,
      incorrect,
      unattempted,
      total: totalQuestions,
      obtainedMarks,
      totalMarks: selectedTest.total_marks || totalMarks,
      percentage: isNaN(percentage) ? 0 : percentage,
      xp: isNaN(xpEarned) ? 0 : xpEarned,
    };
  };

  // Final Submit Handler
  const handleFinalSubmit = async (forcedByAntiCheat = false) => {
    setIsConfirmSubmitOpen(false);
    setIsSaving(true);
    setTestCompleted(true);
    setReviewMode(true);

    const score = calculateScore();

    // Persist attempt record in localStorage with user ID & test ID
    const key = `rc_test_attempt_${user?.id || 'guest'}_${selectedTest.id}`;
    const attemptRecord = {
      testId: selectedTest.id,
      testTitle: selectedTest.title,
      category: selectedTest.category,
      answers,
      score: score.percentage,
      obtainedMarks: score.obtainedMarks,
      totalMarks: score.totalMarks,
      correct: score.correct,
      incorrect: score.incorrect,
      unattempted: score.unattempted,
      total: score.total,
      xp_earned: score.xp,
      completed_at: new Date().toISOString(),
      tabSwitches: tabSwitchCount,
      forcedByAntiCheat,
    };

    try {
      localStorage.setItem(key, JSON.stringify(attemptRecord));
    } catch (e) {
      console.error('Storage error:', e);
    }

    // Save to Supabase test_results
    try {
      if (user?.id) {
        await supabase.from('test_results').insert({
          user_id: user.id,
          test_id: selectedTest.id,
          score: score.percentage || 0,
          total_questions: score.total || 0,
          xp_earned: score.xp || 0,
        });

        if (score.xp > 0) {
          await addXP(score.xp);
        }
      }
    } catch (err) {
      console.error('Error saving to Supabase test_results:', err);
    } finally {
      setIsSaving(false);
      refetchUserTestResults();
      toast({
        title: forcedByAntiCheat ? 'Test Force-Submitted 🛡️' : 'Test Submitted Successfully! 🏆',
        description: `Score: ${score.percentage}% (${score.correct}/${score.total} Correct). View detailed solutions below.`,
      });
    }
  };


  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const filteredTests = useMemo(() => {
    if (!searchQuery) return folderTests;
    return folderTests.filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folderTests, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24 pb-16">
        <AnimatePresence mode="wait">
          {/* VIEW 1: Main Test Series Folders Grid (Only shows folders uploaded by admin) */}
          {!currentFolder && !selectedTest ? (
            <motion.div
              key="test-folders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <section className="pt-6 pb-8 md:pt-10 md:pb-12 bg-gradient-to-br from-accent/10 via-background to-primary/10">
                <div className="container mx-auto px-3 sm:px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto"
                  >
                    <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-accent/10 text-accent mb-3 sm:mb-4">
                      <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs md:text-sm font-semibold">
                        Test Series Packages
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-2 sm:mb-3">
                      Test Series & <span className="text-accent">Assessments</span>
                    </h1>
                    <p className="text-xs sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                      Select a test package below to attempt chapter-wise assessments.
                    </p>
                  </motion.div>
                </div>
              </section>

              <section className="py-4 sm:py-6 border-b border-border/60">
                <div className="container mx-auto px-3 sm:px-4">
                  <div className="relative w-full max-w-md mx-auto">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search test folders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 sm:h-11 rounded-xl bg-card border-border/80 shadow-sm text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </section>

              <section className="py-6 sm:py-10">
                <div className="container mx-auto px-3 sm:px-4">
                  {testsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-56 bg-secondary/50 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : filteredFolders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filteredFolders.map((folder, index) => {
                        const isPurchasedOrFree = checkFolderAccess(folder.name, true);
                        const folderPrice = getFolderPrice(folder.name, 'tests', allTests);
                        const testsInFolder = (allTests || []).filter(
                          (t) => t.category === folder.name
                        );
                        const totalQuestions = testsInFolder.reduce(
                          (sum, t) => sum + (t.questions?.length || 0),
                          0
                        );

                        return (
                          <motion.div
                            key={folder.name}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.4 }}
                          >
                            <div className="group relative rounded-2xl sm:rounded-3xl border border-border/70 bg-card hover:border-accent/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-12px_rgba(217,119,6,0.14)] flex flex-col h-full overflow-hidden p-4 sm:p-6 justify-between">
                              {/* Top Accent Stripe */}
                              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-primary to-accent opacity-80 group-hover:opacity-100 transition-opacity" />

                              {/* Subtle Ambient Sheen */}
                              <div className="absolute -top-20 -right-20 w-44 h-44 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors pointer-events-none" />

                              <div>
                                {/* Header Row: Vector Icon + Status/Price Pill */}
                                <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                                  <FolderCategoryIcon
                                    category={folder.name}
                                    iconHint={folder.icon}
                                    variant="accent"
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
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/25">
                                            Admin
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary text-foreground/80 border border-border text-[11px] sm:text-xs font-bold">
                                        <span>FREE</span>
                                      </div>
                                    )}

                                    {/* Admin Price Button */}
                                    {isAdmin && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenPriceDialog(folder);
                                        }}
                                        className="text-[11px] font-bold text-accent hover:underline flex items-center justify-end gap-1 mt-1 ml-auto"
                                      >
                                        <DollarSign className="w-3 h-3" />
                                        Set Price
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Folder Meta & Title */}
                                <div className="mt-3.5 sm:mt-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-accent font-semibold">
                                      Test Series
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                                      {testsInFolder.length} Tests
                                    </span>
                                  </div>

                                  <h3 className="text-lg sm:text-2xl font-bold font-heading text-card-foreground group-hover:text-accent transition-colors line-clamp-1">
                                    {folder.name}
                                  </h3>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                    {folder.description || 'Full assessment package with instant scoring & analytics.'}
                                  </p>
                                </div>

                                {/* Stats Chips */}
                                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border/60">
                                  <div className="bg-secondary/40 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 border border-border/40 text-[11px] sm:text-xs">
                                    <ClipboardList className="w-3.5 h-3.5 text-accent shrink-0" />
                                    <span className="font-semibold text-foreground truncate">
                                      {testsInFolder.length} Mock Tests
                                    </span>
                                  </div>

                                  <div className="bg-secondary/40 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 border border-border/40 text-[11px] sm:text-xs">
                                    <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                                    <span className="font-semibold text-foreground truncate">
                                      {totalQuestions} Questions
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
                                    onClick={() => navigate(`/tests/${folder.slug}`)}
                                  >
                                    <FolderOpen className="w-4 h-4" />
                                    Open Test Series
                                    <ArrowRight className="w-4 h-4 ml-auto group-hover/btn:translate-x-1.5 transition-transform" />
                                  </Button>
                                ) : isAdmin ? (
                                  <div className="space-y-1.5">
                                    <Button
                                      variant="gradient"
                                      className="w-full h-10 sm:h-11 rounded-xl text-xs sm:text-sm gap-2 font-bold shadow-md group/btn"
                                      onClick={() => navigate(`/tests/${folder.slug}`)}
                                    >
                                      <FolderOpen className="w-4 h-4" />
                                      Open Test Series (Admin)
                                      <ArrowRight className="w-4 h-4 ml-auto group-hover/btn:translate-x-1.5 transition-transform" />
                                    </Button>
                                    <button
                                      type="button"
                                      onClick={() => handleBuyFolder(folder.name, folderPrice)}
                                      className="w-full text-center text-[11px] font-semibold text-muted-foreground hover:text-accent transition-colors py-0.5 flex items-center justify-center gap-1"
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
                                        ? `Unlock Series • ₹${folderPrice}`
                                        : 'Unlock for Free'}
                                    </Button>

                                    <button
                                      type="button"
                                      onClick={() => navigate(`/tests/${folder.slug}`)}
                                      className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-accent transition-colors py-1 flex items-center justify-center gap-1"
                                    >
                                      Browse Tests Preview
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
                      <ClipboardList className="w-16 h-16 mx-auto text-muted-foreground/40 mb-3" />
                      <h3 className="text-xl font-bold text-foreground mb-1">No Test Folders Uploaded Yet</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Test series packages uploaded by the administrator will automatically appear here.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : currentFolder && !selectedTest ? (
            /* VIEW 2: Inside Test Folder (Only Test Name + Start Button) */
            <motion.div
              key="folder-tests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <section className="pt-6 pb-8 md:pt-8 md:pb-10 bg-gradient-to-br from-accent/10 via-background to-primary/10 border-b border-border/60">
                <div className="container mx-auto px-3 sm:px-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/tests')}
                    className="mb-3 sm:mb-4 h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-background/80 backdrop-blur-sm border-border/70 text-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 gap-1.5 text-xs font-semibold transition-all shadow-sm group"
                  >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    All Test Folders
                  </Button>

                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 sm:gap-3.5">
                        <FolderCategoryIcon
                          category={currentFolder.name}
                          iconHint={currentFolder.icon}
                          variant="accent"
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl shadow-sm"
                          iconClassName="w-6 h-6 sm:w-7 sm:h-7"
                        />
                        <div>
                          <Badge variant="outline" className="text-[10px] sm:text-xs mb-1 font-semibold">
                            Test Series Folder
                          </Badge>
                          <h1 className="text-xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground">
                            {currentFolder.name}
                          </h1>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto">
                      {isCurrentFolderPurchasedOrFree ? (
                        <div className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">
                              Series Unlocked
                            </p>
                            <p className="text-[11px] sm:text-xs text-muted-foreground">
                              All {folderTests.length} tests ready to attempt
                            </p>
                          </div>
                        </div>
                      ) : isAdmin ? (
                        <div className="p-3.5 sm:p-4 bg-card border border-accent/30 rounded-xl sm:rounded-2xl shadow-md flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                                Student Price
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                                Admin View
                              </span>
                            </div>
                            <span className="text-xl sm:text-2xl font-black text-accent">
                              {currentFolderPrice > 0 ? `₹${currentFolderPrice}` : 'FREE'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                              You have full Admin preview access to test all chapters
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto h-9 px-3 rounded-xl font-bold gap-1 text-xs border-accent/40 text-accent hover:bg-accent/10"
                              onClick={() => handleOpenPriceDialog(currentFolder)}
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              Set Price
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto h-9 px-3 rounded-xl font-bold gap-1.5 text-xs border-border hover:bg-secondary"
                              onClick={() => handleBuyFolder(currentFolder.name, currentFolderPrice)}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Test Checkout
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-5 bg-card border border-accent/20 rounded-xl sm:rounded-2xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                              Series Price
                            </span>
                            <span className="text-xl sm:text-2xl font-black text-accent">
                              {currentFolderPrice > 0 ? `₹${currentFolderPrice}` : 'FREE'}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                              Unlocks all {folderTests.length} tests in this folder
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
                              ? `Buy Series (₹${currentFolderPrice})`
                              : 'Unlock Free'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Tests List (Only Chapter/Test Name + Start Button) */}
              <section className="py-6 sm:py-10">
                <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
                      Chapter Tests ({folderTests.length})
                    </h2>

                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search test..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 text-xs h-9 rounded-xl"
                      />
                    </div>
                  </div>

                  {filteredTests && filteredTests.length > 0 ? (
                    <div className="space-y-2.5 sm:space-y-3">
                      {filteredTests.map((test, index) => {
                        const hasAccess = checkTestAccess(test);
                        const pastAttempt = getSavedAttempt(test.id);

                        return (
                          <motion.div
                            key={test.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border bg-card border-border/80 hover:border-accent/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm"
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border border-accent/20">
                                {index + 1}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  <h3 className="font-bold text-foreground text-xs sm:text-base truncate">
                                    {test.title}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground mt-1 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {test.duration_minutes || 30}m
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    {test.questions?.length || 0} Qs
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5 text-amber-500" />
                                    {test.total_marks || 50} Marks
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
                              {hasAccess ? (
                                pastAttempt ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTestCardClick(test)}
                                    className="w-full sm:w-auto rounded-xl text-xs gap-1.5 font-bold border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/15 hover:border-emerald-500/60 h-9 sm:h-10 px-3 sm:px-4 shadow-sm transition-all"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    View Result
                                  </Button>
                                ) : (
                                  <Button
                                    variant="gradient"
                                    size="sm"
                                    onClick={() => handleTestCardClick(test)}
                                    className="w-full sm:w-auto rounded-xl text-xs gap-1.5 sm:gap-2 font-bold px-4 sm:px-5 h-9 sm:h-10 shadow-md"
                                  >
                                    Start Test
                                    <ArrowRight className="w-4 h-4" />
                                  </Button>
                                )
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyFolder(currentFolder.name, currentFolderPrice);
                                  }}
                                  className="rounded-xl border-accent/40 text-accent hover:text-accent hover:border-accent hover:bg-accent/15 h-9 w-9 p-0 flex items-center justify-center shrink-0 shadow-sm transition-all"
                                  title="Locked - Click to unlock test series"
                                  aria-label="Locked test"
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
                      <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                      <h4 className="text-base font-bold text-foreground">No tests in this folder</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                        Tests uploaded by the administrator will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : (
            /* VIEW 3: Interactive Quiz Mode (Anti-Cheat & Clean Testing Experience) */
            selectedTest && (
              <motion.div
                key="test-player"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={
                  !testCompleted && !reviewMode
                    ? 'container mx-auto px-2.5 sm:px-4 py-4 sm:py-6 max-w-7xl'
                    : 'container mx-auto px-2.5 sm:px-4 py-4 sm:py-6 max-w-4xl'
                }
              >
                {!testCompleted && !reviewMode ? (
                  /* Active Test Taking View (2-Column Widescreen Layout with Sidebar Palette) */
                  <div
                    onContextMenu={(e) => e.preventDefault()}
                    className="space-y-4 sm:space-y-6 select-none"
                  >
                    {/* Top Examination Control Bar */}
                    <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                'Are you sure you want to exit? Your test will NOT be submitted and progress may be lost.'
                              )
                            ) {
                              setSelectedTest(null);
                            }
                          }}
                          className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive gap-1 shrink-0"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Exit
                        </Button>

                        <div className="min-w-0">
                          <h2 className="font-bold text-xs sm:text-base md:text-lg text-foreground leading-tight truncate">
                            {selectedTest.title}
                          </h2>
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                            <span className="truncate">{selectedTest.category}</span>
                            <span>•</span>
                            <span className="shrink-0">{selectedTest.questions?.length || 0} Questions</span>
                          </div>
                        </div>
                      </div>

                      {/* Timer, Anti-Cheat Status & Finish Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                        <div
                          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl font-mono font-bold text-xs sm:text-sm border ${
                            timeLeft < 300
                              ? 'bg-destructive/15 text-destructive border-destructive/30 animate-pulse'
                              : 'bg-primary/10 text-primary border-primary/25'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{formatTimer(timeLeft)}</span>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                          <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          Anti-Cheat
                        </span>

                        <Button
                          variant="gradient"
                          size="sm"
                          onClick={() => setIsConfirmSubmitOpen(true)}
                          className="rounded-xl text-xs font-bold px-3 sm:px-4 h-8 sm:h-9 shadow-sm"
                        >
                          Finish Test
                        </Button>
                      </div>
                    </div>

                    {/* Main 2-Column Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
                      {/* Left: Question Card & Controls */}
                      <div className="lg:col-span-8 space-y-4">
                        {selectedTest.questions && selectedTest.questions[currentQuestion] && (
                          <Card className="border-border shadow-xl bg-card rounded-xl sm:rounded-2xl overflow-hidden">
                            <CardHeader className="p-4 sm:p-6 md:p-7 border-b border-border/60 space-y-3 sm:space-y-4">
                              {/* Question Meta Row */}
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  {/* Question Type Badge */}
                                  <span
                                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold border ${
                                      getQuestionTypeInfo(selectedTest.questions[currentQuestion]).className
                                    }`}
                                  >
                                    {getQuestionTypeInfo(selectedTest.questions[currentQuestion]).label}
                                  </span>

                                  {/* Points Badge */}
                                  <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-secondary text-muted-foreground border border-border">
                                    +{selectedTest.questions[currentQuestion].points || 2} Marks
                                  </span>

                                  {/* Marked for Review Indicator */}
                                  {markedForReview.has(currentQuestion) && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1">
                                      <Bookmark className="w-3 h-3 fill-purple-600 text-purple-600" />
                                      Review
                                    </span>
                                  )}
                                </div>

                                <Badge variant="outline" className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1">
                                  Q {currentQuestion + 1} of {selectedTest.questions.length}
                                </Badge>
                              </div>

                              <Progress
                                value={
                                  ((currentQuestion + 1) / selectedTest.questions.length) * 100
                                }
                                className="h-1.5 rounded-full"
                              />

                              {/* Question Text */}
                              <h3 className="text-sm sm:text-lg md:text-xl font-bold font-heading text-foreground leading-relaxed whitespace-pre-line pt-1">
                                {selectedTest.questions[currentQuestion].question}
                              </h3>
                            </CardHeader>

                            {/* Options List (Clean selection - NO instant reveal during test!) */}
                            <CardContent className="p-3.5 sm:p-6 md:p-7 space-y-2.5 sm:space-y-3">
                              <div className="grid gap-2.5 sm:gap-3">
                                {selectedTest.questions[currentQuestion].options?.map((option, idx) => {
                                  const isSelected = answers[currentQuestion] === idx;

                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => handleSelectOption(idx)}
                                      className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-2.5 ${
                                        isSelected
                                          ? 'border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/40 shadow-sm'
                                          : 'border-border/80 hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 text-foreground'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                                        <span
                                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold border shrink-0 transition-colors ${
                                            isSelected
                                              ? 'bg-primary text-primary-foreground border-primary'
                                              : 'bg-card border-border/80 text-foreground'
                                          }`}
                                        >
                                          {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="text-xs sm:text-sm leading-relaxed break-words flex-1">
                                          {option}
                                        </span>
                                      </div>

                                      {isSelected && (
                                        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] shrink-0">
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Navigation Controls: Previous, Clear, Mark for Review, Next & Submit */}
                              <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center sm:justify-between pt-4 sm:pt-6 border-t border-border/60">
                                <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setCurrentQuestion((prev) => Math.max(0, prev - 1))
                                    }
                                    disabled={currentQuestion === 0}
                                    className="rounded-xl px-3 sm:px-4 text-xs font-bold gap-1 h-9 sm:h-10 flex-1 sm:flex-initial border-border/80 text-foreground hover:text-foreground hover:bg-secondary transition-all"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                  </Button>

                                  {answers[currentQuestion] !== undefined && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleClearResponse(currentQuestion)}
                                      className="rounded-xl px-2.5 sm:px-3 text-[11px] sm:text-xs font-semibold text-muted-foreground hover:text-destructive h-9 sm:h-10"
                                    >
                                      Clear
                                    </Button>
                                  )}
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleMarkForReview(currentQuestion)}
                                    className={`rounded-xl px-2.5 sm:px-3.5 text-xs font-bold gap-1 sm:gap-1.5 h-9 sm:h-10 flex-1 sm:flex-initial transition-all ${
                                      markedForReview.has(currentQuestion)
                                        ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20'
                                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                                  >
                                    <Bookmark
                                      className={`w-3.5 h-3.5 ${
                                        markedForReview.has(currentQuestion)
                                          ? 'fill-purple-600 text-purple-600'
                                          : ''
                                      }`}
                                    />
                                    <span>
                                      {markedForReview.has(currentQuestion)
                                        ? 'Unmark'
                                        : 'Review'}
                                    </span>
                                  </Button>

                                  {currentQuestion < selectedTest.questions.length - 1 ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setCurrentQuestion((prev) =>
                                          Math.min(selectedTest.questions.length - 1, prev + 1)
                                        )
                                      }
                                      className="rounded-xl px-3.5 sm:px-5 text-xs font-bold gap-1 border-primary/40 text-primary hover:text-primary hover:border-primary hover:bg-primary/10 h-9 sm:h-10 flex-1 sm:flex-initial transition-all"
                                    >
                                      Next
                                      <ChevronRight className="w-4 h-4" />
                                    </Button>
                                  ) : null}

                                  <Button
                                    variant="gradient"
                                    size="sm"
                                    onClick={() => setIsConfirmSubmitOpen(true)}
                                    className="rounded-xl px-3.5 sm:px-5 text-xs font-bold gap-1.5 h-9 sm:h-10 shadow-md flex-1 sm:flex-initial"
                                  >
                                    Submit
                                    <CheckCircle2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Right: Sticky Question Palette Sidebar */}
                      <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
                        <Card className="border-border shadow-lg bg-card rounded-xl sm:rounded-2xl overflow-hidden">
                          <CardHeader className="p-3.5 sm:p-5 pb-2.5 sm:pb-3 border-b border-border/60">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  <ListFilter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                                    Question Palette
                                  </h4>
                                  <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                                    Click any number to jump
                                  </p>
                                </div>
                              </div>
                              <span className="text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                                {currentQuestion + 1}/{selectedTest.questions.length}
                              </span>
                            </div>
                          </CardHeader>

                          <CardContent className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                            {/* Status Summary Pills */}
                            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                              <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                                  Answered
                                </p>
                                <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                                  {answers.filter((a) => a !== undefined && a !== null).length}
                                </p>
                              </div>
                              <div className="p-1.5 sm:p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400">
                                  Review
                                </p>
                                <p className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">
                                  {markedForReview.size}
                                </p>
                              </div>
                              <div className="p-1.5 sm:p-2 rounded-xl bg-secondary/50 border border-border">
                                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground">
                                  Left
                                </p>
                                <p className="text-base sm:text-lg font-black text-foreground">
                                  {selectedTest.questions.length -
                                    answers.filter((a) => a !== undefined && a !== null).length}
                                </p>
                              </div>
                            </div>

                            {/* Interactive Question Numbers Grid */}
                            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 sm:gap-2.5 max-h-[280px] sm:max-h-[340px] overflow-y-auto p-2 rounded-xl bg-secondary/20 border border-border/40">
                              {selectedTest.questions.map((_, qIdx) => {
                                const isAnswered =
                                  answers[qIdx] !== undefined && answers[qIdx] !== null;
                                const isReview = markedForReview.has(qIdx);
                                const isCurrent = currentQuestion === qIdx;

                                let style =
                                  'bg-secondary/60 text-muted-foreground border-border hover:bg-secondary';
                                if (isReview && isAnswered) {
                                  style =
                                    'bg-purple-600 text-white border-purple-700 font-bold shadow-xs';
                                } else if (isReview) {
                                  style =
                                    'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/50 font-bold';
                                } else if (isAnswered) {
                                  style =
                                    'bg-emerald-500 text-white border-emerald-600 font-bold shadow-xs';
                                }

                                return (
                                  <button
                                    key={qIdx}
                                    type="button"
                                    onClick={() => setCurrentQuestion(qIdx)}
                                    className={`relative h-9 sm:h-10 rounded-lg sm:rounded-xl text-xs flex items-center justify-center font-bold border transition-all ${style} ${
                                      isCurrent
                                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-card shadow-md scale-105 z-10'
                                        : 'hover:scale-[1.03]'
                                    }`}
                                  >
                                    {qIdx + 1}
                                    {isReview && (
                                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-600 ring-1 ring-card" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Palette Legend */}
                            <div className="pt-3 mt-2 border-t border-border/60 grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-md bg-emerald-500 inline-block shrink-0" />
                                <span>Answered</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-md bg-purple-600 inline-block shrink-0" />
                                <span>Marked Review</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-md border-2 border-primary bg-card inline-block shrink-0" />
                                <span>Current</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-md bg-secondary border border-border inline-block shrink-0" />
                                <span>Unanswered</span>
                              </div>
                            </div>

                            {/* Direct Finish Test Button in Sidebar */}
                            <Button
                              variant="gradient"
                              onClick={() => setIsConfirmSubmitOpen(true)}
                              className="w-full rounded-xl text-xs font-bold h-9 sm:h-10 shadow-md gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Finish & Submit Test
                            </Button>

                            {/* Anti-Cheat Status in Sidebar */}
                            <div className="p-2.5 sm:p-3 rounded-xl bg-secondary/30 border border-border flex items-center justify-between text-[11px] sm:text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Tab Switches:</span>
                              </div>
                              <span
                                className={`font-mono font-bold ${
                                  tabSwitchCount > 0 ? 'text-destructive' : 'text-emerald-500'
                                }`}
                              >
                                {tabSwitchCount} / 3 warnings
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Post-Test Results & Solutions Review View (Single Attempt Permanent Record) */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    {/* Top Result Card */}
                    <Card className="border-border shadow-2xl bg-card rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-10 space-y-4 sm:space-y-6 text-center overflow-hidden relative">
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-accent" />

                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner border border-primary/20">
                        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                      </div>

                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Test Completed & Submitted
                        </div>
                        <h2 className="text-xl sm:text-3xl font-heading font-black text-foreground">
                          {selectedTest.title}
                        </h2>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 max-w-md mx-auto px-2">
                          Your single official attempt has been permanently saved. Re-attempts are not permitted. Review detailed explanations below.
                        </p>
                      </div>

                      {/* Performance Breakdown Chips */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto pt-1 sm:pt-2">
                        <div className="p-3 sm:p-4 bg-secondary/40 rounded-xl border border-border">
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">Score</p>
                          <p className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
                            {calculateScore().percentage}%
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 bg-secondary/40 rounded-xl border border-border">
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">Marks</p>
                          <p className="text-xl sm:text-2xl font-black text-primary mt-0.5">
                            {calculateScore().obtainedMarks} / {calculateScore().totalMarks}
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 bg-secondary/40 rounded-xl border border-border">
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">Correct</p>
                          <p className="text-xl sm:text-2xl font-black text-emerald-500 mt-0.5">
                            {calculateScore().correct} / {calculateScore().total}
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 bg-secondary/40 rounded-xl border border-border">
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">XP Earned</p>
                          <p className="text-xl sm:text-2xl font-black text-amber-500 mt-0.5">
                            +{calculateScore().xp}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-3 pt-2 flex-wrap">
                        <Button
                          variant="gradient"
                          onClick={() => {
                            setSelectedTest(null);
                            setReviewMode(false);
                            setTestCompleted(false);
                          }}
                          className="w-full sm:w-auto rounded-xl gap-2 font-bold px-6 h-10 shadow-md text-xs sm:text-sm"
                        >
                          <Home className="w-4 h-4" />
                          Back to Test Series
                        </Button>

                        {isAdmin && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              const key = `rc_test_attempt_${user?.id || 'guest'}_${selectedTest.id}`;
                              localStorage.removeItem(key);
                              setSelectedTest(null);
                              setTestCompleted(false);
                              setReviewMode(false);
                              setAnswers([]);
                              toast({
                                title: 'Test Attempt Reset (Admin)',
                                description: 'You can now take this test fresh again.',
                              });
                            }}
                            className="w-full sm:w-auto rounded-xl gap-2 font-semibold px-4 h-10 border-destructive/30 text-destructive hover:text-destructive hover:bg-destructive/15 hover:border-destructive/60 text-xs sm:text-sm transition-all"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Reset Attempt (Admin)
                          </Button>
                        )}
                      </div>
                    </Card>

                    {/* Solutions & Explanations Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          <h3 className="text-base sm:text-lg font-bold font-heading text-foreground">
                            Solutions & Explanations
                          </h3>
                        </div>
                        <span className="text-[11px] sm:text-xs text-muted-foreground font-semibold">
                          {selectedTest.questions?.length} Questions
                        </span>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        {selectedTest.questions?.map((q, qIndex) => {
                          const userChoice = answers[qIndex];
                          const isCorrect = userChoice === q.correctAnswer;
                          const isUnattempted = userChoice === undefined || userChoice === null;

                          return (
                            <Card
                              key={q.id || qIndex}
                              className="border-border bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-sm"
                            >
                              <CardHeader className="p-3.5 sm:p-5 border-b border-border/60 space-y-2">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] sm:text-xs font-bold text-foreground bg-secondary px-2 sm:px-2.5 py-0.5 rounded-lg border border-border">
                                      Q{qIndex + 1}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold border ${
                                        getQuestionTypeInfo(q).className
                                      }`}
                                    >
                                      {getQuestionTypeInfo(q).label}
                                    </span>
                                  </div>

                                  <div>
                                    {isCorrect ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Correct (+{q.points || 2})
                                      </span>
                                    ) : isUnattempted ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-secondary text-muted-foreground border border-border">
                                        Unattempted (0)
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20">
                                        <XCircle className="w-3.5 h-3.5" />
                                        Incorrect (0)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xs sm:text-base font-bold text-foreground leading-relaxed whitespace-pre-line pt-1">
                                  {q.question}
                                </p>
                              </CardHeader>

                              <CardContent className="p-3.5 sm:p-6 space-y-3 sm:space-y-4">
                                {/* Options State Display */}
                                <div className="grid gap-2">
                                  {q.options?.map((option, optIdx) => {
                                    const isThisCorrect = q.correctAnswer === optIdx;
                                    const isThisUserChoice = userChoice === optIdx;

                                    let optionStyle =
                                      'border-border/70 bg-secondary/20 text-muted-foreground';
                                    if (isThisCorrect) {
                                      optionStyle =
                                        'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold ring-1 ring-emerald-500/30';
                                    } else if (isThisUserChoice && !isThisCorrect) {
                                      optionStyle =
                                        'border-destructive bg-destructive/10 text-destructive font-semibold ring-1 ring-destructive/30';
                                    }

                                    return (
                                      <div
                                        key={optIdx}
                                        className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-2.5 text-xs sm:text-sm ${optionStyle}`}
                                      >
                                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                          <span className="w-6 h-6 rounded-md bg-card border border-border/80 flex items-center justify-center font-bold text-xs shrink-0">
                                            {String.fromCharCode(65 + optIdx)}
                                          </span>
                                          <span className="break-words flex-1">{option}</span>
                                        </div>

                                        {isThisCorrect && (
                                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                            <CheckCircle className="w-3.5 h-3.5" /> Correct
                                          </span>
                                        )}
                                        {isThisUserChoice && !isThisCorrect && (
                                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-destructive shrink-0">
                                            <XCircle className="w-3.5 h-3.5" /> Your Answer
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Step-by-Step Explanation Box */}
                                {q.explanation && (
                                  <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1">
                                    <span className="font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                      <Sparkles className="w-3.5 h-3.5" />
                                      Detailed Explanation:
                                    </span>
                                    <p className="text-muted-foreground leading-relaxed">
                                      {q.explanation}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      <div className="flex justify-center pt-6">
                        <Button
                          variant="gradient"
                          onClick={() => {
                            setSelectedTest(null);
                            setReviewMode(false);
                            setTestCompleted(false);
                          }}
                          className="rounded-xl gap-2 font-bold px-8 h-11 shadow-md"
                        >
                          <Home className="w-4 h-4" />
                          Back to Test Series
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* Pre-Test Guidelines & Terms Agreement Modal */}
      <TestInstructionsModal
        open={!!instructionsTest}
        onOpenChange={(open) => {
          if (!open) setInstructionsTest(null);
        }}
        test={instructionsTest}
        onConfirmStart={handleConfirmedStart}
      />

      {/* Submit Confirmation Modal */}
      <TestSubmitConfirmModal
        open={isConfirmSubmitOpen}
        onOpenChange={setIsConfirmSubmitOpen}
        onConfirmSubmit={() => handleFinalSubmit(false)}
        answeredCount={answers.filter((a) => a !== undefined && a !== null).length}
        totalCount={selectedTest?.questions?.length || 0}
        unansweredCount={
          (selectedTest?.questions?.length || 0) -
          answers.filter((a) => a !== undefined && a !== null).length
        }
        isSaving={isSaving}
      />

      {/* Anti-Cheat Tab Switching Warning Modal */}
      <TestTabSwitchWarningModal
        open={isTabWarningOpen}
        onAcknowledge={() => setIsTabWarningOpen(false)}
        switchCount={tabSwitchCount}
        maxSwitches={3}
      />

      {/* Test Series Unlock Checkout Modal */}
      <FolderCheckoutModal
        open={!!checkoutFolder}
        onOpenChange={(open) => {
          if (!open) setCheckoutFolder(null);
        }}
        folder={checkoutFolder}
        onUnlockSuccess={(f) => {
          navigate(`/tests/${f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
        }}
      />

      {/* Admin Price Set/Update Dialog */}
      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-accent" />
              Set Test Series Price
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSavePrice} className="space-y-5 pt-2">
            {priceFolderTarget && (
              <div className="p-3 rounded-xl bg-secondary/50 border border-border/60">
                <p className="text-xs text-muted-foreground font-semibold">Folder</p>
                <p className="text-base font-bold text-foreground">{priceFolderTarget.name}</p>
              </div>
            )}

            {/* Free Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <div>
                <p className="text-sm font-bold text-foreground">Make FREE for all students</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Students can attempt all tests without purchasing
                </p>
              </div>
              <Switch
                checked={isFreeToggle}
                onCheckedChange={(checked) => {
                  setIsFreeToggle(checked);
                  if (checked) setNewPriceValue(0);
                  else setNewPriceValue(299);
                }}
              />
            </div>

            {/* Price Input */}
            {!isFreeToggle && (
              <div className="space-y-2">
                <Label htmlFor="student-test-price" className="text-sm font-bold">
                  Price (₹)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="student-test-price"
                    type="number"
                    min={1}
                    step={1}
                    value={newPriceValue}
                    onChange={(e) => setNewPriceValue(e.target.value)}
                    className="pl-9 h-11 text-lg font-bold"
                    placeholder="e.g. 299"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Students pay this one-time price to unlock all tests in this folder.
                </p>
              </div>
            )}

            {/* Preview */}
            <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-center">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Student will see</p>
              <p className="text-2xl font-black text-accent mt-1">
                {isFreeToggle ? 'FREE' : `₹${Number(newPriceValue) || 0}`}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPriceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" className="gap-1.5 font-bold" disabled={updateFolderPrice.isPending}>
                <Check className="w-4 h-4" />
                {updateFolderPrice.isPending ? 'Saving...' : 'Save Price'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Tests;
