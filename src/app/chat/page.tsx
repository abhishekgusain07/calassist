"use client";

import React, { useState } from "react";
import { ChatPage } from "@/components/chat/chat-page";
import AIChatInput from "@/components/chat/messageInputbar";
import ChatSuggestions from "@/components/chat/chatsugestion";

export default function ChatMainPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // This would be replaced with actual logic to handle the message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    
    // Simulate API response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: `This is a response to: ${message}`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    // Implement scroll to bottom functionality if needed
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
      <div className="absolute bottom-0 top-0 w-full overflow-hidden border-l border-t border-chat-border bg-chat-background bg-fixed transition-all ease-snappy max-sm:border-none sm:translate-y-3.5 sm:rounded-tl-xl">
        <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]"></div>
      </div>
      <div className="absolute bottom-0 top-0 w-full">
        {messages.length === 0 ? (
          <ChatSuggestions 
            onSuggestionClick={(suggestion) => handleSendMessage(suggestion)}
            onQuestionClick={(question) => handleSendMessage(question)}
          />
        ) : (
          <ChatPage 
            isNewChat={messages.length === 0}
          />
        )}
        <AIChatInput 
          onSendMessage={handleSendMessage} 
          onScrollToBottom={scrollToBottom}
        />
      </div>
    </main>
  );
}