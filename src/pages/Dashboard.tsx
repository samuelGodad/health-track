
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import WeeklyPlanner from "@/components/CyclePlanner/WeeklyPlanner";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Cycle Planner</h1>
          <p className="text-muted-foreground">Plan and track your cycle details week by week</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <WeeklyPlanner />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
