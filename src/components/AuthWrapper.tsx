
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user || isLoading) return;
      
      setIsCheckingProfile(true);
      
      try {
        // If user is on home page, redirect to dashboard (existing users) or onboarding (new users)
        if (location.pathname === '/') {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, first_name')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error("Error checking profile:", error);
          }
          
          // If user has profile, redirect to dashboard
          if (profile?.first_name) {
            navigate('/dashboard');
          } else {
            // New user without profile, redirect to onboarding
            navigate('/onboarding');
          }
        }
        // If user is on dashboard but no profile, redirect to onboarding
        else if (location.pathname === '/dashboard') {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, first_name')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error("Error checking profile:", error);
          }
          
          if (!profile?.first_name) {
            navigate('/onboarding');
          }
        }
        // If user is on onboarding but has profile, redirect to dashboard
        else if (location.pathname === '/onboarding') {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, first_name')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error("Error checking profile:", error);
          }
          
          if (profile?.first_name) {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error("Error in profile check:", error);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkUserProfile();
  }, [user, isLoading, location.pathname, navigate]);

  // Show loading spinner while Supabase is initializing or checking profile
  if (isLoading || isCheckingProfile) {
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
