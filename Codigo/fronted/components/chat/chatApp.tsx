'use client';

import {
  contacts,
  conversations,
  messagesData,
  type Message,
  type Conversation,
} from '@/lib/chat-data';
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

export default function ChatApp() {
  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [allMessages, setAllMessages] = useState(messagesData);

  const [allConversations, setAllConversations] = useState(conversations);

  const [showMobileChat, setShowMobilChat] = useState(false);

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

      // 1. Mostrar mensaje del usuario
      setAllMessages(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), newMessage],
      }));

      try {
        // 2. Llamar al backend
        const data = await sendMessageUseCase({
          message: text,
          contactId: activeContactId,
          history: allMessages[activeContactId] || [],
        });

        // 3. Crear mensaje del bot
        const botMessage: Message = {
          id: `msg-${Date.now()}-bot`,
          contactId: activeContactId,
          text: data.reply || 'Sin respuesta',
          timestamp: new Date().toISOString(),
          sender: 'them',
          status: 'read',
        };

        // 4. Insertar respuesta
        setAllMessages(prev => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), botMessage],
        }));
      } catch (error) {
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
          'flex-1 flex flex-col min-w-0',
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
            <MessageArea messages={currentMessage} />
            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <EmptyChat />
        )}
      </main>
    </div>
  );
}
