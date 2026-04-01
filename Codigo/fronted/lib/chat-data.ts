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

  time: string;

  sender: 'me' | 'contact';

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
    name: 'Ana Martinez',
    avatar: 'AM',
    status: 'online',
    about: 'Disponible',
  },
  {
    id: '2',
    name: 'Carlos Rivera',
    avatar: 'CR',
    status: 'offline',
    lastSeen: 'Hoy a las 14:30',
    about: 'En el trabajo',
  },
  {
    id: '3',
    name: 'Laura Gomez',
    avatar: 'LG',
    status: 'typing',
    about: 'Ocupada',
  },
  {
    id: '4',
    name: 'Pedro Sanchez',
    avatar: 'PS',
    status: 'online',
    about: 'Hola! Estoy usando WhatsApp',
  },
  {
    id: '5',
    name: 'Maria Torres',
    avatar: 'MT',
    status: 'offline',
    lastSeen: 'Ayer a las 22:15',
    about: 'En vacaciones',
  },
  {
    id: '6',
    name: 'Diego Lopez',
    avatar: 'DL',
    status: 'online',
    about: 'Disponible',
  },
  {
    id: '7',
    name: 'Sofia Hernandez',
    avatar: 'SH',
    status: 'offline',
    lastSeen: 'Hoy a las 10:00',
    about: 'No molestar',
  },
  {
    id: '8',
    name: 'Equipo Desarrollo',
    avatar: 'ED',
    status: 'online',
    about: 'Grupo de trabajo',
  },
  {
    id: '9',
    name: 'Familia',
    avatar: 'FA',
    status: 'online',
    about: 'Grupo familiar',
  },
  {
    id: '10',
    name: 'Roberto Diaz',
    avatar: 'RD',
    status: 'offline',
    lastSeen: 'Hace 2 horas',
    about: 'Programando...',
  },
];

export const conversations: Conversation[] = [
  {
    contact: contacts[0],
    lastMessage: 'Nos vemos manana a las 10!',
    lastMessageTime: '12:45',
    unreadCount: 2,
    pinned: true,
  },
  {
    contact: contacts[1],
    lastMessage: 'El proyecto esta casi listo',
    lastMessageTime: '11:30',
    unreadCount: 0,
  },
  {
    contact: contacts[2],
    lastMessage: 'escribiendo...',
    lastMessageTime: '12:40',
    unreadCount: 1,
  },
  {
    contact: contacts[3],
    lastMessage: 'Perfecto, gracias!',
    lastMessageTime: '10:15',
    unreadCount: 0,
  },
  {
    contact: contacts[4],
    lastMessage: 'Las fotos del viaje estan increibles',
    lastMessageTime: 'Ayer',
    unreadCount: 0,
  },
  {
    contact: contacts[5],
    lastMessage: 'Vamos al gym hoy?',
    lastMessageTime: 'Ayer',
    unreadCount: 3,
  },
  {
    contact: contacts[6],
    lastMessage: 'Te envie el documento',
    lastMessageTime: 'Lun',
    unreadCount: 0,
  },
  {
    contact: contacts[7],
    lastMessage: 'Pedro: Merge aprobado!',
    lastMessageTime: '12:30',
    unreadCount: 5,
    pinned: true,
  },
  {
    contact: contacts[8],
    lastMessage: 'Mama: Quien viene a cenar?',
    lastMessageTime: '11:00',
    unreadCount: 0,
  },
  {
    contact: contacts[9],
    lastMessage: 'El bug ya esta resuelto',
    lastMessageTime: 'Mar',
    unreadCount: 0,
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
