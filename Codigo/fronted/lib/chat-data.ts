export interface Contact {
  id: string;

  name: string;

  image: string;

  status: 'online' | 'offline' | 'typing';

  lastSeen?: string;

  about?: string;
}

export interface Message {
  id: string;

  contactId: string;

  text: string;

  time: string;

  sender: 'me' | 'contact';

  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  contact: Contact;

  messages: Message[];
}

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    status: 'online',
    lastSeen: '2 minutes ago',
    about: 'Loves hiking and outdoor adventures.',
  },
  {
    id: '2',
    name: 'Bob Smith',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    status: 'offline',
    lastSeen: '1 hour ago',
    about: 'Avid reader and coffee enthusiast.',
  },
];

export const conversations: Conversation[] = [
  {
    contact: contacts[0],
    messages: [
      {
        id: 'm1',
        contactId: '1',
        text: 'Hey Alice! How are you?',
        time: '10:00 AM',
        sender: 'me',
        status: 'read',
      },
      {
        id: 'm2',
        contactId: '1',
        text: 'Hi! I am good, thanks! How about you?',
        time: '10:01 AM',
        sender: 'contact',
        status: 'delivered',
      },
    ],
  },
  {
    contact: contacts[1],
    messages: [
      {
        id: 'm3',
        contactId: '2',
        text: 'Hey Bob, are you coming to the meeting tomorrow?',
        time: '9:00 AM',
        sender: 'me',
        status: 'sent',
      },
      {
        id: 'm4',
        contactId: '2',
        text: 'Hi! Yes, I will be there.',
        time: '9:05 AM',
        sender: 'contact',
        status: 'delivered',
      },
    ],
  },
];

export const messagesData: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      contactId: '1',
      text: 'Hey Alice! How are you?',
      time: '10:00 AM',
      sender: 'me',
      status: 'read',
    },
    {
      id: 'm2',
      contactId: '1',
      text: 'Hi! I am good, thanks! How about you?',
      time: '10:01 AM',
      sender: 'contact',
      status: 'delivered',
    },
  ],
};
