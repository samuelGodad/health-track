
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

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
                <p className="font-bold">your.email@example.com</p>
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
              <CardContent className="p-0">
                <div className="flex justify-center p-6 pb-0">
                  <h1 className="text-2xl font-bold">Sign In</h1>
                </div>
                <ClerkSignIn
                  signUpUrl="/sign-up"
                  redirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0",
                      footer: "hidden",
                    },
                  }}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;
