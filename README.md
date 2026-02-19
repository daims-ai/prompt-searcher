<h1 align="center">Prompt-Searcher</h1>

<p align="center">
Official JavaScript / TypeScript SDK for the DAIMS API.
</p>

## About

## Install

```bash
pnpm add prompt-searcher
```

## Quick start

```ts
import { DaimsClient } from "prompt-searcher";

const client = new DaimsClient({
  apiKey: process.env.DAIMS_API_KEY!,
});

const list = await client.search({
  card_type: "create",
  search_type: "keyword",
  value: "cinematic portrait",
});
console.log(list.success, list.data.items);

const prompt = await client.getPrompt("card-skey");
```

## API

### `DaimsClient`

```ts
import { DaimsClient } from "prompt-searcher";

const client = new DaimsClient({
  apiKey: "your-api-key",
  timeoutMs: 10_000, // optional
});
```

Methods:

- `search(params)` -> `Promise<SearchResponse>`
- `getPrompt(skey)` -> `Promise<GetPromptResponse>`

## Error handling

All non-2xx responses and network failures throw `DaimsApiError`.

```ts
import { DaimsApiError } from "prompt-searcher";

try {
  await client.search({ card_type: "create", search_type: "keyword", value: "x" });
} catch (error) {
  if (error instanceof DaimsApiError) {
    console.error(error.code, error.status, error.responseBody);
  }
}
```

## Development

```bash
pnpm build
pnpm test
pnpm lint
```

Docs:

```bash
pnpm docs:dev
```
