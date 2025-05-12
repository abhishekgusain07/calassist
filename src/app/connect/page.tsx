"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { hasGoogleCalendarConnection, fetchCalendarEvents, disconnectGoogleCalendar, GoogleCalendarEvent } from "@/lib/google-calendar-helper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarDays, Check, CheckCircle2, Clock, Loader2, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { GoogleCalendarConnectButton } from "@/components/integrations/google-cal-connect-button";

export default function GoogleCalendarConnectPage() {
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState<{name?: string, email?: string}>({});
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoading(true);
        
        // Get user session
        const { data: session, error } = await authClient.getSession();
        
        if (error || !session?.user) {
          toast.error("Please sign in to continue");
          router.push("/sign-in");
          return;
        }
        
        setUserId(session.user.id);
        
        // Check if user has already connected Google Calendar
        const connected = await hasGoogleCalendarConnection(session.user.id);
        setIsConnected(connected);
        
        // If connected, fetch calendar events
        if (connected) {
          const calendarEvents = await fetchCalendarEvents(session.user.id);
          if (calendarEvents) {
            setEvents(calendarEvents);
          }
        }
      } catch (error) {
        console.error("Error checking Google Calendar connection:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    // Check for success or error params in URL
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    
    if (success) {
      setShowSuccess(true);
      setUserProfile({
        name: name || undefined,
        email: email || undefined
      });
      toast.success("Google Calendar connected successfully!");
      
      // Remove the query params after showing the success message
      setTimeout(() => {
        router.replace("/connect/google-calendar");
      }, 300);
    }
    
    if (error) {
      toast.error(decodeURIComponent(error));
      // Remove the error param
      setTimeout(() => {
        router.replace("/connect/google-calendar");
      }, 300);
    }
    
    checkConnection();
  }, [searchParams, router]);
  
  const handleDisconnect = async () => {
    if (!userId) return;
    
    try {
      setDisconnecting(true);
      const success = await disconnectGoogleCalendar(userId);
      
      if (success) {
        toast.success("Google Calendar disconnected successfully");
        setIsConnected(false);
        setEvents([]);
      } else {
        toast.error("Failed to disconnect Google Calendar");
      }
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
      toast.error("Failed to disconnect Google Calendar");
    } finally {
      setDisconnecting(false);
    }
  };
  
  // Function to format date and time
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = parseISO(dateTimeString);
      return format(date, "PPP 'at' p"); // e.g., "April 3, 2023 at 2:30 PM"
    } catch (error) {
      return dateTimeString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Show success banner when connected successfully */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center text-green-800 dark:text-green-300">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          <div>
            <p className="font-medium">
              Google Calendar connected successfully!
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              {userProfile.name && `Connected as ${userProfile.name}`}
              {userProfile.email && userProfile.name && " "}
              {userProfile.email && `(${userProfile.email})`}
            </p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Google Calendar</h1>
        <p className="text-muted-foreground mt-2">
          Connect your Google Calendar to access and manage your events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6" />
                  <CardTitle>Google Calendar</CardTitle>
                </div>
                {isConnected && (
                  <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1 text-sm">
                    <span className="sr-only">Connected</span>
                    <Check className="h-4 w-4" />
                    <span>Connected</span>
                  </div>
                )}
              </div>
              <CardDescription className="text-blue-100">
                Connect your Google Calendar to view and manage your events
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : isConnected ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <h3 className="mt-2 font-medium">Connected</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your Google Calendar is connected
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Not connected
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Connect your Google Calendar to get started
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="bg-gray-50 dark:bg-gray-900/50 flex justify-center py-4">
              {isConnected ? (
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                >
                  {disconnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Disconnect
                    </>
                  )}
                </Button>
              ) : (
                <GoogleCalendarConnectButton/>
              )}
            </CardFooter>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About Google Calendar Integration</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-sm">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">What you can do:</h3>
              <ul className="list-disc pl-5 space-y-2 text-blue-700 dark:text-blue-400">
                <li>View your calendar events</li>
                <li>Create new events and appointments</li>
                <li>Receive notifications for upcoming events</li>
                <li>Manage your calendar schedule</li>
              </ul>
              
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mt-4 mb-2">Privacy & Security:</h3>
              <p className="text-blue-700 dark:text-blue-400 mb-2">
                We only request the permissions needed to manage your calendar. Your personal data stays private and secure.
              </p>
              <p className="text-blue-700 dark:text-blue-400">
                You can disconnect your Google Calendar at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Events section */}
        <div className="lg:col-span-2">
          {isConnected && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <CardTitle>Upcoming Events</CardTitle>
                </div>
                <CardDescription>
                  Your upcoming events from Google Calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      No upcoming events
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Your calendar is clear for the next few days.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium text-lg">{event.summary}</h3>
                        
                        <div className="mt-2 flex items-start space-x-2 text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{formatDateTime(event.start.dateTime)}</span>
                        </div>
                        
                        {event.location && (
                          <div className="mt-1 flex items-start space-x-2 text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.description && (
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-xs"
                          >
                            <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                              View in Google Calendar
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 