import { useImageUpload } from "@/hooks/useImageUpload";
import { useSearch } from "@/hooks/useSearch";
import { usePrompt } from "@/hooks/usePrompt";

import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { SearchResults } from "@/components/SearchResults";
import { PromptDialog } from "@/components/PromptDialog";

function App() {
  const imageUpload = useImageUpload();
  const search = useSearch();
  const prompt = usePrompt();

  const handleSearch = () => {
    search.search(imageUpload.imageBase64);
  };

  const isLoading = search.loading || prompt.loading;
  const error = search.error || prompt.error;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Header />

        <SearchForm
          query={search.query}
          onQueryChange={search.setQuery}
          cardType={search.cardType}
          onCardTypeChange={search.setCardType}
          searchType={search.searchType}
          onSearchTypeChange={search.setSearchType}
          imagePreview={imageUpload.imagePreview}
          onFileChange={imageUpload.handleFileChange}
          onSearch={handleSearch}
          loading={isLoading}
          error={error}
        />

        <SearchResults
          results={search.results}
          onViewPrompt={prompt.getPrompt}
          loading={isLoading}
        />

        <PromptDialog
          open={prompt.dialogOpen}
          onOpenChange={prompt.closeDialog}
          prompt={prompt.selectedPrompt}
        />
      </div>
    </div>
  );
}

export default App;
