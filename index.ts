import { GetPromptResponse, SearchListResponse, SearchRequestParams } from "./index.types";

const BASE_URL = "https://api.daims.ai";

export async function search(params: SearchRequestParams) {

  const { card_type, search_type, value, link, isPhoto } = params;

  const body = {
    card_type,
    search_type,
    value,
    ...(link && { link }),
    ...(isPhoto && { isPhoto }),
  };

  const response = await fetch(`${BASE_URL}/api/search`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return data as SearchListResponse;
}

/**
 * Get a prompt by its skey
 * @param skey - The skey of the prompt
 * @returns The prompt
 * POST /api/card
const { skey } = req.body;
 */
export async function getPrompt(skey: string) {

  const response = await fetch(`${BASE_URL}/api/card`, {
    method: "POST",
    body: JSON.stringify({ skey }),
  });

  const data = await response.json();

  return data as GetPromptResponse;
}