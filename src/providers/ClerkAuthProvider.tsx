
import { ReactNode, useEffect, useState } from "react";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

// Your Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_ZGl2aW5lLW1vbGUtNDEuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

interface ClerkAuthProviderProps {
  children: ReactNode;
}

// This component will synchronize Clerk's auth state with Supabase
const SyncSupabaseSession = ({ children }: { children: ReactNode }) => {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded || !userId || !user) return;

    // Generate a Supabase custom JWT token for the user
    // This can be done by setting up a server endpoint that creates a custom JWT
    // For this implementation, we're focusing on the client-side auth state only
    
    console.log("Clerk user authenticated:", userId);
    
    // Here you would typically create a Supabase session using custom tokens
    // This requires a backend endpoint that creates JWT tokens for Supabase
    // For now, we'll just log the user info to demonstrate integration

  }, [isLoaded, userId, user]);

  return <>{children}</>;
};

export const ClerkAuthProvider = ({ children }: ClerkAuthProviderProps) => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/onboarding"
      afterSignOutUrl="/"
    >
      <SyncSupabaseSession>{children}</SyncSupabaseSession>
    </ClerkProvider>
  );
};
