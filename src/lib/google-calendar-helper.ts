"use server"
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { googleAuthTokens } from "@/db/schema";


// Interface for token response
interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

// Interface for user profile
export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

// Interface for calendar event
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: string;
  }[];
  htmlLink: string;
}

// Interface for list events response
interface ListEventsResponse {
  items: GoogleCalendarEvent[];
  nextPageToken?: string;
}

/**
 * Check if a user has connected their Google Calendar
 */
export async function hasGoogleCalendarConnection(userId: string): Promise<boolean> {
  try {
    const tokens = await db
      .select()
      .from(googleAuthTokens)
      .where(eq(googleAuthTokens.userId, userId))
      .limit(1);
    
    return tokens.length > 0;
  } catch (error) {
    console.error("Error checking Google Calendar connection:", error);
    return false;
  }
}

/**
 * Get a valid access token, refreshing if necessary
 */
export async function getValidAccessToken(userId: string): Promise<string | null> {
  try {
    // Get the token from the database
    const dbTokens = await db
      .select()
      .from(googleAuthTokens)
      .where(eq(googleAuthTokens.userId, userId))
      .limit(1);
    
    const token = dbTokens[0];

    if (!token) {
      console.error("No Google auth token found for user:", userId);
      return null;
    }

    // Check if the token is expired
    const now = new Date();
    if (token.expiryDate > now) {
      // Token is still valid
      return token.accessToken;
    }

    // Token is expired, refresh it
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error("Google client credentials not found");
    }

    const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: token.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!refreshResponse.ok) {
      const errorData = await refreshResponse.json();
      throw new Error(`Token refresh failed: ${errorData.error_description || errorData.error}`);
    }

    const refreshedToken = await refreshResponse.json();
    const expiryDate = new Date(Date.now() + refreshedToken.expires_in * 1000);

    // Update the token in the database
    await db
      .update(googleAuthTokens)
      .set({
        accessToken: refreshedToken.access_token,
        expiryDate,
        updatedAt: new Date(),
      })
      .where(eq(googleAuthTokens.userId, userId));

    return refreshedToken.access_token;
  } catch (error) {
    console.error("Error getting valid access token:", error);
    return null;
  }
}

/**
 * Fetch the user's Google Calendar events
 */
export async function fetchCalendarEvents(
  userId: string,
  calendarId: string = "primary",
  maxResults: number = 10
): Promise<GoogleCalendarEvent[] | null> {
  try {
    const accessToken = await getValidAccessToken(userId);
    
    if (!accessToken) {
      throw new Error("Failed to get a valid access token");
    }
    
    // Build the URL with query parameters
    const params = new URLSearchParams({
      maxResults: maxResults.toString(),
      singleEvents: "true",
      orderBy: "startTime",
      timeMin: new Date().toISOString()
    });
    
    // Make the API request
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Calendar API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return null;
  }
}

/**
 * Create a calendar event
 */
export async function createCalendarEvent(
  userId: string,
  eventData: {
    summary: string;
    description?: string;
    location?: string;
    start: {
      dateTime: string;
      timeZone?: string;
    };
    end: {
      dateTime: string;
      timeZone?: string;
    };
    attendees?: {
      email: string;
      displayName?: string;
    }[];
  },
  calendarId: string = "primary"
): Promise<GoogleCalendarEvent | null> {
  try {
    const accessToken = await getValidAccessToken(userId);
    
    if (!accessToken) {
      throw new Error("Failed to get a valid access token");
    }
    
    // Make the API request
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Calendar API error: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return null;
  }
}

/**
 * Disconnect Google Calendar by removing the tokens
 */
export async function disconnectGoogleCalendar(userId: string): Promise<boolean> {
  try {
    await db
      .delete(googleAuthTokens)
      .where(eq(googleAuthTokens.userId, userId));
    return true;
  } catch (error) {
    console.error("Error disconnecting Google Calendar:", error);
    return false;
  }
} 