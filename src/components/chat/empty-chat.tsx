"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Sparkles, Code, GraduationCap, Newspaper } from "lucide-react";

interface EmptyChatProps {
  onSelectSuggestion: (suggestion: string) => void;
}

export function EmptyChat({ onSelectSuggestion }: EmptyChatProps) {
  return (
    <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
      <h2 className="text-3xl font-semibold">How can I help you?</h2>
      <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
        <Button 
          className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
          data-selected="false"
          onClick={() => onSelectSuggestion("Create a new calendar event for tomorrow at 9 AM")}
        >
          <Sparkles className="size-4 max-sm:block" />
          <div>Create</div>
        </Button>
        <Button 
          className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
          data-selected="false"
          onClick={() => onSelectSuggestion("What's on my calendar today?")}
        >
          <Newspaper className="size-4 max-sm:block" />
          <div>Explore</div>
        </Button>
        <Button 
          className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
          data-selected="false"
          onClick={() => onSelectSuggestion("Find all meetings about project planning next week")}
        >
          <Code className="size-4 max-sm:block" />
          <div>Code</div>
        </Button>
        <Button 
          className="justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow hover:bg-pink-600/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
          data-selected="false"
          onClick={() => onSelectSuggestion("How does CalAssist work with my calendar?")}
        >
          <GraduationCap className="size-4 max-sm:block" />
          <div>Learn</div>
        </Button>
      </div>
      
      <div className="flex flex-col text-foreground">
        <div className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
          <button 
            className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
            onClick={() => onSelectSuggestion("How does AI work?")}
          >
            <span>How does AI work?</span>
          </button>
        </div>
        <div className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
          <button 
            className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
            onClick={() => onSelectSuggestion("Are black holes real?")}
          >
            <span>Are black holes real?</span>
          </button>
        </div>
        <div className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
          <button 
            className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
            onClick={() => onSelectSuggestion("How many Rs are in the word \"strawberry\"?")}
          >
            <span>How many Rs are in the word "strawberry"?</span>
          </button>
        </div>
        <div className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none">
          <button 
            className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
            onClick={() => onSelectSuggestion("What is the meaning of life?")}
          >
            <span>What is the meaning of life?</span>
          </button>
        </div>
      </div>
    </div>
  );
} 