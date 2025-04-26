import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  SyringeIcon,
  FlaskConicalIcon,
  ClipboardIcon
} from "lucide-react";
import InjectionPlanner from "@/components/InjectionPlanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CyclePlannerCalendar from "@/components/CyclePlanner/CyclePlannerCalendar";
import WeeklyPlanner from "@/components/CyclePlanner/WeeklyPlanner";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("cycle-planner");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Plan your cycle, track injections, and monitor blood results</p>
        </div>
        
        <Tabs defaultValue="cycle-planner" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cycle-planner" className="flex items-center gap-2">
              <ClipboardIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Cycle Planner</span>
            </TabsTrigger>
            <TabsTrigger value="injection-assistant" className="flex items-center gap-2">
              <SyringeIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Injection Assistant</span>
            </TabsTrigger>
            <TabsTrigger 
              value="blood-results" 
              className="flex items-center gap-2"
              onClick={() => navigate("/blood-tests")}
            >
              <FlaskConicalIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Blood Results</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cycle-planner" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <WeeklyPlanner />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="injection-assistant" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Injection Assistant</h2>
                <InjectionPlanner />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
