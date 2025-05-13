"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Calendar, Send, Paperclip, Sparkles, X, Calendar as CalendarIcon, Bot, Settings2, Moon, Sun, RefreshCcw, Copy, GraduationCap, Code, CheckIcon, SquarePen, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyChat } from "./empty-chat";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatPageProps {
  chatId?: string;
  isNewChat?: boolean;
}

export function ChatPage({ chatId, isNewChat = false }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>(
    isNewChat || !chatId
      ? []
      : [
          {
            id: "1",
            content: "Hello! I'm your calendar assistant. How can I help you today?",
            role: "assistant",
            timestamp: new Date(),
          },
        ]
  );
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAssistantResponse(input),
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    if (messages.length === 0) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: suggestion,
        role: "user",
        timestamp: new Date(),
      };
      setMessages([userMessage]);
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: getAssistantResponse(suggestion),
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setLoading(false);
      }, 1000);
    } else {
      setInput(suggestion);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const renderEmptyChat = () => (
    <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
      <h2 className="text-3xl font-semibold">How can I help you?</h2>
      <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
        <Button 
          className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
          data-selected="false"
          onClick={() => handleSuggestionSelect("Create a new calendar event for tomorrow at 9 AM")}
        >
          <Sparkles className="size-4 max-sm:block" />
          <div>Create</div>
        </Button>
        <Button 
          className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
          data-selected="false"
          onClick={() => handleSuggestionSelect("What's on my calendar today?")}
        >
          <Newspaper className="size-4 max-sm:block" />
          <div>Explore</div>
        </Button>
        <Button 
          className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
          data-selected="false"
          onClick={() => handleSuggestionSelect("Find all meetings about project planning next week")}
        >
          <Code className="size-4 max-sm:block" />
          <div>Code</div>
        </Button>
        <Button 
          className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
          data-selected="false"
          onClick={() => handleSuggestionSelect("How does CalAssist work with my calendar?")}
        >
          <GraduationCap className="size-4 max-sm:block" />
          <div>Learn</div>
        </Button>
      </div>
      
      <div className="flex flex-col text-foreground">
        <div className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
          <button 
            className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
            onClick={() => handleSuggestionSelect("How does AI work?")}
          >
            <span>How does AI work?</span>
          </button>
        </div>
        <div className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
          <button 
            className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
            onClick={() => handleSuggestionSelect("Are black holes real?")}
          >
            <span>Are black holes real?</span>
          </button>
        </div>
        <div className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
          <button 
            className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
            onClick={() => handleSuggestionSelect("How many Rs are in the word \"strawberry\"?")}
          >
            <span>How many Rs are in the word "strawberry"?</span>
          </button>
        </div>
        <div className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
          <button 
            className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
            onClick={() => handleSuggestionSelect("What is the meaning of life?")}
          >
            <span>What is the meaning of life?</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-white dark:bg-gray-950">
      {/* Top right corner buttons */}
      <div className="fixed right-2 top-2 z-20 max-sm:hidden" style={{ right: "var(--firefox-scrollbar, 0.5rem)" }}>
        <div className="flex flex-row items-center gap-0.5 rounded-md p-1 transition-all rounded-bl-xl">
          <Link href="/settings" aria-label="Go to settings">
            <Button variant="ghost" size="icon" className="size-8 rounded-bl-xl">
              <Settings2 className="size-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="group relative size-8">
            <Moon className="absolute size-4 rotate-0 scale-100 transition-all" />
            <Sun className="absolute size-4 rotate-90 scale-0 transition-all" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Main scrollable area */}
      <div 
        ref={chatContainerRef}
        className="absolute inset-0 overflow-y-scroll pt-3.5" 
        style={{ paddingBottom: "144px", scrollbarGutter: "stable both-edges" }}
      >
        <div
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10"
        >
          {messages.length === 0 ? (
            <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
              {renderEmptyChat()}
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                data-message-id={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "user" ? (
                  <div 
                    role="article" 
                    aria-label="Your message" 
                    className="group relative inline-block max-w-[80%] break-words rounded-xl border border-secondary/50 bg-secondary/50 px-4 py-3 text-left"
                  >
                    <span className="sr-only">Your message: </span>
                    <div className="flex flex-col gap-3">
                      <div className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                        <p>{message.content}</p>
                      </div>
                    </div>
                    <div className="absolute right-0 mt-5 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100">
                      <Button variant="ghost" size="sm" aria-label="Retry message" className="h-8 w-8 rounded-lg p-0 text-xs">
                        <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Edit message" className="h-8 w-8 rounded-lg p-0 text-xs">
                        <SquarePen className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Copy message" className="h-8 w-8 rounded-lg p-0 text-xs">
                        <div className="relative size-4">
                          <Copy className="absolute inset-0 transition-all duration-200 ease-snappy scale-100 opacity-100" aria-hidden="true" />
                          <CheckIcon className="absolute inset-0 transition-all duration-200 ease-snappy scale-0 opacity-0" aria-hidden="true" />
                        </div>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative w-full max-w-full break-words">
                    <div 
                      role="article" 
                      aria-label="Assistant message" 
                      className="prose prose-pink max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0"
                    >
                      <span className="sr-only">Assistant Reply: </span>
                      <p>{message.content}</p>
                    </div>
                    <div className="absolute left-0 -ml-0.5 mt-5 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100">
                      <Button variant="ghost" size="sm" aria-label="Copy response to clipboard" className="h-8 w-8 rounded-lg p-0 text-xs">
                        <div className="relative size-4">
                          <Copy className="absolute inset-0 transition-all duration-200 ease-snappy scale-100 opacity-100" aria-hidden="true" />
                          <CheckIcon className="absolute inset-0 transition-all duration-200 ease-snappy scale-0 opacity-0" aria-hidden="true" />
                        </div>
                      </Button>
                      <span className="select-none pl-2 text-sm text-secondary-foreground/80 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100">Generated with CalAssist</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="group relative w-full max-w-full break-words">
                <div className="prose prose-pink max-w-none dark:prose-invert">
                  <div className="flex space-x-2 items-center">
                    <div className="size-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div className="size-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></div>
                    <div className="size-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-background pb-6 pt-2">
        <div className="shadow-[0_-16px_16px_-16px_rgba(0,0,0,0.05)] mx-auto w-full max-w-3xl px-4">
          <div className="relative">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="relative">
                <div className="relative flex h-[54px] w-full rounded-xl border border-input bg-background px-3 focus-within:ring-1 focus-within:ring-ring">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="max-h-32 min-h-[54px] w-full resize-none border-0 bg-transparent py-3 pr-12 shadow-none outline-none focus-visible:ring-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <div className="absolute bottom-1 right-2 flex items-center">
                    <Button
                      type="submit"
                      size="icon"
                      className="h-8 w-8 rounded-lg bg-primary text-primary-foreground"
                      disabled={!input.trim() || loading}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">CalAssist</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  CalAssist may display inaccurate info. Double-check important calendar details.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock function to simulate assistant responses
function getAssistantResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("today") || lowerInput.includes("schedule today")) {
    return "Looking at your calendar for today, you have:\n\n• 10:00 AM - 11:00 AM: Team standup\n• 2:00 PM - 3:00 PM: Meeting with marketing\n• 4:30 PM - 5:00 PM: Weekly review call";
  }
  
  if (lowerInput.includes("tomorrow") || lowerInput.includes("schedule tomorrow")) {
    return "Here's your schedule for tomorrow:\n\n• 9:00 AM - 10:00 AM: Project kickoff\n• 12:00 PM - 1:00 PM: Lunch with clients\n• 3:30 PM - 4:30 PM: Product demo";
  }
  
  if (lowerInput.includes("weekend") || lowerInput.includes("this weekend")) {
    return "Your weekend looks pretty open! You only have:\n\n• Saturday, 10:00 AM: Gym class\n• Sunday, 7:00 PM: Dinner with family";
  }
  
  if (lowerInput.includes("schedule") || lowerInput.includes("meeting") || lowerInput.includes("event")) {
    return "I've added that event to your calendar. Would you like me to send invitations to any participants?";
  }
  
  if (lowerInput.includes("free") || lowerInput.includes("available") || lowerInput.includes("availability")) {
    return "Looking at your availability next week, you're most free on:\n\n• Monday: Before 11 AM and after 3 PM\n• Wednesday: The entire morning until 12 PM\n• Friday: After 2 PM";
  }
  
  if (lowerInput.includes("move") || lowerInput.includes("reschedule") || lowerInput.includes("change")) {
    return "I've rescheduled that for you. The updated event is now in your calendar.";
  }
  
  if (lowerInput.includes("how does ai work")) {
    return "AI systems like me work through machine learning - analyzing vast amounts of data to recognize patterns. For calendar assistance, I'm trained to understand natural language about scheduling, recognize date and time information, and generate helpful responses. I can help you manage your schedule, create events, and check your availability.";
  }

  if (lowerInput.includes("strawberry")) {
    return "There are 2 'r's in the word 'strawberry'.\n\nThe word is spelled: s-t-r-a-w-b-e-r-r-y";
  }

  if (lowerInput.includes("black hole")) {
    return "Yes, black holes are real cosmic objects. They form when massive stars collapse and create regions where gravity is so strong that nothing, not even light, can escape beyond a boundary called the event horizon. Scientists have observed black holes indirectly through their effects on surrounding matter and have even captured the first image of a black hole's shadow in 2019.";
  }

  if (lowerInput.includes("meaning of life")) {
    return "The meaning of life is a philosophical question that has been debated throughout human history. There's no single agreed-upon answer. Some find meaning in relationships, personal growth, contributing to society, spiritual beliefs, or creating their own purpose. For your calendar needs though, I'm here to help you manage your time effectively!";
  }

  if (lowerInput.includes("calassist work")) {
    return "CalAssist works by connecting to your Google Calendar and using natural language processing to understand your requests. You can ask me to check your schedule, create new events, find free time, and manage your calendar using conversational language. I can interpret dates, times, and event details from your messages and make the appropriate changes to your calendar.";
  }
  
  return "I can help you manage your calendar. You can ask me about your schedule, create events, check your availability, and more. What would you like to know?";
} 