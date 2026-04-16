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
  // {
  //   id: '2',
  //   name: 'Carlos Rivera',
  //   avatar: 'CR',
  //   status: 'offline',
  //   lastSeen: 'Hoy a las 14:30',
  //   about: 'En el trabajo',
  // },
  // {
  //   id: '3',
  //   name: 'Laura Gomez',
  //   avatar: 'LG',
  //   status: 'typing',
  //   about: 'Ocupada',
  // },
  // {
  //   id: '4',
  //   name: 'Pedro Sanchez',
  //   avatar: 'PS',
  //   status: 'online',
  //   about: 'Hola! Estoy usando WhatsApp',
  // },
  // {
  //   id: '5',
  //   name: 'Maria Torres',
  //   avatar: 'MT',
  //   status: 'offline',
  //   lastSeen: 'Ayer a las 22:15',
  //   about: 'En vacaciones',
  // },
  // {
  //   id: '6',
  //   name: 'Diego Lopez',
  //   avatar: 'DL',
  //   status: 'online',
  //   about: 'Disponible',
  // },
  // {
  //   id: '7',
  //   name: 'Sofia Hernandez',
  //   avatar: 'SH',
  //   status: 'offline',
  //   lastSeen: 'Hoy a las 10:00',
  //   about: 'No molestar',
  // },
  // {
  //   id: '8',
  //   name: 'Equipo Desarrollo',
  //   avatar: 'ED',
  //   status: 'online',
  //   about: 'Grupo de trabajo',
  // },
  // {
  //   id: '9',
  //   name: 'Familia',
  //   avatar: 'FA',
  //   status: 'online',
  //   about: 'Grupo familiar',
  // },
  // {
  //   id: '10',
  //   name: 'Roberto Diaz',
  //   avatar: 'RD',
  //   status: 'offline',
  //   lastSeen: 'Hace 2 horas',
  //   about: 'Programando...',
  // },
];

export const conversations: Conversation[] = [
  {
    contact: contacts[0],
    lastMessage: 'Nos vemos manana a las 10!',
    lastMessageTime: '12:45',
    unreadCount: 2,
    pinned: true,
  },
  // {
  //   contact: contacts[1],
  //   lastMessage: 'El proyecto esta casi listo',
  //   lastMessageTime: '11:30',
  //   unreadCount: 0,
  // },
  // {
  //   contact: contacts[2],
  //   lastMessage: 'escribiendo...',
  //   lastMessageTime: '12:40',
  //   unreadCount: 1,
  // },
  // {
  //   contact: contacts[3],
  //   lastMessage: 'Perfecto, gracias!',
  //   lastMessageTime: '10:15',
  //   unreadCount: 0,
  // },
  // {
  //   contact: contacts[4],
  //   lastMessage: 'Las fotos del viaje estan increibles',
  //   lastMessageTime: 'Ayer',
  //   unreadCount: 0,
  // },
  // {
  //   contact: contacts[5],
  //   lastMessage: 'Vamos al gym hoy?',
  //   lastMessageTime: 'Ayer',
  //   unreadCount: 3,
  // },
  // {
  //   contact: contacts[6],
  //   lastMessage: 'Te envie el documento',
  //   lastMessageTime: 'Lun',
  //   unreadCount: 0,
  // },
  // {
  //   contact: contacts[7],
  //   lastMessage: 'Pedro: Merge aprobado!',
  //   lastMessageTime: '12:30',
  //   unreadCount: 5,
  //   pinned: true,
  // },
  // {
  //   contact: contacts[8],
  //   lastMessage: 'Mama: Quien viene a cenar?',
  //   lastMessageTime: '11:00',
  //   unreadCount: 0,
  // },
  // {
  //   contact: contacts[9],
  //   lastMessage: 'El bug ya esta resuelto',
  //   lastMessageTime: 'Mar',
  //   unreadCount: 0,
  // },
];

