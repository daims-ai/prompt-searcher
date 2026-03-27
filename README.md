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
import { DaimsClient } from 'prompt-searcher'

const client = new DaimsClient()

const list = await client.search({
  card_type: 'create',
  search_type: 'keyword',
  value: 'Cinematic'
})
console.log(list.success, list.data.items)

const prompt = await client.getPrompt('card-skey')

// Generate prompt with polling
const generateResult = await client.generatePrompt({
  skey: 'card-skey',
  origin: 'data:image/png;base64,...', // optional
  apply_prompt: 'Your custom prompt' // optional
})
console.log(generateResult.data) // history key
```

## API

### `DaimsClient`

```ts
import { DaimsClient } from 'prompt-searcher'

// Basic usage (no API key required)
const client = new DaimsClient()

// With options
const client = new DaimsClient({
  apiKey: 'your-api-key', // optional
  apiBaseUrl: 'https://api.daims.ai', // optional, default
  imageBaseUrl: 'https://asset.daims.ai/images', // optional, default
  timeoutMs: 10_000 // optional
})
```

Methods:

- `search(params)` -> `Promise<SearchResponse>`
- `getPrompt(skey)` -> `Promise<GetPromptResponse>`
- `generatePrompt(request, pollOptions?)` -> `Promise<GeneratePromptResponse & { historyItem?: HistoryItem }>`
- `getHistory(type, options?)` -> `Promise<GetHistoryResponse>`
