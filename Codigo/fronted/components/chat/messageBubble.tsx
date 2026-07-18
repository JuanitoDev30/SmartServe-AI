'use client';

import type { Message } from '@/lib/chat-data';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
interface MessageBubbleProps {
  message: Message;
}

function sanitizeMessage(text: string) {
  return text
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
    .replace(/<analysis>[\s\S]*?<\/analysis>/gi, '')
    .replace(/<scratchpad>[\s\S]*?<\/scratchpad>/gi, '')
    .trim();
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.sender === 'me';

  const cleanText = sanitizeMessage(message.text);
  return (
    <div
      className={cn(
        'flex w-full px-4 mb-1',
        isMe ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'relative max-w-[75%] rounded-lg px-3 py-1.5 shadow-sm',
          isMe
            ? 'bg-chat-outgoing text-foreground rounded-tr-none'
            : 'bg-chat-incoming text-foreground rounded-tl-none',
        )}
      >
        <div className="text-sm leading-relaxed break-words prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="whitespace-pre-wrap mb-2">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-5 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-5 space-y-1">{children}</ol>
              ),
              li: ({ children }) => <li>{children}</li>,
            }}
          >
            {cleanText}
          </ReactMarkdown>
        </div>
        <div
          className={cn(
            'flex items-center justify-end gap-1 mt-0.5 -mb-0.5',
            'select-none',
          )}
        >
          <span className="text-[10px] text-muted-foreground leading-none">
            {message.timestamp}
          </span>
          {isMe && (
            <span className="text-muted-foreground">
              {message.status === 'read' ? (
                <CheckCheck className="size-3.5 text-sky-500" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="size-3.5" />
              ) : (
                <Check className="size-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
