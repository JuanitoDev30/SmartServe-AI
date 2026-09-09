import { ChatResponse } from '../../schema/chatResponseInterface';
import { SendMessageInterface } from '../../schema/sendMessageInterface';
import { ToolTraceResponse } from '../../schema/toolTraceInterface';

export const chatRepository = {
  async sendMessage(message: SendMessageInterface): Promise<ChatResponse> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) throw new Error('Error sending message');

    const data: ChatResponse = await response.json();
    return data;
  },

  // Hace que el agente olvide la conversación anterior
  async resetSession(): Promise<void> {
    const response = await fetch('/api/chat', { method: 'DELETE' });

    if (!response.ok) throw new Error('Error resetting session');
  },

  // Herramientas que el agente ejecutó en la sesión actual
  async getToolTrace(): Promise<ToolTraceResponse> {
    const response = await fetch('/api/chat', { method: 'GET' });

    if (!response.ok) throw new Error('Error fetching tool trace');

    return response.json();
  },
};
