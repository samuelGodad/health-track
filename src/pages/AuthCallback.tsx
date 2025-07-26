import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/SupabaseAuthProvider';

const AuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('=== AuthCallback: Starting OAuth callback processing ===');
        
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError('Authentication failed. Please try again.');
          return;
        }

        if (data.session) {
          console.log('Session found for user:', data.session.user.email);
          console.log('User ID:', data.session.user.id);
          
          // Check if user has a profile with actual data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .eq('id', data.session.user.id)
            .single();

          console.log('Profile check result:', { 
            hasProfile: !!profileData, 
            hasFirstName: !!profileData?.first_name,
            profileError: profileError?.code,
            profileData: profileData ? { 
              id: profileData.id, 
              first_name: profileData.first_name,
              last_name: profileData.last_name
            } : null
          });

          // If profileError exists and it's NOT a "not found" error, log it
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error checking profile:', profileError);
          }

          // Check if user has a complete profile (has first_name)
          const hasCompleteProfile = profileData && profileData.first_name;

          if (profileError && profileError.code === 'PGRST116') {
            // No profile record at all (shouldn't happen with Supabase)
            console.log('No profile record found, redirecting to onboarding');
            navigate('/onboarding');
          } else if (hasCompleteProfile) {
            // User has a complete profile, now check if they have metric preferences
            console.log('Complete profile found, checking metric preferences...');
            
            const { data: metricPreferences, error: metricError } = await supabase
              .from('user_metric_preferences')
              .select('metric_name, tracking_frequency')
              .eq('user_id', data.session.user.id);

            console.log('Metric preferences check:', {
              hasPreferences: !!metricPreferences && metricPreferences.length > 0,
              preferenceCount: metricPreferences?.length || 0,
              metricError: metricError?.code
            });

            if (metricError) {
              console.error('Error checking metric preferences:', metricError);
            }

            // If user has both complete profile AND metric preferences, go to dashboard
            if (metricPreferences && metricPreferences.length > 0) {
              console.log('User has complete profile and metric preferences, redirecting to dashboard');
              navigate('/dashboard');
            } else {
              // User has profile but no metric preferences, go to onboarding
              console.log('User has profile but no metric preferences, redirecting to onboarding');
              navigate('/onboarding');
            }
          } else {
            // Profile exists but is incomplete (no first_name), redirect to onboarding
            console.log('Incomplete profile found, redirecting to onboarding');
            navigate('/onboarding');
          }
        } else {
          console.log('No session found');
          setError('No session found. Please try signing in again.');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => navigate('/sign-in')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback; 