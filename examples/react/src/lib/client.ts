import { DaimsClient } from "prompt-searcher";

const API_KEY = "";

export const client = new DaimsClient({ apiKey: API_KEY });
export const IMAGE_BASE_URL = client.imageBaseUrl;