<h1 align="center">Prompt-Searcher</h1>

<p align="center">
Official JavaScript / TypeScript SDK for the DAIMS API.
</p>

## Installation

Via npm

```sh
npm install prompt-searcher
```

You can also use your favorite package manager:

```sh
pnpm add prompt-searcher
# OR
yarn add prompt-searcher
# OR
bun add prompt-searcher
```

## Quick start

```ts
import { DaimsClient } from "prompt-searcher";

const client = new DaimsClient();

const list = await client.search({
  card_type: "create",
  search_type: "keyword",
  value: "Cinematic",
});
console.log(list.success, list.data.items);

const prompt = await client.getPrompt("card-skey");
```

## API

### `DaimsClient`

```ts
import { DaimsClient } from "prompt-searcher";

// Basic usage (no API key required)
const client = new DaimsClient();

// With options
const client = new DaimsClient({
  apiKey: "your-api-key", // optional
  timeoutMs: 10_000,      // optional
});
```

Methods:

- `search(params)` -> `Promise<SearchResponse>`
- `getPrompt(skey)` -> `Promise<GetPromptResponse>`
