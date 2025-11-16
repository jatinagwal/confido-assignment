export interface User {
  username: string;
  elevenLabsApiKey: string;
  calcomApiKey: string;
}

export interface SubscriptionInfo {
  tier: string;
  character_count: number;
  character_limit: number;
  next_character_count_reset_unix: number | null;
  status: string;
  has_open_invoices: boolean;
}

export interface KnowledgeBaseDocument {
  id: string;
  name: string;
  type: 'text';
  usage_mode: 'auto';
}

export interface Agent {
  agent_id: string;
  name: string;
  created_at?: number;
  conversation_config?: any;
}

export interface ApiKeySettings {
  elevenLabsApiKey: string;
  calcomApiKey: string;
}

