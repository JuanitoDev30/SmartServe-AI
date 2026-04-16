import { chatRepository } from '../repositories/chatRepository';

interface Params {
  message: string;
  contactId: string;
  history: any[];
}

export const sendMessageUseCase = async ({
  message,
  contactId,
  history,
}: Params) => {
  const response = await chatRepository.sendMessage({
    message,
    contactId,
    history,
  });

  return response;
};
