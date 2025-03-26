
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/MetricCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  TargetIcon,
  ActivityIcon,
  HeartPulseIcon,
  WeightIcon,
  PlusIcon,
  TrendingUpIcon,
  ListChecksIcon,
  DumbbellIcon,
  Save,
  UtensilsCrossedIcon,
  MoonIcon,
  DropletIcon,
  FootprintsIcon
} from "lucide-react";

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
      
      // Create an array of metrics to insert
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
      
      // Reset form
      setNewMetric({
        weight: "",
        sleep: "",
        calories: "",
        water: "",
        steps: ""
      });
      
      // Refetch daily metrics
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

  const getDailyTargetsSummary = () => {
    const dailyTargets = targets.filter(target => target.frequency === "daily");
    
    if (dailyTargets.length === 0) {
      return (
        <div className="text-center p-4">
          <p className="text-muted-foreground">No daily targets set yet.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => navigate("/targets")}
          >
            <TargetIcon className="h-4 w-4 mr-2" />
            Set Targets
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {dailyTargets.map(target => (
          <div key={target.id} className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <TargetIcon className="h-4 w-4 mr-2 text-primary" />
              <span>{target.target_name}</span>
            </div>
            <div>{target.target_value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and meet your daily targets</p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{format(date, 'PPP')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Weight"
            value={dailyMetrics.find(m => m.metric_name === "weight")?.value.toString() + " kg" || "No data"}
            icon={<WeightIcon className="h-5 w-5" />}
            isLoading={loading}
          />
          <MetricCard
            title="Sleep"
            value={dailyMetrics.find(m => m.metric_name === "sleep")?.value.toString() + " hrs" || "No data"}
            icon={<MoonIcon className="h-5 w-5" />}
            isLoading={loading}
          />
          <MetricCard
            title="Calories"
            value={dailyMetrics.find(m => m.metric_name === "calories")?.value.toString() || "No data"}
            icon={<UtensilsCrossedIcon className="h-5 w-5" />}
            isLoading={loading}
          />
          <MetricCard
            title="Water"
            value={dailyMetrics.find(m => m.metric_name === "water")?.value.toString() + " L" || "No data"}
            icon={<DropletIcon className="h-5 w-5" />}
            isLoading={loading}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border/50 bg-card/90 backdrop-blur-sm md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Add Today's Data</CardTitle>
              <PlusIcon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="weight" className="flex items-center gap-1 text-sm">
                    <WeightIcon className="h-3.5 w-3.5" />
                    Weight (kg)
                  </Label>
                  <Input 
                    id="weight" 
                    name="weight"
                    type="number" 
                    placeholder="0.0" 
                    step="0.1"
                    value={newMetric.weight}
                    onChange={handleMetricChange}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="sleep" className="flex items-center gap-1 text-sm">
                    <MoonIcon className="h-3.5 w-3.5" />
                    Sleep (hours)
                  </Label>
                  <Input 
                    id="sleep" 
                    name="sleep"
                    type="number" 
                    placeholder="0.0" 
                    step="0.1"
                    value={newMetric.sleep}
                    onChange={handleMetricChange}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="calories" className="flex items-center gap-1 text-sm">
                    <UtensilsCrossedIcon className="h-3.5 w-3.5" />
                    Calories
                  </Label>
                  <Input 
                    id="calories" 
                    name="calories"
                    type="number" 
                    placeholder="0" 
                    value={newMetric.calories}
                    onChange={handleMetricChange}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="water" className="flex items-center gap-1 text-sm">
                    <DropletIcon className="h-3.5 w-3.5" />
                    Water (liters)
                  </Label>
                  <Input 
                    id="water" 
                    name="water"
                    type="number" 
                    placeholder="0.0" 
                    step="0.1"
                    value={newMetric.water}
                    onChange={handleMetricChange}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="steps" className="flex items-center gap-1 text-sm">
                    <FootprintsIcon className="h-3.5 w-3.5" />
                    Steps
                  </Label>
                  <Input 
                    id="steps" 
                    name="steps"
                    type="number" 
                    placeholder="0" 
                    value={newMetric.steps}
                    onChange={handleMetricChange}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSaveMetrics}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Today's Data
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Today's Targets</CardTitle>
              <TargetIcon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              {getDailyTargetsSummary()}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Progress</CardTitle>
              <TrendingUpIcon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <WeightIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>Weight</span>
                  </div>
                  <div className="text-sm font-medium text-emerald-500">↓ 1.2 kg</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <HeartPulseIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>Resting HR</span>
                  </div>
                  <div className="text-sm font-medium text-emerald-500">↓ 2 bpm</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ActivityIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>Activity</span>
                  </div>
                  <div className="text-sm font-medium text-emerald-500">↑ 15%</div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/daily-metrics")}
                >
                  View All Metrics
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Weekly Summary</CardTitle>
              <ListChecksIcon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <WeightIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>Avg. Weight</span>
                  </div>
                  <div>78.5 kg</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <MoonIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>Avg. Sleep</span>
                  </div>
                  <div>7.2 hrs</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <UtensilsCrossedIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>Avg. Calories</span>
                  </div>
                  <div>2,250 kcal</div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/daily-metrics")}
                >
                  View Weekly Details
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Training Log</CardTitle>
              <DumbbellIcon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="border-b pb-2">
                  <div className="font-medium">Yesterday</div>
                  <div className="text-sm text-muted-foreground">Upper Body</div>
                </div>
                <div className="border-b pb-2">
                  <div className="font-medium">2 days ago</div>
                  <div className="text-sm text-muted-foreground">Lower Body</div>
                </div>
                <div className="border-b pb-2">
                  <div className="font-medium">3 days ago</div>
                  <div className="text-sm text-muted-foreground">Cardio (30 min)</div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                >
                  Log Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
