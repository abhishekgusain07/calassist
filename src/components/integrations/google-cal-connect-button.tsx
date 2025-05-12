"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface GoogleCalendarConnectButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function GoogleCalendarConnectButton({
  className = "",
  variant = "default",
  size = "default"
}: GoogleCalendarConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      // Redirect to our API route that handles Google Calendar OAuth
      window.location.href = '/api/integrations/google-calendar/authorize';
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      toast.error('Failed to connect Google Calendar. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if it's being used in the grid layout (has "flex-col" in className)
  const isVerticalLayout = className.includes('flex-col');

  return (
    <Button
      onClick={handleConnect}
      variant={variant}
      size={size}
      className={className}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
      ) : (
        <>
          <div className={isVerticalLayout ? "mb-2" : "mr-2"}>
            {/* You can use either an Image component or the Calendar icon */}
            {/* Using the Calendar icon from Lucide */}
            <Calendar size={isVerticalLayout ? 32 : 18} />
            
            {/* Alternatively, if you have a Google Calendar logo */}
            {/* 
            <Image 
              src="/platforms/google-calendar.png" 
              alt="Google Calendar Logo" 
              width={isVerticalLayout ? 32 : 18} 
              height={isVerticalLayout ? 32 : 18} 
            />
            */}
          </div>
          <span>{isLoading ? 'Connecting...' : 'Connect Google Calendar'}</span>
        </>
      )}
    </Button>
  );
} 