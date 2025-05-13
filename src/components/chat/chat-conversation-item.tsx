"use client";

import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ChatConversation {
  id: string;
  title: string;
  date: Date;
  isActive?: boolean;
}

interface ChatConversationItemProps {
  conversation: ChatConversation;
}

export function ChatConversationItem({ conversation }: ChatConversationItemProps) {
  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-purple-50",
        conversation.isActive && "bg-purple-50"
      )}
    >
      <MessageSquare 
        size={16} 
        className={cn(
          "shrink-0 text-muted-foreground",
          conversation.isActive && "text-purple-500"
        )}
      />
      <div className="flex-1 overflow-hidden">
        <div className="truncate font-medium">{conversation.title}</div>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(conversation.date, { addSuffix: true })}
        </div>
      </div>
    </Link>
  );
} 