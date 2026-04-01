'use client';

import { ScrollArea } from '@/components/ui/scrollArea';
import { ConversationItem } from './conversationItem';
import type { Conversation } from '@/lib/chat-data';

interface ConversationListProps {
  conversations: Conversation[];
  activeContactId: string | null;
  onSelectConversation: (contactId: string) => void;
}

export function ConversationList({
  conversations,
  activeContactId,
  onSelectConversation,
}: ConversationListProps) {
  const pinned = conversations.filter(c => c.pinned);
  const unpinned = conversations.filter(c => !c.pinned);

  return (
    <ScrollArea className="flex-1">
      {pinned.length > 0 && (
        <div>
          {pinned.map(conversation => (
            <ConversationItem
              key={conversation.contact.id}
              conversation={conversation}
              isActive={activeContactId === conversation.contact.id}
              onClick={() => onSelectConversation(conversation.contact.id)}
            />
          ))}
        </div>
      )}
      {unpinned.map(conversation => (
        <ConversationItem
          key={conversation.contact.id}
          conversation={conversation}
          isActive={activeContactId === conversation.contact.id}
          onClick={() => onSelectConversation(conversation.contact.id)}
        />
      ))}
    </ScrollArea>
  );
}
