# Quick Start

## Install

```bash
npm install prompt-searcher
```

## Usage

```ts
import { DaimsClient } from "prompt-searcher";

const client = new DaimsClient({
  apiKey: process.env.DAIMS_API_KEY!,
});

const searchResult = await client.search({
  card_type: "create",
  search_type: "keyword",
  value: "cinematic portrait",
});

const promptResult = await client.getPrompt("card-skey");
```
