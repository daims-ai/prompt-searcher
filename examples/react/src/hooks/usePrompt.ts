import { useState, useCallback } from "react";
import { client } from "@/lib/client";

interface UsePromptReturn {
  selectedPrompt: string | null;
  dialogOpen: boolean;
  loading: boolean;
  error: string | null;
  getPrompt: (skey: string) => Promise<void>;
  closeDialog: () => void;
}

export function usePrompt(): UsePromptReturn {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPrompt = useCallback(async (skey: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.getPrompt(skey);

      if (response.success) {
        setSelectedPrompt(response.prompt);
        setDialogOpen(true);
      } else {
        setError("Failed to fetch prompt.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return {
    selectedPrompt,
    dialogOpen,
    loading,
    error,
    getPrompt,
    closeDialog,
  };
}
