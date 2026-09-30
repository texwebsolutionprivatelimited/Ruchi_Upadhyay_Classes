import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export const TestSubmitConfirmModal = ({
  open,
  onOpenChange,
  onConfirmSubmit,
  answeredCount,
  totalCount,
  unansweredCount,
  isSaving = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md p-4 sm:p-7 rounded-2xl bg-card border-border text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-xl font-bold font-heading text-foreground">
            Finish & Submit Test?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Please review your attempt status before final submission.
          </DialogDescription>
        </DialogHeader>

        {/* Warning Callout */}
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-semibold">
          ⚠️ Once submitted, you cannot re-attempt this test. Your result and score will be permanently saved.
        </div>

        {/* Summary Chips */}
        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Answered</p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {answeredCount} / {totalCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-secondary/50 border border-border text-center">
            <XCircle className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Unanswered</p>
            <p className="text-lg font-black text-foreground">
              {unansweredCount}
            </p>
          </div>
        </div>

        {unansweredCount > 0 && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            You still have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}. You can go back and answer them before submitting!
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="w-full sm:w-auto text-xs font-semibold rounded-xl gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Test
          </Button>

          <Button
            type="button"
            variant="gradient"
            onClick={onConfirmSubmit}
            disabled={isSaving}
            className="w-full sm:w-auto text-xs font-bold px-6 rounded-xl gap-2 shadow-md"
          >
            {isSaving ? 'Submitting...' : 'Yes, Submit Test'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
