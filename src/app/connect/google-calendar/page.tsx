"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { hasGoogleCalendarConnection, disconnectGoogleCalendar } from "@/lib/google-calendar-helper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/hooks/useUser";

export default function GoogleCalendarConnect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  // Get success and error params from URL
  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const name = searchParams.get("name");
  const email = searchParams.get("email");

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, userLoading, router]);

  // Check connection status once we have the user
  useEffect(() => {
    const checkConnection = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const connected = await hasGoogleCalendarConnection(user.id);
        setIsConnected(connected);
        
        // If we just completed a successful connection, show a toast
        if (success === "true" && !error) {
          toast.success("Successfully connected to Google Calendar");
        }
      } catch (err) {
        console.error("Error checking connection:", err);
        toast.error("Failed to check Google Calendar connection");
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, [user, success, error]);

  const handleDisconnect = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setDisconnecting(true);
      const result = await disconnectGoogleCalendar(user.id);
      if (result) {
        setIsConnected(false);
        toast.success("Successfully disconnected from Google Calendar");
      } else {
        throw new Error("Failed to disconnect");
      }
    } catch (err) {
      console.error("Error disconnecting:", err);
      toast.error("Failed to disconnect from Google Calendar");
    } finally {
      setDisconnecting(false);
    }
  };

  const handleConnect = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // Redirect to the authorization endpoint
      window.location.href = `/api/integrations/google-calendar/authorize?userId=${user.id}`;
    } catch (err) {
      console.error("Error starting connection:", err);
      toast.error("Failed to start Google Calendar connection");
    }
  };

  // Render appropriate UI based on auth and connection status
  const renderConnectionUI = () => {
    if (!user?.id) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">You need to be logged in to connect your Google Calendar.</p>
          <Link href="/sign-in" className="mt-2 inline-block text-blue-600 hover:underline">
            Sign in to continue
          </Link>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center py-6">
          <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }

    if (isConnected) {
      return (
        <div>
          <p className="text-gray-700 mb-4">
            Your Google Calendar is connected. You can now view and manage your calendar events within our application.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleDisconnect} 
            disabled={disconnecting}
          >
            {disconnecting ? "Disconnecting..." : "Disconnect Google Calendar"}
          </Button>
        </div>
      );
    }

    return (
      <div>
        <p className="text-gray-700 mb-4">
          Connect your Google Calendar to view and manage your events from within our application.
          We'll only access the information you allow.
        </p>
        <Button onClick={handleConnect}>
          Connect Google Calendar
        </Button>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-6">Google Calendar Integration</h1>
      
      {/* Success message */}
      {success === "true" && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Connection successful</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Successfully connected to Google Calendar for {name || "your account"}.</p>
                {email && <p className="mt-1">Connected account: {email}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Connection failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Connect your Google Calendar</h2>
        {renderConnectionUI()}
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
