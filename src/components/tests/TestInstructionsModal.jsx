import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ShieldAlert,
  Clock,
  HelpCircle,
  Award,
  AlertCircle,
  FileCheck2,
  CheckCircle2,
  Eye,
  Lock,
} from 'lucide-react';

export const TestInstructionsModal = ({
  open,
  onOpenChange,
  test,
  onConfirmStart,
}) => {
  const [agreed, setAgreed] = useState(false);

  if (!test) return null;

  // Breakdown question types
  const questions = test.questions || [];
  let mcqCount = 0;
  let assertionCount = 0;
  let caseStudyCount = 0;

  questions.forEach((q) => {
    const text = (q.question || '').toLowerCase();
    if (text.includes('[case study') || text.startsWith('case study')) {
      caseStudyCount++;
    } else if (text.includes('assertion (a)') || text.startsWith('assertion:')) {
      assertionCount++;
    } else {
      mcqCount++;
    }
  });

  const handleStart = () => {
    if (!agreed) return;
    onConfirmStart(test);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 rounded-2xl bg-card border-border">
        <DialogHeader className="space-y-1.5 sm:space-y-2 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
              {test.category || 'General Test'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Anti-Cheat Monitored
            </span>
          </div>

          <DialogTitle className="text-lg sm:text-2xl font-black font-heading text-foreground">
            {test.title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Please read the examination guidelines, question pattern, and terms carefully before beginning.
          </DialogDescription>
        </DialogHeader>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2">
          <div className="p-2.5 sm:p-3 bg-secondary/40 rounded-xl border border-border/80 text-center">
            <Clock className="w-4 h-4 mx-auto text-primary mb-1" />
            <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">Duration</p>
            <p className="text-xs sm:text-base font-black text-foreground">
              {test.duration_minutes || 30} Mins
            </p>
          </div>
          <div className="p-2.5 sm:p-3 bg-secondary/40 rounded-xl border border-border/80 text-center">
            <HelpCircle className="w-4 h-4 mx-auto text-accent mb-1" />
            <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">Questions</p>
            <p className="text-xs sm:text-base font-black text-foreground">
              {questions.length} Total
            </p>
          </div>
          <div className="p-2.5 sm:p-3 bg-secondary/40 rounded-xl border border-border/80 text-center">
            <Award className="w-4 h-4 mx-auto text-amber-500 mb-1" />
            <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">Total Marks</p>
            <p className="text-xs sm:text-base font-black text-foreground">
              {test.total_marks || 50} Marks
            </p>
          </div>
          <div className="p-2.5 sm:p-3 bg-secondary/40 rounded-xl border border-border/80 text-center">
            <Lock className="w-4 h-4 mx-auto text-rose-500 mb-1" />
            <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">Attempts</p>
            <p className="text-xs sm:text-base font-black text-rose-600 dark:text-rose-400">
              Strictly 1
            </p>
          </div>
        </div>

        {/* Section 1: Question Types Breakdown */}
        <div className="space-y-2 pt-1 sm:pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-primary" />
            Question Pattern & Types Included
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  MCQs
                </span>
                <span className="text-xs font-black text-foreground">{mcqCount}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Standard single-choice objective questions.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Assertion & Reason
                </span>
                <span className="text-xs font-black text-foreground">{assertionCount}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Analytical reasoning and conceptual clarity.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  Case Study
                </span>
                <span className="text-xs font-black text-foreground">{caseStudyCount}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Real-world context & experiment-based questions.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Anti-Cheat & Exam Rules */}
        <div className="space-y-2.5 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            Strict Exam Rules & Anti-Cheat Protocols
          </h4>
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-2 text-xs text-foreground/90">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <p>
                <strong>No Re-attempt:</strong> Once you submit this test, your score is final. You cannot re-take or restart this test.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <p>
                <strong>Tab Switching is strictly monitored:</strong> Switching tabs or minimizing the browser will trigger anti-cheat warnings. Multiple violations will automatically force-submit your test.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <p>
                <strong>Anti-Copy Protections:</strong> Right-clicking, copying questions, and inspection shortcuts are disabled.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <p>
                <strong>Explanations & Answers:</strong> Correct answers and detailed step-by-step explanations will be shown <strong>only after</strong> your final submission.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <p>
                <strong>Auto-Submit Timer:</strong> The test will automatically conclude when the countdown timer reaches 00:00.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Terms Agreement Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors">
            <Checkbox
              id="test-terms-agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
              className="mt-0.5"
            />
            <span className="text-xs text-foreground font-medium select-none leading-relaxed">
              I have read and understood all the instructions above. I agree to abide by the anti-cheat guidelines, and I understand that <strong>this test cannot be reattempted</strong> after submission.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="gradient"
            disabled={!agreed}
            onClick={handleStart}
            className="w-full sm:w-auto px-6 font-bold text-xs gap-2 shadow-lg disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Accept & Start Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
