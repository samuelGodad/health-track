
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError.message);
        toast({
          title: "Sign in failed",
          description: signInError.message,
          variant: "destructive",
        });
      } else {
        // Auth successful, redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
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
              <h1 className="text-2xl font-bold text-primary">Your Vita Health</h1>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Sign In</h2>
              <p className="text-sm text-muted-foreground mt-1">Welcome back to your health journey</p>
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
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            {/* Google Sign-In Button */}
            <div className="my-4 flex items-center justify-center">
              <span className="h-px w-full bg-border" />
              <span className="mx-2 text-xs text-muted-foreground">or</span>
              <span className="h-px w-full bg-border" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={signInWithGoogle}
            >
              {/* Google SVG icon */}
              <svg className="h-5 w-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.68 2.7 30.74 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.09c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 37.56l7.98-6.2z"/><path fill="#EA4335" d="M24 46c6.74 0 12.68-2.7 17.04-7.44l-7.19-5.6c-2.01 1.35-4.6 2.14-7.85 2.14-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              Sign in with Google
            </Button>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?</span>{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/sign-up")}>
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
