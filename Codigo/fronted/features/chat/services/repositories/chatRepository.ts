import { SendMessageInterface } from '../../schema/sendMessageInterface';

export const chatRepository = {
  async sendMessage(message: SendMessageInterface) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Error sending message');
    }

    const data = await response.json();

    console.log('FRONT ', data);

    return data.message;
  },
};
