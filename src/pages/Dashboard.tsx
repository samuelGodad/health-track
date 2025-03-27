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
import { format, isToday } from "date-fns";
import {
  CalendarIcon,
  Home as HomeIcon,
  Activity as DailyIcon,
  LineChart as WeeklyIcon,
  FlaskConical as BloodsIcon,
  Camera as ProgressPhotosIcon,
  Ruler as MeasurementsIcon,
  Pill as SupplementsIcon,
  Target as GoalsIcon,
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
  const [activeTab, setActiveTab] = useState("food");
  
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

  const formattedDate = isToday(date) ? "Today" : format(date, "MMMM do");

  return (
    <div className="figma-dashboard flex min-h-screen">
      <div className="figma-sidebar">
        <div className="px-4 mb-6">
          <h2 className="font-semibold text-gray-900">Your Enhanced Health</h2>
        </div>
        
        <div className="mb-6">
          <p className="px-4 text-xs font-medium text-gray-500 mb-2">Discover</p>
          <nav className="space-y-1">
            <a href="/dashboard" className="sidebar-link active">
              <HomeIcon className="w-4 h-4" />
              Dashboard
            </a>
            <a href="/daily-metrics" className="sidebar-link">
              <DailyIcon className="w-4 h-4" />
              Daily
            </a>
            <a href="#" className="sidebar-link">
              <WeeklyIcon className="w-4 h-4" />
              Weekly
            </a>
          </nav>
        </div>
        
        <div>
          <p className="px-4 text-xs font-medium text-gray-500 mb-2">Library</p>
          <nav className="space-y-1">
            <a href="/blood-tests" className="sidebar-link">
              <BloodsIcon className="w-4 h-4" />
              Bloods
            </a>
            <a href="/body-progress" className="sidebar-link">
              <ProgressPhotosIcon className="w-4 h-4" />
              Progress Photos
            </a>
            <a href="#" className="sidebar-link">
              <MeasurementsIcon className="w-4 h-4" />
              Measurements
            </a>
            <a href="/supplements" className="sidebar-link">
              <SupplementsIcon className="w-4 h-4" />
              Supplements
            </a>
            <a href="/targets" className="sidebar-link">
              <GoalsIcon className="w-4 h-4" />
              Goals
            </a>
          </nav>
        </div>
      </div>

      <div className="figma-content flex-1">
        <div className="figma-header">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Dashboard</h1>
            <p className="text-gray-500 text-sm">Track your progress and meet your daily targets</p>
          </div>
          
          <div className="flex items-center">
            <div className="bg-black text-white rounded-full px-3 py-1 text-sm">
              {format(date, "MMMM do")}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-6">
          <button 
            className={`figma-tab px-4 py-1 rounded-full ${activeTab === 'food' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('food')}
          >
            Food
          </button>
          <button 
            className={`figma-tab px-4 py-1 rounded-full ${activeTab === 'activity' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button 
            className={`figma-tab px-4 py-1 rounded-full ${activeTab === 'health' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab('health')}
          >
            Health
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="figma-metric-card">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 font-medium">Calories</div>
              <div className="text-3xl font-bold mt-1">3,250</div>
              <div className="text-xs text-gray-500 mt-1">+8% over the last 30 days</div>
            </CardContent>
          </Card>
          
          <Card className="figma-metric-card">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 font-medium">Protein</div>
              <div className="text-3xl font-bold mt-1">200g</div>
              <div className="text-xs text-gray-500 mt-1">+8% over the last 30 days</div>
            </CardContent>
          </Card>
          
          <Card className="figma-metric-card">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 font-medium">Carbs</div>
              <div className="text-3xl font-bold mt-1">500g</div>
              <div className="text-xs text-gray-500 mt-1">-5% over the last 30 days</div>
            </CardContent>
          </Card>
          
          <Card className="figma-metric-card">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 font-medium">Fat</div>
              <div className="text-3xl font-bold mt-1">50g</div>
              <div className="text-xs text-gray-500 mt-1">-6% over the last 30 days</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 figma-data-card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add {formattedDate}'s Data</h2>
            
            <div className="grid grid-cols-2 mb-2">
              <div className="text-sm text-gray-500 font-medium">Source</div>
              <div className="text-sm text-gray-500 font-medium">Input Your Data</div>
            </div>
            
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="grid grid-cols-2 items-center mb-3">
                <div className="text-sm text-gray-700">test name</div>
                <Input className="h-9 bg-gray-100 border-gray-200" />
              </div>
            ))}
            
            <h2 className="text-lg font-medium text-gray-900 mt-8 mb-4">Supplements</h2>
            
            <div className="grid grid-cols-2 mb-2">
              <div className="text-sm text-gray-500 font-medium">Source</div>
              <div className="text-sm text-gray-500 font-medium">Timing & Dosage</div>
            </div>
            
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="grid grid-cols-2 items-center mb-3">
                <div className="text-sm text-gray-700">supplement name</div>
                <div className="text-sm text-gray-700">Timing & dose</div>
              </div>
            ))}
          </div>
          
          <div className="figma-data-card">
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Weight</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">82.5</p>
                  <p className="text-sm text-gray-500">kg</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Sleep</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">7.5</p>
                  <p className="text-sm text-gray-500">hours</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Steps</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">8,547</p>
                  <p className="text-sm text-gray-500">steps</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Water</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">2.5</p>
                  <p className="text-sm text-gray-500">liters</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Meal Quality</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">8/10</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Recovery</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">7/10</p>
                </div>
              </div>
              
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-4">
                Save Today's Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
