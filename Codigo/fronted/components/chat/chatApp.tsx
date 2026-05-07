'use client';

import { contacts, conversations } from '@/lib/chat-data';
import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { SidebarHeader } from './sidebarHeader';
import { SearchBar } from './searchBar';
import { ConversationList } from './conversationList';
import { ChatHeader } from './chatHeader';
import { MessageArea } from './messageArea';
import { MessageInput } from './messageInput';
import { EmptyChat } from './emptyChat';
import { sendMessageUseCase } from '@/features/chat/services/useCases/sendMessageUseCase';
import { Message } from '@/features/chat/schema/messageInterface';

export default function ChatApp() {
  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});

  const [allConversations, setAllConversations] = useState(conversations);

  const [showMobileChat, setShowMobilChat] = useState(false);

  const [isTyping, setIsTyping] = useState(false);

  const activeContact = activeContactId
    ? contacts.find(contact => contact.id === activeContactId) || null
    : null;

  //1

  const currentMessage = activeContactId
    ? allMessages[activeContactId] || []
    : [];

  const filteredConversations = searchQuery
    ? allConversations.filter(
        c =>
          c.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allConversations;

  const handleSelectConversation = useCallback((contactId: string) => {
    setActiveContactId(contactId);
    setShowMobilChat(true);
  }, []);

  const handleBack = useCallback(() => {
    setActiveContactId(null);
    setShowMobilChat(false);
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!activeContactId) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        contactId: activeContactId,
        text,
        timestamp: new Date().toISOString(),
        sender: 'me',
        status: 'sent',
      };

      setAllMessages(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), newMessage],
      }));

      try {
        const updatedMessages = [
          ...(allMessages[activeContactId] || []),
          newMessage,
        ];

        setIsTyping(true);

        // 2. Llamar al backend — ahora retorna ChatResponse
        const response = await sendMessageUseCase({
          message: text,
          contactId: activeContactId,
          history: updatedMessages,
        });

        //   console.log(response);
        console.log('response completo:', JSON.stringify(response, null, 2));

        setIsTyping(false);

        // 3. Crear mensaje del bot con productos si vienen
        const botMessage: Message = {
          id: `msg-${Date.now()}-bot`,
          contactId: activeContactId,
          text: (response.message || 'Sin respuesta').replace(/\\n/g, '\n'),
          timestamp: new Date().toISOString(),
          sender: 'them',
          status: 'read',
          ...(response.productos && { productos: response.productos }),
          ...(response.cart && { cart: response.cart }),
          ...(response.clienteInfo && { clienteInfo: response.clienteInfo }),
          ...(response.pedidoId && { pedidoId: response.pedidoId }),
          ...(response.estado && { estado: response.estado }),
        };

        console.log('botMessage completo:', JSON.stringify(botMessage));

        setAllMessages(prev => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), botMessage],
        }));
      } catch (error) {
        setIsTyping(false);
        console.error(error);
      }
    },
    [activeContactId, allMessages],
  );
  //console.log(activeContact);

  const handleNewChat = useCallback(() => {
    setSearchQuery('');
    setActiveContactId(null);
    setShowMobilChat(false);
  }, []);

  return (
    <div className="flex h-dvh w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col w-full md:w-[380px] lg:w-[420px] border-r border-border bg-card shrink-0',
          showMobileChat ? 'hidden md:flex' : 'flex',
        )}
      >
        <SidebarHeader onNewChat={handleNewChat} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <ConversationList
          conversations={filteredConversations}
          activeContactId={activeContactId}
          onSelectConversation={handleSelectConversation}
        />
      </aside>

      {/* Chat Area */}
      <main
        className={cn(
          'flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden',
          !showMobileChat ? 'hidden md:flex' : 'flex',
        )}
      >
        {activeContact ? (
          <>
            <ChatHeader
              contact={activeContact}
              onBack={handleBack}
              onSearch={() => {}}
            />
            <MessageArea messages={currentMessage} isTyping={isTyping} />
            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <EmptyChat />
        )}
      </main>
    </div>
  );
}
