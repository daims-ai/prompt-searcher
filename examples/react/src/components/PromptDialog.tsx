import { Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string | null;
}

export function PromptDialog({ open, onOpenChange, prompt }: PromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5" />
            Prompt
          </DialogTitle>
          <DialogDescription>
            This is the prompt used for image generation.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto rounded-lg bg-muted p-4">
          <pre className="whitespace-pre-wrap wrap-break-word font-mono text-sm">
            {prompt}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
