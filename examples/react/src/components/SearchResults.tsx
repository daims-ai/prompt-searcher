import { Eye } from "lucide-react";
import type { SearchListItem } from "prompt-searcher";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGE_BASE_URL } from "@/lib/client";

interface SearchResultsProps {
  results: SearchListItem[];
  onViewPrompt: (skey: string) => void;
  loading: boolean;
}

export function SearchResults({
  results,
  onViewPrompt,
  loading,
}: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
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
                  onClick={() => onViewPrompt(item.metadata.key)}
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
  );
}
