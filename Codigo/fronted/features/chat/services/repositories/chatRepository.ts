import { ChatResponse } from '../../schema/chatResponseInterface';
import { SendMessageInterface } from '../../schema/sendMessageInterface';

// export const chatRepository = {
//   async sendMessage(message: SendMessageInterface): Promise<ChatResponse> {
//     const response = await fetch('/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(message),
//     });

//     console.log(response);

//     if (!response.ok) throw new Error('Error sending message');

//     const data: ChatResponse = await response.json();
//     console.log('FRONT ', data);
//     return data;
//   },
// };

export const chatRepository = {
  async sendMessage(message: SendMessageInterface): Promise<ChatResponse> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!response.ok) throw new Error('Error sending message');
    return response.json();
  },

  async resetSession(): Promise<void> {
    await fetch('/api/chat', { method: 'DELETE' });
  },

  async getToolTrace(): Promise<{ tool_trace: any[]; length: number }> {
    const response = await fetch('/api/chat', { method: 'GET' });
    return response.json();
  },
};
