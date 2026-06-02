import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Award, ChevronRight, ArrowLeft, ChevronLeft, CheckCircle, XCircle, Trophy, Zap, RotateCcw, Home, Lock, ShoppingCart, BookOpen } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTests } from '@/hooks/useTests';
import { useCategories } from '@/hooks/useCategories';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin, useCoursesList, useUserPurchases, useBuyTest } from '@/hooks/useAdmin';
import { courseCategories } from '@/data/mockData';
const CategoryTests = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user, addXP } = useAuth();
  const { toast } = useToast();
  const { data: isAdmin } = useIsAdmin();
  const { enrolledCourses } = useCourses();
  const { data: allCourses } = useCoursesList();
  const categoryInfo = courseCategories.find(c => c.slug === category);
  const categoryName = categoryInfo?.name || '';
  const { data: tests, isLoading } = useTests(categoryName);
  const { data: purchases } = useUserPurchases();
  const { mutate: buyTest } = useBuyTest();
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hasAccess = (test) => {
    if (isAdmin)
      return true;
    // Check if test is free
    if (test && test.price === 0)
      return true;
    // Check if individual test is purchased
    if (test && purchases?.some(p => p.test_id === test.id))
      return true;
    // Check if course in the same category is purchased
    const isCategoryPurchased = enrolledCourses?.some(ec => {
      const courseDetails = allCourses?.find(c => c.id === ec.course_id);
      return courseDetails?.category === categoryName;
    });
    return !!isCategoryPurchased;
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
    if (!hasAccess(test)) {
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
  const calculateScore = () => {
    if (!selectedTest)
      return { correct: 0, total: 0, percentage: 0, xp: 0 };
    let correct = 0;
    let totalXp = 0;
    selectedTest.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct++;
        totalXp += q.points;
      }
    });
    return {
      correct,
      total: selectedTest.questions.length,
      percentage: Math.round((correct / selectedTest.questions.length) * 100),
      xp: totalXp,
    };
  };
  const saveTestResult = async () => {
    if (!user || !selectedTest)
      return;
    setIsSaving(true);
    const score = calculateScore();
    try {
      console.log('🔍 Checking for previous attempts for test:', selectedTest.id);
      // Check if user already took this test to prevent double XP
      const { data: existingResults, error: fetchError } = await supabase
        .from('test_results')
        .select('id')
        .eq('user_id', user.id)
        .eq('test_id', selectedTest.id)
        .limit(1);
      if (fetchError) {
        console.error('❌ Error fetching previous results:', fetchError);
      }
      const hasAttemptedBefore = existingResults && existingResults.length > 0;
      console.log('📊 Has attempted before:', hasAttemptedBefore);
      const { error: insertError } = await supabase.from('test_results').insert({
        user_id: user.id,
        test_id: selectedTest.id,
        score: score.percentage,
        total_questions: score.total,
        xp_earned: score.xp,
      });
      if (insertError) {
        console.error('❌ Error saving test result:', insertError);
        toast({
          title: 'Error saving result',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }
      if (!hasAttemptedBefore) {
        console.log('💎 Awarding XP for first attempt:', score.xp);
        await addXP(score.xp);
        toast({
          title: 'Test Completed! 🏆',
          description: `You earned ${score.xp} XP for your first attempt!`,
        });
      }
      else {
        console.log('🚫 Skipping XP award (retry attempt)');
        toast({
          title: 'Test Attempt Saved',
          description: `Score: ${score.percentage}%. (No extra XP for retakes)`,
        });
      }
    }
    catch (error) {
      console.error('Error saving test result:', error);
    }
    finally {
      setIsSaving(false);
    }
  };
  const resetTest = () => {
    setSelectedTest(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowAnswer(false);
    setTestCompleted(false);
  };
  if (!categoryInfo) {
    return (<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Button onClick={() => navigate('/tests')}>Go Back to Tests</Button>
      </div>
    </div>);
  }
  // Test in progress view
  if (selectedTest && !testCompleted) {
    const question = selectedTest.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100;
    return (<div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-6">
            <Button variant="outline" onClick={resetTest} className="h-9 px-4 rounded-xl bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Exit Test
            </Button>
          </div>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary">{selectedTest.title}</Badge>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {selectedTest.questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-xl font-semibold mb-6">{question.question}</h3>

                  <div className="space-y-3">
                    {question.options.map((option, index) => {
                      const isSelected = answers[currentQuestion] === index;
                      const isCorrect = index === question.correctAnswer;
                      let optionClass = 'border-border hover:border-primary';
                      if (showAnswer) {
                        if (isCorrect)
                          optionClass = 'border-success bg-success/10';
                        else if (isSelected)
                          optionClass = 'border-destructive bg-destructive/10';
                      }
                      else if (isSelected) {
                        optionClass = 'border-primary bg-primary/10';
                      }
                      return (<motion.button key={index} onClick={() => handleAnswer(index)} disabled={showAnswer} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionClass}`} whileHover={{ scale: showAnswer ? 1 : 1.01 }} whileTap={{ scale: showAnswer ? 1 : 0.99 }}>
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showAnswer && isCorrect && <CheckCircle className="w-5 h-5 text-success" />}
                          {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                        </div>
                      </motion.button>);
                    })}
                  </div>

                  {showAnswer && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </motion.div>)}
                </motion.div>
              </AnimatePresence>

              {showAnswer && (<Button onClick={handleNext} className="w-full" variant="gradient">
                {currentQuestion < selectedTest.questions.length - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>)}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>);
  }
  // Test completed view
  if (testCompleted && selectedTest) {
    const score = calculateScore();
    return (<div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Test Completed!</CardTitle>
                <CardDescription>{selectedTest.title}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 text-center">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">{score.percentage}%</p>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Accuracy</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 text-center">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-success">{score.correct}/{score.total}</p>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Correct</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 flex flex-col justify-center items-center">
                    <div className="flex items-center justify-center gap-1.5 text-warning">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{score.xp}</p>
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">XP Earned</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => handleStartTest(selectedTest)} variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry Test
                  </Button>
                  <Button onClick={resetTest} variant="gradient" className="flex-1">
                    <Home className="w-4 h-4 mr-2" />
                    More Tests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>);
  }
  // Test selection view
  return (<div className="min-h-screen bg-background">
    <Navbar />

    <main className="pt-20 md:pt-24 pb-16">
      <section className="pt-6 pb-8 md:pt-8 md:pb-10 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <Button variant="outline" onClick={() => navigate('/tests')} className="mb-4 h-9 px-4 rounded-xl bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to All Tests
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{categoryInfo.icon}</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground">
                {categoryInfo.name} <span className="text-primary">Tests</span>
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{categoryInfo.description}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (<div key={i} className="h-48 bg-secondary/50 rounded-2xl animate-pulse" />))}
          </div>) : tests && tests.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test, index) => (<motion.div key={test.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="glass-card hover-lift transition-all duration-500 border-primary/5 h-full flex flex-col group relative overflow-visible">
                {/* Floating Badge */}
                <div className="absolute -top-3 -left-2 z-10 px-3 py-1 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold tracking-wider uppercase">
                  {test.category}
                </div>

                <CardHeader className="pt-8">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      {test.duration_minutes} mins
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full border border-primary/10">
                      <Award className="w-3 h-3" />
                      {test.total_marks} Marks
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-warning bg-warning/10 px-2 py-0.5 rounded-full border border-warning/20">
                      <Zap className="w-3 h-3" />
                      {test.reward_points} Reward Points
                    </span>
                  </div>
                  <CardTitle className="text-xl font-heading font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {test.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col px-6">
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1 italic opacity-80 group-hover:opacity-100 transition-opacity">
                    {test.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                    {hasAccess(test) ? (<div className="flex flex-col gap-4 w-full">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg w-fit">
                        <Zap className="w-3 h-3 animate-pulse" />
                        {test.questions.length} Questions Await
                      </div>
                      <Button variant="gradient" size="sm" className="w-full group/btn justify-between h-11 rounded-xl btn-premium-hover shadow-lg" onClick={() => handleStartTest(test)}>
                        <span>Initiate Challenge</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>) : !user ? (<Button variant="outline" size="sm" className="w-full group/enroll border-primary/20 hover:border-primary/50 text-xs py-5 rounded-xl bg-white/5 btn-premium-hover" onClick={() => {
                      toast({
                        title: 'Please sign in',
                        description: 'You need to be logged in to access tests',
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
                          <span className="text-lg">₹{test.price || 0}</span>
                        </div>
                        <Button variant="gradient" size="sm" className="px-6 rounded-lg btn-premium-hover shadow-lg" onClick={() => handleBuyTest(test)}>
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
            <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Tests Available</h3>
            <p className="text-muted-foreground">
              Tests for {categoryInfo.name} will appear here once added by admin
            </p>
          </div>)}
        </div>
      </section>
    </main>

    <Footer />
  </div>);
};
export default CategoryTests;
