import { useState, useCallback } from "react";
import {
  DaimsClient,
  type SearchListItem,
  type SearchRequestParams,
} from "prompt-searcher";
import { Search, Loader2, Eye, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const API_KEY = "test";
const client = new DaimsClient({ apiKey: API_KEY });
const IMAGE_BASE_URL = client.imageBaseUrl;

function App() {
  const [query, setQuery] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cardType, setCardType] = useState<"create" | "edit">("create");
  const [searchType, setSearchType] =
    useState<SearchRequestParams["search_type"]>("keyword");
  const [results, setResults] = useState<SearchListItem[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);

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
        // Extract only the base64 part (remove data:image/...;base64,)
        const base64 = result.split(",")[1];
        setImageBase64(base64);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleSearch = useCallback(async () => {
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
    setSelectedPrompt(null);

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
  }, [query, imageBase64, cardType, searchType]);

  const handleGetPrompt = useCallback(async (skey: string) => {
    if (!API_KEY) {
      setError("API key is not set.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await client.getPrompt(skey);

      if (response.success) {
        setSelectedPrompt(response.prompt);
        setPromptDialogOpen(true);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Sparkles className="size-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              Prompt Searcher
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Prompt search example using DAIMS API
          </p>
        </header>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Card Type Select */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Card Type</span>
                <Select
                  value={cardType}
                  onValueChange={(value: "create" | "edit") =>
                    setCardType(value)
                  }
                >
                  <SelectTrigger
                    className="w-[140px]"
                    aria-label="Select card type"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="edit">Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Type Select */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Search Type</span>
                <Select
                  value={searchType}
                  onValueChange={(value: SearchRequestParams["search_type"]) =>
                    setSearchType(value)
                  }
                >
                  <SelectTrigger
                    className="w-[140px]"
                    aria-label="Select search type"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyword">Keyword</SelectItem>
                    <SelectItem value="style">Style</SelectItem>
                    <SelectItem value="object">Object</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Input */}
              <div className="flex flex-1 gap-2">
                {searchType === "keyword" ? (
                  <Input
                    type="text"
                    placeholder="Enter search keyword..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                ) : (
                  <div className="flex flex-1 items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="size-10 rounded object-cover"
                      />
                    )}
                  </div>
                )}
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <Search />}
                  Search
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-destructive text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <Badge variant="secondary">{results.length} results</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden p-0 rounded-md transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={`${IMAGE_BASE_URL}/${item.metadata.key}`}
                      alt={item.metadata.key}
                      className="size-full object-cover transition-transform"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleGetPrompt(item.metadata.key)}
                        disabled={loading}
                        className="cursor-pointer"
                      >
                        <Eye className="size-4" />
                        View Prompt
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Prompt Dialog */}
        <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
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
                {selectedPrompt}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
