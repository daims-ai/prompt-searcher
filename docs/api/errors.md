# Error Handling

All failed requests throw `DaimsApiError`.

```ts
import { DaimsApiError, DaimsClient } from "prompt-searcher";

const client = new DaimsClient({ apiKey: "your-api-key" });

try {
  await client.search({
    card_type: "create",
    search_type: "keyword",
    value: "example",
  });
} catch (error) {
  if (error instanceof DaimsApiError) {
    console.log(error.code); // HTTP_ERROR | NETWORK_ERROR | REQUEST_TIMEOUT | ...
    console.log(error.status); // HTTP status for API errors
    console.log(error.responseBody); // Parsed API error payload
  }
}
```
