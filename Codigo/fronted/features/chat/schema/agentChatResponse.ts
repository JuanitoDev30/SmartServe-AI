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

/** Solo la manda el agente de la constructora, en el turno en que se agenda. */
export interface AgentPlacedAppointment {
  id: string;
  starts_at: string;
  when: string;
  duration_minutes: number;
  status: string;
  // Constructora: proyecto y unidad. Consultorio: procedimiento y direccion.
  // El mismo chat sirve para los dos agentes.
  project_name?: string | null;
  project_address?: string | null;
  unit_code?: string | null;
  procedure_name?: string | null;
  address?: string | null;
}

/**
 * Imagen adjunta a la respuesta. El agente puede mandar la URL suelta o el
 * objeto con pie de foto; el repository acepta las dos formas.
 */
export interface AgentImage {
  url: string;
  caption?: string | null;
  product_id?: string | null;
}

export interface AgentChatResponse {
  conversation_id: string;
  reply: string;
  // Opcionales: solo los manda el agente del restaurante. El de la
  // constructora no maneja pedidos y responde sin ellos.
  draft?: AgentDraftLine[];
  draft_total?: string;
  placed_order_id?: string | null;
  placed_appointment?: AgentPlacedAppointment | null;
  /** Fotos que acompanan la respuesta: platos, planos, comprobantes. */
  images?: (string | AgentImage)[] | null;
  missing_fields: string[];
}

export interface AgentSessionResponse {
  session_token: string;
  expires_in_seconds: number;
}
