# Client API

## `DaimsClient`

```ts
import { DaimsClient } from "prompt-searcher";

const client = new DaimsClient({
  apiKey: "your-api-key",
  baseUrl: "https://api.daims.ai",
  timeoutMs: 10_000,
});
```

### `client.search(params)`

Sends `POST /api/search`.

```ts
const list = await client.search({
  card_type: "create",
  search_type: "keyword",
  value: "landscape",
  link: "https://example.com/reference.png",
  isPhoto: true,
});
```

### `client.getPrompt(skey)`

Sends `POST /api/card`.

```ts
const card = await client.getPrompt("card-skey");
```
