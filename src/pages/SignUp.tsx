
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

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
          <CardContent className="p-0">
            <div className="flex justify-center p-6 pb-0">
              <h1 className="text-2xl font-bold">Create Account</h1>
            </div>
            <ClerkSignUp
              signInUrl="/sign-in"
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
      </div>
    </div>
  );
};

export default SignUp;
