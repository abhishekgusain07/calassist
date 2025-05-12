import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import {v4 as uuid} from "uuid"
import { auth } from "@/lib/auth";

// Define the scopes we need for Google Calendar
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
];

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    const userId = session.user.id;
    
    // Generate a state parameter to prevent CSRF
    const state = uuid();
    
    
    
    // Ensure we have the client ID from env
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("Google client ID not found");
    }
    
    // Build the redirect URI
    const redirectUri = `${process.env.FRONTEND_URL}/api/integrations/google-calendar/callback`;
    
    // Construct Google OAuth URL
    const queryParams = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: SCOPES.join(" "),
      access_type: "offline",
      prompt: "consent",
      state,
    });
    
    // Redirect to Google's OAuth endpoint
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams.toString()}`;
    const response =  NextResponse.redirect(googleAuthUrl);
    
    
    // Store the state in a cookie for validation during callback
    response.cookies.set("google_oauth_user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });
    // Store userId in a cookie for retrieval during callback
    response.cookies.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });
    return response;
    
  } catch (error) {
    console.error("Error in Google Calendar authorize route:", error);
    // Redirect to error page
    return NextResponse.redirect(
      new URL(`/connect/google-calendar?error=${encodeURIComponent("Failed to initialize Google Calendar authorization")}`, request.url)
    );
  }
} 