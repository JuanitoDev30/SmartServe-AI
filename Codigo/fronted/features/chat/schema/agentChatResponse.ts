/**
 * DTO crudo del agente, tal cual viaja por HTTP.
 *
 * No se usa en la UI: el repository lo traduce a ChatResponse, que es la forma
 * que entiende la app. Asi un cambio de contrato del backend se absorbe en un
 * solo lugar.
 */

export interface AgentDraftLine {
  product_id: string;
  name: string;
  quantity: number;
  /** Decimal serializado como string por el backend. */
  unit_price: string;
  subtotal: string;
}

export interface AgentChatResponse {
  conversation_id: string;
  reply: string;
  draft: AgentDraftLine[];
  draft_total: string;
  placed_order_id: string | null;
  missing_fields: string[];
}

export interface AgentSessionResponse {
  session_token: string;
  expires_in_seconds: number;
}
