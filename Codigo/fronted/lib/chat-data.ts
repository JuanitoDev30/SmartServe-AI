export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
  about?: string;
}

export interface Message {
  id: string;
  contactId: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'them';
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  contact: Contact;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  pinned?: boolean;
}

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Agente Asistente Virtual',
    avatar: 'AM',
    status: 'online',
    about: 'Disponible',
  },
];

export const conversations: Conversation[] = [
  {
    contact: contacts[0],
    lastMessage: '',
    lastMessageTime: '',
    unreadCount: 0,
    pinned: true,
  },
];

export const messagesData: Record<string, Message[]> = {};
