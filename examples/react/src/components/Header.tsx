import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="mb-12 text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <Sparkles className="size-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">Prompt Searcher</h1>
      </div>
      <p className="text-muted-foreground text-lg">
        Prompt search example using DAIMS API
      </p>
    </header>
  );
}
