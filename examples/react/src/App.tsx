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
const IMAGE_BASE_URL = "https://asset.daims.ai/images";

function App() {
  const [query, setQuery] = useState("");
  const [cardType, setCardType] = useState<"create" | "edit">("create");
  const [searchType, setSearchType] =
    useState<SearchRequestParams["search_type"]>("keyword");
  const [results, setResults] = useState<SearchListItem[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError("검색어를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedPrompt(null);

    try {
      const client = new DaimsClient({ apiKey: API_KEY });
      const response = await client.search({
        card_type: cardType,
        search_type: searchType,
        value: query,
      });

      if (response.success) {
        setResults(response.data.items);
        if (response.data.items.length === 0) {
          setError("검색 결과가 없습니다.");
        }
      } else {
        setError("검색에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, [query, cardType, searchType]);

  const handleGetPrompt = useCallback(async (skey: string) => {
    if (!API_KEY) {
      setError("API 키가 설정되지 않았습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = new DaimsClient({ apiKey: API_KEY });
      const response = await client.getPrompt(skey);

      if (response.success) {
        setSelectedPrompt(response.prompt);
        setPromptDialogOpen(true);
      } else {
        setError("프롬프트를 가져오는데 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
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
            DAIMS API를 활용한 프롬프트 검색 예제
          </p>
        </header>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Card Type Select */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">카드 타입</span>
                <Select
                  value={cardType}
                  onValueChange={(value: "create" | "edit") =>
                    setCardType(value)
                  }
                >
                  <SelectTrigger
                    className="w-[140px]"
                    aria-label="카드 타입 선택"
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
                <span className="text-sm font-medium">검색 타입</span>
                <Select
                  value={searchType}
                  onValueChange={(value: SearchRequestParams["search_type"]) =>
                    setSearchType(value)
                  }
                >
                  <SelectTrigger
                    className="w-[140px]"
                    aria-label="검색 타입 선택"
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
                <Input
                  type="text"
                  placeholder="검색어를 입력하세요..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <Search />}
                  검색
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
              <h2 className="text-xl font-semibold">검색 결과</h2>
              <Badge variant="secondary">{results.length}개</Badge>
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
                        프롬프트 보기
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
                프롬프트
              </DialogTitle>
              <DialogDescription>
                이미지 생성에 사용된 프롬프트입니다.
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
