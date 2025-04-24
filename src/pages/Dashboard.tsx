import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { format, isToday } from "date-fns";
import {
  CalendarIcon,
  HomeIcon,
  ActivityIcon,
  LineChartIcon,
  FlaskConicalIcon,
  CameraIcon,
  RulerIcon,
  PillIcon,
  TargetIcon,
} from "lucide-react";
import InjectionPlanner from "@/components/InjectionPlanner";

interface Target {
  id: string;
  target_name: string;
  target_value: number;
  frequency: string;
}

interface DailyMetric {
  id: string;
  metric_name: string;
  value: number;
  date: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState<Target[]>([]);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetric[]>([]);
  const [newMetric, setNewMetric] = useState({
    weight: "",
    sleep: "",
    calories: "",
    water: "",
    steps: ""
  });
  const [activeTab, setActiveTab] = useState("daily");
  
  useEffect(() => {
    if (!user) return;
    
    const fetchTargets = async () => {
      try {
        const { data, error } = await supabase
          .from("user_targets")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setTargets(data || []);
      } catch (error) {
        console.error("Error fetching targets:", error);
        toast({
          title: "Error",
          description: "Failed to load your targets. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    const fetchDailyMetrics = async () => {
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        
        const { data, error } = await supabase
          .from("daily_metrics")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", formattedDate);
          
        if (error) throw error;
        
        setDailyMetrics(data || []);
      } catch (error) {
        console.error("Error fetching daily metrics:", error);
        toast({
          title: "Error",
          description: "Failed to load your daily metrics. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTargets();
    fetchDailyMetrics();
  }, [user, date, toast]);

  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMetric(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveMetrics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const formattedDate = format(date, "yyyy-MM-dd");
      
      const metricsToInsert = [];
      
      if (newMetric.weight) {
        metricsToInsert.push({
          user_id: user.id,
          metric_name: "weight",
          value: parseFloat(newMetric.weight),
          date: formattedDate
        });
      }
      
      if (newMetric.sleep) {
        metricsToInsert.push({
          user_id: user.id,
          metric_name: "sleep",
          value: parseFloat(newMetric.sleep),
          date: formattedDate
        });
      }
      
      if (newMetric.calories) {
        metricsToInsert.push({
          user_id: user.id,
          metric_name: "calories",
          value: parseFloat(newMetric.calories),
          date: formattedDate
        });
      }
      
      if (newMetric.water) {
        metricsToInsert.push({
          user_id: user.id,
          metric_name: "water",
          value: parseFloat(newMetric.water),
          date: formattedDate
        });
      }
      
      if (newMetric.steps) {
        metricsToInsert.push({
          user_id: user.id,
          metric_name: "steps",
          value: parseFloat(newMetric.steps),
          date: formattedDate
        });
      }
      
      if (metricsToInsert.length === 0) {
        toast({
          title: "No data to save",
          description: "Please enter at least one metric value.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const { error } = await supabase
        .from("daily_metrics")
        .insert(metricsToInsert);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your metrics have been saved successfully."
      });
      
      setNewMetric({
        weight: "",
        sleep: "",
        calories: "",
        water: "",
        steps: ""
      });
      
      const { data, error: fetchError } = await supabase
        .from("daily_metrics")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", formattedDate);
        
      if (fetchError) throw fetchError;
      
      setDailyMetrics(data || []);
      
    } catch (error) {
      console.error("Error saving metrics:", error);
      toast({
        title: "Error",
        description: "Failed to save your metrics. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const formattedDate = isToday(date) ? "Today" : format(date, "MMMM do");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Daily Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and meet your daily targets</p>
        </div>
        
        <div className="flex space-x-2 mb-6">
          <Toggle 
            variant="tab" 
            pressed={activeTab === "daily"} 
            onPressedChange={() => setActiveTab("daily")}
          >
            Daily
          </Toggle>
          <Toggle 
            variant="tab" 
            pressed={activeTab === "weekly"} 
            onPressedChange={() => setActiveTab("weekly")}
          >
            Weekly
          </Toggle>
          <Toggle 
            variant="tab" 
            pressed={activeTab === "bloods"}
            onPressedChange={() => handleNavigation("/blood-tests")}
          >
            Bloods
          </Toggle>
          <Toggle 
            variant="tab" 
            pressed={activeTab === "physique"} 
            onPressedChange={() => handleNavigation("/body-progress")}
          >
            Physique
          </Toggle>
          <Toggle
            variant="tab"
            pressed={activeTab === "injection-planner"}
            onPressedChange={() => setActiveTab("injection-planner")}
          >
            Injection Planner
          </Toggle>
        </div>
        
        {activeTab === "daily" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground">Calories</div>
                  <div className="text-2xl font-bold mt-1">2,400</div>
                  <div className="text-xs text-muted-foreground mt-1">Target: 2,500</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground">Protein</div>
                  <div className="text-2xl font-bold mt-1">180g</div>
                  <div className="text-xs text-muted-foreground mt-1">Target: 200g</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground">Water</div>
                  <div className="text-2xl font-bold mt-1">2.5L</div>
                  <div className="text-xs text-muted-foreground mt-1">Target: 3L</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground">Steps</div>
                  <div className="text-2xl font-bold mt-1">8,540</div>
                  <div className="text-xs text-muted-foreground mt-1">Target: 10,000</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold mb-4">Add {formattedDate}'s Data</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input 
                            id="weight" 
                            name="weight" 
                            value={newMetric.weight} 
                            onChange={handleMetricChange}
                            placeholder="Enter your weight"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="sleep">Sleep (hours)</Label>
                          <Input 
                            id="sleep" 
                            name="sleep" 
                            value={newMetric.sleep} 
                            onChange={handleMetricChange}
                            placeholder="Enter sleep duration"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="calories">Calories</Label>
                          <Input 
                            id="calories" 
                            name="calories" 
                            value={newMetric.calories} 
                            onChange={handleMetricChange}
                            placeholder="Enter calories consumed"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="water">Water (liters)</Label>
                          <Input 
                            id="water" 
                            name="water" 
                            value={newMetric.water} 
                            onChange={handleMetricChange}
                            placeholder="Enter water intake"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="steps">Steps</Label>
                        <Input 
                          id="steps" 
                          name="steps" 
                          value={newMetric.steps} 
                          onChange={handleMetricChange}
                          placeholder="Enter steps taken"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-6" 
                      onClick={handleSaveMetrics}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Today's Data"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/blood-tests')}
                      >
                        <FlaskConicalIcon className="mr-2 h-4 w-4" />
                        Blood Test Results
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/body-progress')}
                      >
                        <CameraIcon className="mr-2 h-4 w-4" />
                        Track Body Progress
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/supplements')}
                      >
                        <PillIcon className="mr-2 h-4 w-4" />
                        Manage Supplements
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/targets')}
                      >
                        <TargetIcon className="mr-2 h-4 w-4" />
                        Set Health Targets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
        
        {activeTab === "weekly" && (
          <div className="p-8 text-center bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Weekly Dashboard</h2>
            <p className="text-muted-foreground mb-4">This section is coming soon. It will show your weekly trends and progress.</p>
            <Button onClick={() => setActiveTab("daily")}>
              Go back to Daily Dashboard
            </Button>
          </div>
        )}
        
        {activeTab === "injection-planner" && (
          <div className="p-4 bg-white rounded-lg border border-muted shadow">
            <InjectionPlanner />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
