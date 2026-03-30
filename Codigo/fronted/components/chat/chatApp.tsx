'use client';

import { contacts, messagesData } from '@/lib/chat-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function ChatApp() {
  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [allMessages, setAllMessages] = useState(messagesData);

  const activeContact = activeContactId
    ? contacts.find(contact => {
        contact.id === activeContactId;
      }) || null
    : null;

  //1

  const currentMessage = activeContactId
    ? allMessages[activeContactId] || []
    : [];

  const showMobileChat = true;

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* SlideBar */}

      <aside
        className={cn(
          'flex flex-col w-full md:w-[300px] lg:w-[400px] border-r border-border bg-card ',
          showMobileChat ? 'hidden md:flex' : 'flex',
        )}
      >
        {/* Chat Area */}

        <main className="flex flex-col min-w-0">
          {/* contact */}

          {activeContact ? <></> : <></>}

          {/* Conversation */}
        </main>
      </aside>
    </div>
  );
}
