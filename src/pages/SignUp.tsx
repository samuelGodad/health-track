
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName
      };
      
      const { error: signUpError, user } = await signUp(email, password, userData);
      
      if (signUpError) {
        setError(signUpError.message);
        toast({
          title: "Sign up failed",
          description: signUpError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created",
          description: "Welcome to Vita Health!",
        });
        // Redirect to onboarding
        navigate("/onboarding");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || "Failed to sign up");
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
              <h2 className="text-xl font-semibold">Create Account</h2>
              <p className="text-sm text-muted-foreground mt-1">Join us on your journey to better health</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
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
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account?</span>{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/sign-in")}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
