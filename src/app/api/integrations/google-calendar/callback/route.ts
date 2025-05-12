import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {v4 as uuid} from "uuid"
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { googleAuthTokens } from "@/db/schema";


export async function GET(request: NextRequest) {
  try {
    // Get the code and state from the URL
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    // Handle OAuth errors from Google
    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(`${process.env.FRONTEND_URL}/connect/google-calendar?error=${encodeURIComponent(`Authentication failed: ${error}`)}`);
    }

    // Validate required parameters
    if (!code || !state) {
      console.error("Missing required parameters:", { code, state });
      return NextResponse.redirect(`${process.env.FRONTEND_URL}/connect/google-calendar?error=${encodeURIComponent("Missing required parameters")}`);
    }

    // Verify the state to prevent CSRF attacks
    const storedState = request.cookies.get("google_oauth_state")?.value;
    
    if (!storedState || state !== storedState) {
      console.error("State mismatch:", { storedState, receivedState: state });
      return NextResponse.redirect(`${process.env.FRONTEND_URL}/connect/google-calendar?error=${encodeURIComponent("Invalid state parameter")}`);
    }

    // Get the user ID from the cookie
    const userId = request.cookies.get("google_oauth_user_id")?.value;
    
    if (!userId) {
      console.error("User ID not found in cookies");
      return NextResponse.redirect(`${process.env.FRONTEND_URL}/connect/google-calendar?error=${encodeURIComponent("User identification failed")}`);
    }
    
    // Exchange the code for tokens
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error("Google client credentials not found");
    }

    const redirectUri = `${process.env.FRONTEND_URL}/api/integrations/google-calendar/callback`;
    
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      const errorMessage = errorData.error_description || errorData.error || "Token exchange failed";
      console.error("Failed to exchange code for tokens:", errorMessage);
      return NextResponse.redirect(`${process.env.FRONTEND_URL}/connect/google-calendar?error=${encodeURIComponent(errorMessage)}`);
    }

    const tokens = await tokenResponse.json();
    
    // Get the user profile from Google
    const profileResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!profileResponse.ok) {
      console.error("Failed to fetch user profile");
      return NextResponse.redirect(`${process.env.FRONTEND_URL}/connect/google-calendar?error=${encodeURIComponent("Failed to get Google user profile")}`);
    }

    const profile = await profileResponse.json();
    
    // Store the Google auth tokens in the database
    const tokenId = uuid();
    const expiryDate = new Date(Date.now() + tokens.expires_in * 1000);

    // Store tokens in the database using the schema you provided
    // First check if the token exists
    const existingTokens = await db
      .select()
      .from(googleAuthTokens)
      .where(eq(googleAuthTokens.userId, userId))
      .limit(1);
    
    if (existingTokens.length > 0) {
      // If it exists, update it
      // If refresh token is not provided in this response, keep the existing one
      const refreshTokenToUse = tokens.refresh_token || existingTokens[0].refreshToken;
      
      await db
        .update(googleAuthTokens)
        .set({
          accessToken: tokens.access_token,
          refreshToken: refreshTokenToUse,
          expiryDate,
          scopes: tokens.scope,
          updatedAt: new Date()
        })
        .where(eq(googleAuthTokens.userId, userId));
    } else {
      // If it doesn't exist, create it
      await db
        .insert(googleAuthTokens)
        .values({
          id: tokenId,
          userId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiryDate,
          scopes: tokens.scope,
          createdAt: new Date(),
          updatedAt: new Date()
        });
    }


    // Redirect to success page with user info
    const response =  NextResponse.redirect(`${process.env.FRONTEND_URL}/connect/google-calendar?success=true&name=${encodeURIComponent(profile.name)}&email=${encodeURIComponent(profile.email)}`);
    response.cookies.delete("google_oauth_state");
    response.cookies.delete("google_oauth_user_id")

    return response;
  } catch (error) {
    console.error("Error in Google Calendar callback:", error);
    return NextResponse.redirect(
      `${process.env.FRONTEND_URL}/connect/google-calendar?error=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error occurred")}`
    );
  }
} 