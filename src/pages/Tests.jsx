import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Clock, ArrowRight, Target, Lock, ChevronRight, ChevronLeft, CheckCircle, XCircle, Trophy, Zap, RotateCcw, Home, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTests } from '@/hooks/useTests';
import { useIsAdmin, useCoursesList, useUserPurchases, useBuyTest, useCategoryPurchases, useBuyCategory } from '@/hooks/useAdmin';
import { useCourses } from '@/hooks/useCourses';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { mutate: buyTest } = useBuyTest();
  const { mutate: buyCategory } = useBuyCategory();

  // Fetch Categories
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Mapping for category logic
  const categoryInfo = urlCategory && categories ? categories.find(c => c.slug === urlCategory) : null;
  const categoryName = categoryInfo?.name || '';

  // Fetch Tests
  const { data: allTests, isLoading: testsLoading } = useTests(categoryName || undefined);

  // Test Player State
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isLoading = categoriesLoading || testsLoading;
  const checkAccess = (test) => {
    if (isAdmin)
      return true;
    if (test && test.price === 0)
      return true;
    if (test && purchases?.some(p => p.test_id === test.id))
      return true;
    // Check if category is purchased
    const isCategoryPurchased = categoryPurchases?.some(cp =>
      cp.category === (test?.category || categoryName) &&
      (cp.content_type === 'tests' || cp.content_type === 'both')
    );
    if (isCategoryPurchased)
      return true;
    const isCategoryPurchased2 = enrolledCourses?.some(ec => {
      const courseDetails = allCourses?.find(c => c.id === ec.course_id);
      return courseDetails?.category === (test?.category || categoryName);
    });
    return !!isCategoryPurchased2;
  };
  const handleBuyTest = (test) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to purchase tests',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    buyTest(test.id);
  };

  const handleBuyCategory = (category) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to purchase categories',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    // Calculate total price for all tests in category
    const categoryTests = allTests?.filter(t => t.category === category.name) || [];
    const totalPrice = categoryTests.reduce((sum, test) => sum + (test.price || 0), 0);

    buyCategory({ category: category.name, contentType: 'tests', amount: totalPrice });
  };

  const checkCategoryAccess = (categoryName) => {
    if (!user) return false;
    if (isAdmin) return true;

    // Check if category is purchased
    const isCategoryPurchased = categoryPurchases?.some(cp =>
      cp.category === categoryName &&
      (cp.content_type === 'tests' || cp.content_type === 'both')
    );
    if (isCategoryPurchased) return true;

    // Check if course in the same category is purchased
    const isCourseEnrolled = enrolledCourses?.some(ec => {
      const courseDetails = allCourses?.find(c => c.id === ec.course_id);
      return courseDetails?.category === categoryName;
    });
    return !!isCourseEnrolled;
  };
  const handleStartTest = (test) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to take tests',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    if (!checkAccess(test)) {
      handleBuyTest(test);
      return;
    }
    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowAnswer(false);
    setTestCompleted(false);
  };
  const handleAnswer = (answerIndex) => {
    if (showAnswer)
      return;
    setAnswers([...answers, answerIndex]);
    setShowAnswer(true);
  };
  const calculateScore = () => {
    if (!selectedTest || !selectedTest.questions || selectedTest.questions.length === 0)
      return { correct: 0, total: 0, percentage: 0, xp: 0 };

    let correct = 0;
    selectedTest.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct++;
      }
    });

    const totalQuestions = selectedTest.questions.length;
    const percentage = Math.round((correct / totalQuestions) * 100) || 0;

    // Use test.reward_points as the base, weighted by performance
    const xpBase = selectedTest.reward_points || 0;
    const xpEarned = Math.round((percentage / 100) * xpBase) || 0;

    return {
      correct,
      total: totalQuestions,
      percentage: isNaN(percentage) ? 0 : percentage,
      xp: isNaN(xpEarned) ? 0 : xpEarned,
    };
  };

  const saveTestResult = async () => {
    if (!user || !selectedTest)
      return;

    setIsSaving(true);
    const score = calculateScore();

    try {
      console.log('Attempting to save test result:', {
        testId: selectedTest.id,
        score: score.percentage,
        xp: score.xp
      });

      // Check if user already took this test to prevent double XP
      const { data: existingResults, error: fetchError } = await supabase
        .from('test_results')
        .select('id')
        .eq('user_id', user.id)
        .eq('test_id', selectedTest.id)
        .limit(1);

      if (fetchError) throw fetchError;

      const hasAttemptedBefore = existingResults && existingResults.length > 0;

      const { error: insertError } = await supabase.from('test_results').insert({
        user_id: user.id,
        test_id: selectedTest.id,
        score: score.percentage || 0,
        total_questions: score.total || 0,
        xp_earned: hasAttemptedBefore ? 0 : (score.xp || 0),
      });

      if (insertError) throw insertError;

      if (!hasAttemptedBefore && score.xp > 0) {
        await addXP(score.xp);
        toast({
          title: 'Congratulations! 🏆',
          description: `You earned ${score.xp} XP for your first completion of this challenge!`,
        });
      } else if (hasAttemptedBefore) {
        toast({
          title: 'Result Saved',
          description: `Score: ${score.percentage}%. Remember, XP is only awarded for the first attempt.`,
        });
      }
    } catch (error) {
      console.error('Error saving test result:', error);
      toast({
        title: 'Error saving results',
        description: error.message || 'Your progress couldn\'t be saved. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleNext = async () => {
    if (!selectedTest)
      return;
    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
    }
    else {
      setTestCompleted(true);
      await saveTestResult();
    }
  };
  const resetTest = () => {
    setSelectedTest(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowAnswer(false);
    setTestCompleted(false);
  };
  // Sub-renderings
  const renderTestPlayer = () => {
    if (!selectedTest)
      return null;
    const question = selectedTest.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100;
    return (<div className="container mx-auto px-4 max-w-3xl">
      <div className="mb-4 md:mb-6">
        <Button variant="outline" onClick={resetTest} className="h-9 px-4 rounded-xl bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Exit Test
        </Button>
      </div>
      <Card className="border-border shadow-xl">
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <Badge variant="secondary" className="px-2.5 md:px-3 py-1 text-xs md:text-sm">{selectedTest.title}</Badge>
            <span className="text-xs md:text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {selectedTest.questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="text-lg md:text-xl font-bold font-heading mb-6 md:mb-8">{question.question}</h3>
              <div className="space-y-2 md:space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === index;
                  const isCorrect = index === question.correctAnswer;
                  let optionClass = 'border-border hover:border-primary/50';
                  if (showAnswer) {
                    if (isCorrect)
                      optionClass = 'border-success bg-success/5 text-success';
                    else if (isSelected)
                      optionClass = 'border-destructive bg-destructive/5 text-destructive';
                  }
                  else if (isSelected) {
                    optionClass = 'border-primary bg-primary/5';
                  }
                  return (<motion.button key={index} onClick={() => handleAnswer(index)} disabled={showAnswer} className={`w-full p-5 rounded-2xl border-2 text-left transition-all font-medium ${optionClass}`} whileHover={{ scale: showAnswer ? 1 : 1.01 }} whileTap={{ scale: showAnswer ? 1 : 0.99 }}>
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-primary text-white' : 'bg-secondary'}`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showAnswer && isCorrect && <CheckCircle className="w-5 h-5" />}
                      {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                    </div>
                  </motion.button>);
                })}
              </div>
            </motion.div>
          </AnimatePresence>
          {showAnswer && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-3 md:p-4 rounded-xl bg-secondary/50 border border-primary/10">
              <p className="text-xs md:text-sm leading-relaxed"><strong>Explanation:</strong> {question.explanation}</p>
            </div>
            <Button onClick={handleNext} className="w-full h-11 md:h-12 text-base md:text-lg font-bold" variant="gradient">
              {currentQuestion < selectedTest.questions.length - 1 ? 'Continue to Next Question' : 'Complete Challenge'}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Button>
          </motion.div>)}
        </CardContent>
      </Card>
    </div>);
  };
  const renderResults = () => {
    if (!selectedTest)
      return null;
    const score = calculateScore();
    return (<div className="container mx-auto px-4 max-w-2xl text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="shadow-2xl border-primary/10 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="pt-8 md:pt-10 px-4 md:px-6">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl rotate-3">
              <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white -rotate-3" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold font-heading">Victory Guaranteed!</CardTitle>
            <CardDescription className="text-base md:text-lg">You've successfully conquered {selectedTest.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 md:space-y-8 p-6 md:p-10 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="p-4 md:p-5 rounded-2xl bg-secondary/40 border border-border/50">
                <p className="text-3xl md:text-4xl font-bold text-primary">{score.percentage}%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Accuracy</p>
              </div>
              <div className="p-4 md:p-5 rounded-2xl bg-secondary/40 border border-border/50">
                <p className="text-3xl md:text-4xl font-bold text-success">{score.correct}/{score.total}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Correct</p>
              </div>
              <div className="p-4 md:p-5 rounded-2xl bg-secondary/40 border border-border/50">
                <div className="flex items-center justify-center gap-1.5 text-warning">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                  <p className="text-3xl md:text-4xl font-bold">{score.xp}</p>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">XP Earned</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => handleStartTest(selectedTest)} variant="outline" className="flex-1 h-12 rounded-xl">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Test
              </Button>
              <Button onClick={resetTest} variant="gradient" className="flex-1 h-12 rounded-xl shadow-lg">
                <Home className="w-4 h-4 mr-2" />
                More Challenges
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>);
  };
  if (urlCategory && !categoryInfo) {
    return (<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Button onClick={() => navigate('/tests')}>Go Back to Tests</Button>
      </div>
    </div>);
  }
  return (<div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 pt-20 md:pt-24 pb-16">
      <AnimatePresence mode="wait">
        {!urlCategory ? (
          /* Categories Grid */
          <motion.div key="cat-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="pt-6 pb-8 md:pt-8 md:pb-10 bg-gradient-to-br from-primary/10 via-background to-accent/10">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-accent/10 text-accent mb-4 md:mb-6 font-medium text-xs md:text-sm">
                    <Target className="w-4 h-4 md:w-5 md:h-5" /> Practice Arena
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-3 md:mb-4">
                    Test Your <span className="text-primary">Knowledge</span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">Master every concept through our curated category-wise challenges.</p>
                </div>
              </div>
            </section>
            <section className="py-8 md:py-12">
              <div className="container mx-auto px-4">
                {isLoading ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-secondary/50 rounded-2xl animate-pulse" />)}
                </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {categories?.map((category, index) => {
                    const hasCatAccess = checkCategoryAccess(category.name);
                    const catTests = allTests?.filter(t => t.category === category.name) || [];
                    const totalPrice = catTests.reduce((sum, test) => sum + (test.price || 0), 0);
                    const totalDuration = catTests.reduce((acc, t) => acc + t.duration_minutes, 0);

                    return (<motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card className="group hover:shadow-xl transition-all border-border hover:border-primary/40 h-full flex flex-col">
                        <CardHeader className="p-5 md:p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-xl md:text-2xl shadow-lg`}>
                              {category.icon}
                            </div>
                            {hasCatAccess ? (
                              <Badge variant="default" className="bg-green-500 text-white">Owned</Badge>
                            ) : (
                              <div className="p-2 rounded-full bg-secondary text-muted-foreground"><Lock className="w-5 h-5" /></div>
                            )}
                          </div>
                          <CardTitle className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">{category.name}</CardTitle>
                          <CardDescription className="line-clamp-2 text-sm">{category.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 md:p-6 pt-0 flex-1 flex flex-col justify-end gap-6">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="font-semibold text-[10px] md:text-xs">{catTests.length} Total Challenges</Badge>
                            <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              {totalDuration} mins
                            </div>
                          </div>
                          {!hasCatAccess && totalPrice > 0 && (
                            <div className="text-center">
                              <span className="text-sm font-bold text-primary">₹{totalPrice}</span>
                            </div>
                          )}
                          {hasCatAccess ? (
                            <Button variant="gradient" className="w-full h-10 md:h-11 rounded-xl text-sm" onClick={() => navigate(`/tests/${category.slug}`)}>
                              Enter Arena
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="gradient"
                                className="w-full h-10 md:h-11 rounded-xl text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyCategory(category);
                                }}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Buy Category (₹{totalPrice})
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full h-10 md:h-11 rounded-xl text-sm"
                                onClick={() => navigate(`/tests/${category.slug}`)}
                              >
                                View Details
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>);
                  })}
                </div>)}
              </div>
            </section>
          </motion.div>) : selectedTest ? (
            /* Test Player or Results View */
            <motion.div key="player-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              {testCompleted ? renderResults() : renderTestPlayer()}
            </motion.div>) : (
          /* Category-Specific Tests List */
          <motion.div key="test-list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <section className="pt-6 pb-8 md:pt-8 md:pb-10 bg-gradient-to-br from-primary/10 via-background to-accent/10">
              <div className="container mx-auto px-4">
                <Button variant="outline" onClick={() => navigate('/tests')} className="mb-4 md:mb-6 h-9 px-4 rounded-xl bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back to All Areas
                </Button>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                  <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
                    <span className="text-3xl md:text-4xl lg:text-5xl drop-shadow-md">{categoryInfo?.icon}</span>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
                      {categoryInfo?.name} <span className="text-primary text-lg md:text-xl lg:text-2xl ml-2">Challenges</span>
                    </h1>
                  </div>
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground font-medium">{categoryInfo?.description}</p>
                </motion.div>
              </div>
            </section>
            <section className="py-8 md:py-12 text-center">
              <div className="container mx-auto px-4">
                {isLoading ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {[1, 2, 3].map(i => <div key={i} className="h-48 bg-secondary/50 rounded-2xl animate-pulse" />)}
                </div>) : allTests && allTests.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {allTests.map((test, index) => (<motion.div key={test.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="glass-card hover-lift border-primary/5 h-full flex flex-col group relative overflow-visible">
                      <div className="absolute -top-3 -right-2 z-10 px-3 py-1 rounded-lg shadow-xl bg-gradient-to-r from-warning to-orange-500 text-white text-[10px] font-black tracking-widest uppercase">
                        {test.reward_points} XP
                      </div>
                      <CardHeader className="pt-8 text-left">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="bg-secondary/50 border-primary/10"><Clock className="w-3 h-3 mr-1" /> {test.duration_minutes}m</Badge>
                          <Badge variant="outline" className="bg-secondary/50 border-primary/10"><Award className="w-3 h-3 mr-1" /> {test.total_marks} Marks</Badge>
                        </div>
                        <CardTitle className="text-xl font-bold font-heading line-clamp-2 leading-tight group-hover:text-primary transition-colors">{test.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end gap-6 text-left">
                        <p className="text-muted-foreground text-sm line-clamp-2 italic opacity-80 group-hover:opacity-100 transition-opacity">
                          {test.description}
                        </p>
                        <div className="pt-6 border-t border-primary/5">
                          {checkAccess(test) ? (<Button variant="gradient" className="w-full h-11 rounded-xl shadow-lg font-bold" onClick={() => handleStartTest(test)}>
                            Start Challenge <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>) : (<div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                              <span className="text-lg font-black text-primary">₹{test.price || 0}</span>
                              <Button variant="gradient" size="sm" className="px-5 rounded-lg font-bold" onClick={() => handleBuyTest(test)}>Unlock Individual</Button>
                            </div>
                            <Button variant="outline" className="w-full h-10 text-[11px] rounded-xl border-primary/10 font-bold" onClick={() => navigate(`/courses/${urlCategory}`)}>Full Category Access</Button>
                          </div>)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>))}
                </div>) : (<div className="py-20 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                  <Target className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
                  <h3 className="text-2xl font-bold text-foreground">Arena Empty</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mt-2">No active challenges available for this category. Check back soon for new content!</p>
                </div>)}
              </div>
            </section>
          </motion.div>)}
      </AnimatePresence>
    </main>
    <Footer />
  </div>);
};
export default Tests;
