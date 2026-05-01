// usecases/sendMessageUseCase.ts
import { chatRepository } from '../repositories/chatRepository';

import { ChatResponse } from '../../schema/chatResponseInterface';
import { HistoryMessage } from '../../schema/historyMessageInterface';

interface Params {
  message: string;
  contactId: string;
  history: HistoryMessage[];
}

export const sendMessageUseCase = async ({
  message,
  contactId,
  history,
}: Params): Promise<ChatResponse> => {
  return chatRepository.sendMessage({ message, contactId, history });
};
