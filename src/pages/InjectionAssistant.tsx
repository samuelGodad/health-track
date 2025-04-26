
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import InjectionPlanner from "@/components/InjectionPlanner";

const InjectionAssistant = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Injection Assistant</h1>
          <p className="text-muted-foreground">Calculate and plan your injection schedule</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <InjectionPlanner />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InjectionAssistant;
