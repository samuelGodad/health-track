
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
  const { signIn } = useAuth();
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
