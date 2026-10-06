import {
  AgentChatResponse,
  AgentDraftLine,
  AgentImage,
  AgentPlacedAppointment,
  AgentSessionResponse,
} from '../../schema/agentChatResponse';
import { AgentError } from '../../schema/agentError';
import { CartItem } from '../../schema/cartItem';
import { ChatResponse } from '../../schema/chatResponseInterface';
import { CitaAgendada } from '../../schema/citaAgendada';
import { ImagenMensaje } from '../../schema/imagenMensaje';
import { SendMessageInterface } from '../../schema/sendMessageInterface';

const BASE_URL = '/api/asistente';
const STORAGE_KEY = 'asistente:sessions';

/**
 * Un token de sesion por contacto.
 *
 * El token lo emite el servidor y aca solo se guarda y se reenvia: la
 * conversacion la identifica el, no el contactId. Con un id elegido por el
 * cliente, cualquiera que ponga el de otro le lee el carrito, el nombre, el
 * telefono y la direccion.
 *
 * En sessionStorage y no en localStorage porque una conversacion de compra
 * pertenece a la pestana, no al dispositivo para siempre.
 */
function readTokens(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeTokens(tokens: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

function clearToken(contactId: string): void {
  const tokens = readTokens();
  delete tokens[contactId];
  writeTokens(tokens);
}

async function openSession(contactId: string): Promise<string> {
  const existing = readTokens()[contactId];
  if (existing) return existing;

  const response = await fetch(`${BASE_URL}/chat/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel: 'web' }),
  });
  if (!response.ok) {
    throw new AgentError(
      'No se pudo abrir la conversación.',
      response.status,
      true,
    );
  }

  const data: AgentSessionResponse = await response.json();
  // Se relee el mapa en vez de reusar el de arriba: entre medio pudo abrirse
  // la sesion de otro contacto y ese token no se puede pisar.
  writeTokens({ ...readTokens(), [contactId]: data.session_token });
  return data.session_token;
}

async function postMessage(
  sessionToken: string,
  message: string,
): Promise<AgentChatResponse> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: sessionToken, message }),
  });

  if (response.ok) return response.json() as Promise<AgentChatResponse>;

  // 409: llego otro mensaje al mismo tiempo y el estado cambio. 429 y 503 son
  // transitorios. El resto no mejora reintentando.
  throw new AgentError(
    await readDetail(response),
    response.status,
    [409, 429, 503].includes(response.status),
    Number(response.headers.get('Retry-After') ?? 0),
  );
}

async function readDetail(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.detail === 'string') return body.detail;
  } catch {
    // Cuerpo no JSON: se usa el mensaje generico de abajo.
  }
  return 'No pude procesar tu mensaje. Inténtalo de nuevo.';
}

function toCartItem(line: AgentDraftLine): CartItem {
  return {
    productoId: line.product_id,
    nombre: line.name,
    cantidad: line.quantity,
    precioUnitario: Number(line.unit_price),
    subtotalItem: Number(line.subtotal),
  };
}

function toCita(appointment: AgentPlacedAppointment): CitaAgendada {
  return {
    id: appointment.id,
    cuando: appointment.when,
    duracionMinutos: appointment.duration_minutes,
    estado: appointment.status,
    ...(appointment.project_name ? { proyecto: appointment.project_name } : {}),
    ...(appointment.procedure_name ? { procedimiento: appointment.procedure_name } : {}),
    ...(appointment.project_address || appointment.address
      ? { direccion: (appointment.project_address ?? appointment.address)! }
      : {}),
    ...(appointment.unit_code ? { unidad: appointment.unit_code } : {}),
  };
}

/**
 * El agente puede mandar `images` como lista de URLs o de objetos. Aca se
 * unifica a una sola forma y se descarta lo que no traiga URL, para que una
 * respuesta mal formada no rompa la burbuja.
 */
function toImagenes(
  images: AgentChatResponse['images'],
): ImagenMensaje[] {
  if (!images?.length) return [];

  return images.reduce<ImagenMensaje[]>((acc, image) => {
    const crudo: AgentImage =
      typeof image === 'string' ? { url: image } : image;

    const url = crudo?.url?.trim();
    if (!url) return acc;

    acc.push({
      url,
      ...(crudo.caption ? { descripcion: crudo.caption } : {}),
      ...(crudo.product_id ? { productoId: crudo.product_id } : {}),
    });

    return acc;
  }, []);
}

export const chatRepository = {
  async sendMessage({
    message,
    contactId,
  }: SendMessageInterface): Promise<ChatResponse> {
    const token = await openSession(contactId);

    let data: AgentChatResponse;
    try {
      data = await postMessage(token, message);
    } catch (error) {
      // Una sesion vencida no deberia costarle el mensaje al cliente: se abre
      // una nueva y se reenvia una sola vez.
      if (error instanceof AgentError && error.status === 401) {
        clearToken(contactId);
        data = await postMessage(await openSession(contactId), message);
      } else {
        throw error;
      }
    }

    const imagenes = toImagenes(data.images);

    return {
      message: data.reply,
      contactId,
      // `?? []` y `?? 0`: el agente de la constructora no devuelve carrito.
      // Asi el mismo chat sirve para los dos proyectos.
      cart: (data.draft ?? []).map(toCartItem),
      cartTotal: Number(data.draft_total ?? 0),
      ...(data.placed_order_id ? { pedidoId: data.placed_order_id } : {}),
      ...(data.placed_appointment ? { cita: toCita(data.placed_appointment) } : {}),
      ...(imagenes.length ? { imagenes } : {}),
      faltantes: data.missing_fields ?? [],
    };
  },

  /**
   * Solo demo: pide al agente el recordatorio de la cita de esta conversacion
   * ya, sin esperar al dia antes. El agente lo manda al correo que el paciente
   * dio en el chat.
   */
  async sendDemoReminder(contactId: string): Promise<{ sent: boolean; detail: string }> {
    const token = readTokens()[contactId];
    if (!token) return { sent: false, detail: 'Primero agenda una cita en el chat.' };
    const response = await fetch(`${BASE_URL}/demo/recordatorio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: token }),
    });
    if (!response.ok) return { sent: false, detail: await readDetail(response) };
    return response.json();
  },

  // El agente olvida la conversacion al descartar el token: el estado vive en
  // el servidor atado a el y sin token no hay forma de volver a abrirlo. No hay
  // llamada HTTP que hacer.
  resetSession(contactId: string): void {
    clearToken(contactId);
  },
};
