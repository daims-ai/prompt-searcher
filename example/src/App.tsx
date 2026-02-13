import { useMemo, useState } from "react";
import {
  DaimsApiError,
  DaimsClient,
  type SearchResponse,
} from "prompt-searcher";

type CardType = "create" | "edit";
type SearchType = "keyword" | "style" | "object";

const DEFAULT_SEARCH = "cinematic portrait";
const IMAGE_BASE_URL = "https://asset.daims.ai/images";

function App() {
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_DAIMS_API_KEY ?? "",
  );
  const [cardType, setCardType] = useState<CardType>("create");
  const [searchType, setSearchType] = useState<SearchType>("keyword");
  const [value, setValue] = useState(DEFAULT_SEARCH);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [error, setError] = useState("");

  const client = useMemo(() => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      return null;
    }
    return new DaimsClient({ apiKey: trimmed });
  }, [apiKey]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client) {
      setError("DAIMS API Key를 입력해 주세요.");
      return;
    }

    setError("");
    setSelectedPrompt([]);
    setSelectedKey("");
    setLoadingSearch(true);

    try {
      const result = await client.search({
        card_type: cardType,
        search_type: searchType,
        value,
      });
      setSearchResult(result);
    } catch (caught) {
      setSearchResult(null);
      setError(toErrorMessage(caught));
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleGetPrompt = async (skey: string) => {
    if (!client) {
      setError("DAIMS API Key를 입력해 주세요.");
      return;
    }

    setError("");
    setLoadingPrompt(true);
    setSelectedKey(skey);

    try {
      const result = await client.getPrompt(skey);
      setSelectedPrompt(result.detail.prompts);
    } catch (caught) {
      setSelectedPrompt([]);
      setError(toErrorMessage(caught));
    } finally {
      setLoadingPrompt(false);
    }
  };

  return (
    <main className="container">
      <h1>prompt-searcher Vite + React Example</h1>

      <form className="card form" onSubmit={handleSearch}>
        <label htmlFor="apiKey">DAIMS API Key</label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="DAIMS API Key"
          autoComplete="off"
        />

        <div className="row">
          <label htmlFor="cardType">card_type</label>
          <select
            id="cardType"
            value={cardType}
            onChange={(event) => setCardType(event.target.value as CardType)}
          >
            <option value="create">create</option>
            <option value="edit">edit</option>
          </select>
        </div>

        <div className="row">
          <label htmlFor="searchType">search_type</label>
          <select
            id="searchType"
            value={searchType}
            onChange={(event) =>
              setSearchType(event.target.value as SearchType)
            }
          >
            <option value="keyword">keyword</option>
            <option value="style">style</option>
            <option value="object">object</option>
          </select>
        </div>

        <label htmlFor="searchValue">value</label>
        <input
          id="searchValue"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="cinematic portrait"
        />

        <button type="submit" disabled={loadingSearch}>
          {loadingSearch ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <section className="card error">
          <strong>Error:</strong> {error}
        </section>
      )}

      <section className="card">
        <h2>Search Results</h2>
        {!searchResult && <p>검색을 실행하면 결과가 여기에 표시됩니다.</p>}
        {searchResult && searchResult.data.items.length === 0 && (
          <p>결과가 없습니다.</p>
        )}
        {searchResult && searchResult.data.items.length > 0 && (
          <ul className="list">
            {searchResult.data.items.map((item) => {
              const skey = item.metadata.key || item.id;
              const imageUrl = `${IMAGE_BASE_URL}/${item.metadata.key}`;
              return (
                <li key={item.id}>
                  <div>
                    <img
                      className="resultImage"
                      src={imageUrl}
                      alt={`${item.metadata.model} preview`}
                      loading="lazy"
                    />
                    <strong>{item.metadata.model}</strong>
                    <p>provider: {item.metadata.provider}</p>
                    <p>skey: {skey}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGetPrompt(skey)}
                    disabled={loadingPrompt}
                  >
                    {loadingPrompt && selectedKey === skey
                      ? "Loading..."
                      : "Get Prompt"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Prompt Detail</h2>
        {selectedPrompt.length === 0 && (
          <p>결과 항목에서 Get Prompt를 누르면 여기에 출력됩니다.</p>
        )}
        {selectedPrompt.length > 0 && (
          <ol className="promptList">
            {selectedPrompt.map((prompt, index) => (
              <li key={`${selectedKey}-${index}`}>{prompt}</li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

function toErrorMessage(caught: unknown): string {
  if (caught instanceof DaimsApiError) {
    return `${caught.code}${caught.status ? ` (${caught.status})` : ""}: ${caught.message}`;
  }

  if (caught instanceof Error) {
    return caught.message;
  }

  return "Unknown error";
}

export default App;
