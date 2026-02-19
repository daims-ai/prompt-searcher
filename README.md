<h1 align="center">Prompt-Searcher</h1>

<p align="center">
Official JavaScript / TypeScript SDK for the DAIMS API.
</p>

## About

Write **better** and **safer conditions**. Pattern matching lets you express complex conditions in a single, compact expression. Your code becomes **shorter** and **more readable**. Exhaustiveness checking ensures you haven’t forgotten **any possible case**.

![ts-pattern](https://user-images.githubusercontent.com/9265418/231688650-7cd957a9-8edc-4db8-a5fe-61e1c2179d91.gif)

<p align="center"><i>Animation by <a target="_blank" href="https://twitter.com/nicoespeon/status/1644342570389061634?s=20">@nicoespeon</a></i></p>


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
