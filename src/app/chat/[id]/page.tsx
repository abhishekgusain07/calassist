"use client";

import React from "react";
import { ChatPage } from "@/components/chat/chat-page";
import { useParams } from "next/navigation";

export default function ChatIdPage() {
  const params = useParams();
  const chatId = params.id as string;
  
  // In a real application, we would fetch the specific chat data using the ID
  
  return <ChatPage chatId={chatId} isNewChat={false} />;
} 