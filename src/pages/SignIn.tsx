
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {isVerifying ? (
          <Card className="overflow-hidden rounded-lg border border-border/50 bg-card/90 backdrop-blur-sm shadow-md">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-black flex items-center justify-center">
                <div className="h-6 w-16 bg-background rounded-full transform translate-y-1"></div>
              </div>
              
              <h1 className="mb-6 text-2xl font-bold">FitTrackr</h1>
              
              <div className="mb-8 space-y-4 text-center">
                <p>We've sent an email to</p>
                <p className="font-bold">{email}</p>
                <p>with a link to activate your account.</p>
              </div>
              
              <div className="border-t border-border/50 pt-4 mt-4"></div>
              
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex justify-between">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-foreground px-0"
                  >
                    Verified your email?
                  </Button>
                  <Button 
                    variant="link"
                    onClick={() => setIsVerifying(false)}
                  >
                    Reload page
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="link"
                    className="text-muted-foreground hover:text-foreground px-0"
                  >
                    Didn't receive an email?
                  </Button>
                  <Button 
                    variant="link"
                  >
                    Resend email
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="link"
                    className="text-muted-foreground hover:text-foreground px-0"
                  >
                    Need help?
                  </Button>
                  <Button 
                    variant="link"
                  >
                    Contact us
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-1"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to home
              </Button>
            </div>
            <Card className="overflow-hidden rounded-lg border border-border/50 bg-card/90 backdrop-blur-sm shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <h1 className="text-2xl font-bold">Sign In</h1>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                
                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account?</span>{" "}
                  <Button variant="link" className="p-0" onClick={() => navigate("/sign-up")}>
                    Sign Up
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;
