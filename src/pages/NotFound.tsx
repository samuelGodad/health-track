
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        
        {user ? (
          <div className="space-y-2">
            <Button asChild variant="default">
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        ) : (
          <Button asChild variant="default">
            <Link to="/">Return to Home</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
