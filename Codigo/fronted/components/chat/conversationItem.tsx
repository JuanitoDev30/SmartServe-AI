'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/lib/chat-data';
import { Check, CheckCheck, Pin } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const avatarColors = [
  'bg-emerald-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-orange-600',
  'bg-cyan-600',
  'bg-pink-600',
  'bg-lime-600',
];

function getAvatarColor(id: string) {
  const index = parseInt(id) % avatarColors.length;
  return avatarColors[index];
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const { contact, lastMessage, lastMessageTime, unreadCount, pinned } =
    conversation;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3 transition-colors text-left',
        'hover:bg-accent/50',
        isActive && 'bg-accent',
      )}
    >
      <Avatar className="size-12 shrink-0">
        <AvatarFallback
          className={cn(
            'text-sm font-semibold text-card',
            getAvatarColor(contact.id),
          )}
        >
          {contact.image}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-foreground truncate">
            {contact.name}
          </span>
          <span
            className={cn(
              'text-xs shrink-0 ml-2',
              unreadCount > 0
                ? 'text-primary font-medium'
                : 'text-muted-foreground',
            )}
          >
            {lastMessageTime}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1 min-w-0">
            {unreadCount === 0 && contact.status !== 'typing' && (
              <CheckCheck className="size-4 shrink-0 text-sky-500" />
            )}
            <span
              className={cn(
                'text-sm truncate',
                contact.status === 'typing'
                  ? 'text-primary italic'
                  : 'text-muted-foreground',
              )}
            >
              {lastMessage}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {pinned && (
              <Pin className="size-3.5 text-muted-foreground rotate-45" />
            )}
            {unreadCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium px-1.5">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