export const messagesData: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      contactId: '1',
      text: 'Hola! Como estas?',
      timestamp: '12:30',
      sender: 'them',
      status: 'read',
    },
    {
      id: 'm2',
      contactId: '1',
      text: 'Muy bien! Y tu? Que planes tienes para hoy?',
      timestamp: '12:32',
      sender: 'me',
      status: 'read',
    },
    {
      id: 'm3',
      contactId: '1',
      text: 'Todo genial por aqui. Estaba pensando en que podemos reunirnos manana para revisar el proyecto.',
      timestamp: '12:35',
      sender: 'them',
      status: 'read',
    },
    {
      id: 'm4',
      contactId: '1',
      text: 'Me parece perfecto! A que hora?',
      timestamp: '12:38',
      sender: 'me',
      status: 'read',
    },
    {
      id: 'm5',
      contactId: '1',
      text: 'Que te parece a las 10 de la manana?',
      timestamp: '12:40',
      sender: 'them',
      status: 'read',
    },
    {
      id: 'm6',
      contactId: '1',
      text: 'Perfecto, ahi estare!',
      timestamp: '12:42',
      sender: 'me',
      status: 'delivered',
    },
    {
      id: 'm7',
      contactId: '1',
      text: 'Nos vemos manana a las 10!',
      timestamp: '12:45',
      sender: 'them',
      status: 'read',
    },
  ],
  // '2': [
  //   {
  //     id: 'm8',
  //     contactId: '2',
  //     text: 'Como va el proyecto?',
  //     timestamp: '10:00',
  //     sender: 'me',
  //     status: 'read',
  //   },
  //   {
  //     id: 'm9',
  //     contactId: '2',
  //     text: 'Va muy bien! Ya termine la parte del backend',
  //     timestamp: '10:15',
  //     sender: 'them',
  //     status: 'read',
  //   },
  //   {
  //     id: 'm10',
  //     contactId: '2',
  //     text: 'Excelente! Yo estoy avanzando con el frontend',
  //     timestamp: '10:30',
  //     sender: 'me',
  //     status: 'read',
  //   },
  //   {
  //     id: 'm11',
  //     contactId: '2',
  //     text: 'El proyecto esta casi listo',
  //     timestamp: '11:30',
  //     sender: 'them',
  //     status: 'read',
  //   },
  // ],
  // '3': [
  //   {
  //     id: 'm12',
  //     contactId: '3',
  //     text: 'Hola Laura! Tienes un momento?',
  //     timestamp: '12:20',
  //     sender: 'me',
  //     status: 'read',
  //   },
  //   {
  //     id: 'm13',
  //     contactId: '3',
  //     text: 'Si claro, dime!',
  //     timestamp: '12:25',
  //     sender: 'them',
  //     status: 'read',
  //   },
  //   {
  //     id: 'm14',
  //     contactId: '3',
  //     text: 'Necesito que me ayudes con el diseno de la nueva pantalla',
  //     timestamp: '12:30',
  //     sender: 'me',
  //     status: 'read',
  //   },
  // ],
  // '8': [
  //   {
  //     id: 'm15',
  //     contactId: '8',
  //     text: 'Buenos dias equipo! Sprint review a las 3pm',
  //     timestamp: '09:00',
  //     sender: 'them',
  //     status: 'read',
  //   },
  //   {
  //     id: 'm16',
  //     contactId: '8',
  //     text: 'Perfecto, estare ahi',
  //     timestamp: '09:15',
  //     sender: 'me',
  //     status: 'read',
  //   },
  //   {
  //     id: 'm17',
  //     contactId: '8',
  //     text: 'Ya subi los cambios al repo',
  //     timestamp: '11:00',
  //     sender: 'me',
  //     status: 'delivered',
  //   },
  //   {
  //     id: 'm18',
  //     contactId: '8',
  //     text: 'Merge aprobado!',
  //     timestamp: '12:30',
  //     sender: 'them',
  //     status: 'read',
  //   },
  //],
};
