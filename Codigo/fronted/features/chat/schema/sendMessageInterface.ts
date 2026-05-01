import { HistoryMessage } from './historyMessageInterface';

export interface SendMessageInterface {
  message: string;
  contactId: string;
  history: HistoryMessage[];
}
