import { chatRepository } from '../repositories/chatRepository';

import { ChatResponse } from '../../schema/chatResponseInterface';

interface Params {
  message: string;
  contactId: string;
}

export const sendMessageUseCase = async ({
  message,
  contactId,
}: Params): Promise<ChatResponse> =>
  chatRepository.sendMessage({ message, contactId });
