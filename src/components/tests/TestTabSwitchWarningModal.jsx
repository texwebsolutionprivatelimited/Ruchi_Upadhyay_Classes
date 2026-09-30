import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const TestTabSwitchWarningModal = ({
  open,
  onAcknowledge,
  switchCount,
  maxSwitches = 3,
}) => {
  const remaining = Math.max(0, maxSwitches - switchCount);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="w-[95vw] sm:max-w-md p-4 sm:p-7 rounded-2xl bg-card border-destructive/40 text-center shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center mx-auto mb-2 border border-destructive/30 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-xl font-black font-heading text-destructive flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            Anti-Cheat Violation Detected!
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            You have switched away from the active test window.
          </DialogDescription>
        </DialogHeader>

        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-left space-y-1.5 my-2">
          <p className="font-bold text-destructive">
            Warning {switchCount} of {maxSwitches} Recorded
          </p>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {remaining > 0 ? (
              <>
                Switching tabs, opening applications, or minimizing the test window is strictly prohibited during the exam. You have <strong>{remaining} warning{remaining > 1 ? 's' : ''} remaining</strong> before your test is automatically force-submitted!
              </>
            ) : (
              <>
                You have exceeded the maximum allowed tab switches. Your test is being automatically submitted now.
              </>
            )}
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="destructive"
            onClick={onAcknowledge}
            className="w-full font-bold text-xs rounded-xl shadow-md py-5"
          >
            I Understand & Return to Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
