# Quick Start

## Install

```bash
pnpm add prompt-searcher
```

## Usage

```ts
import { DaimsClient } from "prompt-searcher";

const client = new DaimsClient();

const searchResult = await client.search({
  card_type: "create",
  search_type: "keyword",
  value: "cinematic portrait",
});

const promptResult = await client.getPrompt("card-skey");
```
