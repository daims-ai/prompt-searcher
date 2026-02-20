import { useState, useCallback } from "react";
import type { SearchListItem, SearchRequestParams } from "prompt-searcher";
import { client } from "@/lib/client";

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  cardType: "create" | "edit";
  setCardType: (type: "create" | "edit") => void;
  searchType: SearchRequestParams["search_type"];
  setSearchType: (type: SearchRequestParams["search_type"]) => void;
  results: SearchListItem[];
  loading: boolean;
  error: string | null;
  search: (imageBase64: string | null) => Promise<void>;
  clearError: () => void;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [cardType, setCardType] = useState<"create" | "edit">("create");
  const [searchType, setSearchType] =
    useState<SearchRequestParams["search_type"]>("keyword");
  const [results, setResults] = useState<SearchListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (imageBase64: string | null) => {
      const isKeywordSearch = searchType === "keyword";
      const searchValue = isKeywordSearch ? query : imageBase64;

      if (!searchValue) {
        setError(
          isKeywordSearch
            ? "Please enter a search keyword."
            : "Please select an image.",
        );
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await client.search({
          card_type: cardType,
          search_type: searchType,
          value: searchValue,
        });

        if (response.success) {
          setResults(response.data.items);
          if (response.data.items.length === 0) {
            setError("No search results found.");
          }
        } else {
          setError("Search failed.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setLoading(false);
      }
    },
    [query, cardType, searchType],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    cardType,
    setCardType,
    searchType,
    setSearchType,
    results,
    loading,
    error,
    search,
    clearError,
  };
}
