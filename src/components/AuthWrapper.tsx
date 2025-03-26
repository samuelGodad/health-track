
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/SupabaseAuthProvider";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while Supabase is initializing
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Allow access to protected routes if authenticated
  return <>{children}</>;
};

export default AuthWrapper;
