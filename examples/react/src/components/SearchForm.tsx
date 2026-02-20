import { Search, Loader2 } from "lucide-react";
import type { SearchRequestParams } from "prompt-searcher";

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

interface SearchFormProps {
  query: string;
  onQueryChange: (query: string) => void;
  cardType: "create" | "edit";
  onCardTypeChange: (type: "create" | "edit") => void;
  searchType: SearchRequestParams["search_type"];
  onSearchTypeChange: (type: SearchRequestParams["search_type"]) => void;
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  loading: boolean;
  error: string | null;
}

export function SearchForm({
  query,
  onQueryChange,
  cardType,
  onCardTypeChange,
  searchType,
  onSearchTypeChange,
  imagePreview,
  onFileChange,
  onSearch,
  loading,
  error,
}: SearchFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Card Type</span>
            <Select value={cardType} onValueChange={onCardTypeChange}>
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

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Search Type</span>
            <Select value={searchType} onValueChange={onSearchTypeChange}>
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

          <div className="flex flex-1 gap-2">
            {searchType === "keyword" ? (
              <Input
                type="text"
                placeholder="Enter search keyword..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
            ) : (
              <div className="flex flex-1 items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
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
            <Button onClick={onSearch} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Search />}
              Search
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-destructive text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
