import { useState, useCallback } from "react";

interface UseImageUploadReturn {
  imageBase64: string | null;
  imagePreview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setImageBase64(null);
        setImagePreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        setImageBase64(base64);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const reset = useCallback(() => {
    setImageBase64(null);
    setImagePreview(null);
  }, []);

  return {
    imageBase64,
    imagePreview,
    handleFileChange,
    reset,
  };
}
