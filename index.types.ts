export interface SearchRequestParams {
  card_type: "create" | "edit";
  search_type: "keyword" | "style" | "object";
  value: string;
  link?: string;
  isPhoto?: boolean;
}

export interface SearchListResponse {
  count: number;
  hasNext: boolean;
  limit: number;
  offset: number;
  items: SearchListItem[];
}

export interface SearchListItem {
  id: string;
  metadata: {
    key: string;
    provider: string;
    directory: string;
    model: string;
    type: string;
    maker: string;
    refs: string;
    uid: string;
  };
  references: string[];
}

export interface GetPromptResponse {
  detail: {
    key: string;
    maker: string;
    model: string;
    prompts: string[];
    provider: string;
    refs: string;
    type: string;
  };
  success: boolean;
}