# Legacy API (Deprecated)

The top-level functions are kept for backward compatibility.

## `search(params, options)`

```ts
import { search } from "prompt-searcher";

const list = await search(
  {
    card_type: "create",
    search_type: "keyword",
    value: "portrait",
  },
  { apiKey: "your-api-key" },
);
```

## `getPrompt(skey, options)`

```ts
import { getPrompt } from "prompt-searcher";

const card = await getPrompt("card-skey", { apiKey: "your-api-key" });
```

Prefer `DaimsClient` for new code.
