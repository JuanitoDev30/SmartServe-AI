import { SendMessageInterface } from '../../schema/sendMessageInterface';

export const chatRepository = {
  async sendMessage(message: SendMessageInterface) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Error sending message');
    }

    return response.json();
  },
};
