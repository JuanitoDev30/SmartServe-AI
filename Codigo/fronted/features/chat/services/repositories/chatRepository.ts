import { ChatResponse } from '../../schema/chatResponseInterface';
import { SendMessageInterface } from '../../schema/sendMessageInterface';

export const chatRepository = {
  async sendMessage(message: SendMessageInterface): Promise<ChatResponse> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    console.log(response);

    if (!response.ok) throw new Error('Error sending message');

    const data: ChatResponse = await response.json();
    console.log('FRONT ', data);
    return data;
  },
};
