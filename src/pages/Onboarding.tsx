
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Available metrics for tracking
const AVAILABLE_METRICS = [
  { id: "weight", name: "Weight" },
  { id: "sleep", name: "Sleep" },
  { id: "steps", name: "Steps" },
  { id: "water", name: "Water Intake" },
  { id: "blood_pressure", name: "Blood Pressure" },
  { id: "blood_glucose", name: "Blood Glucose" },
  { id: "resting_heart_rate", name: "Resting Heart Rate" },
  { id: "calories", name: "Calories" },
  { id: "protein", name: "Protein" },
  { id: "carbohydrates", name: "Carbohydrates" },
  { id: "fats", name: "Fats" },
  { id: "fatigue", name: "Fatigue" },
  { id: "nutrition_quality", name: "Nutrition Quality" },
  { id: "appetite", name: "Appetite" },
  { id: "digestion", name: "Digestion" },
  { id: "training_performance", name: "Training Performance" },
  { id: "motivation", name: "Motivation" },
  { id: "mental_health", name: "Mental Health" },
];

// Available ethnicities
const ETHNICITIES = [
  { value: "white", label: "White/Caucasian" },
  { value: "black", label: "Black/African American" },
  { value: "asian", label: "Asian" },
  { value: "hispanic", label: "Hispanic/Latino" },
  { value: "middle_eastern", label: "Middle Eastern" },
  { value: "native_american", label: "Native American" },
  { value: "pacific_islander", label: "Pacific Islander" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

// Weekday options
const WEEKDAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Primary Questions - Step 1
  const [gender, setGender] = useState<string>("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft_in">("cm");
  const [heightCm, setHeightCm] = useState<string>("");
  const [heightFt, setHeightFt] = useState<string>("");
  const [heightIn, setHeightIn] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [ethnicity, setEthnicity] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [weight, setWeight] = useState<string>("");
  const [getsBloodsTested, setGetsBloodsTested] = useState<boolean>(false);
  const [takesSupplement, setTakesSupplement] = useState<boolean>(false);
  const [takesPeds, setTakesPeds] = useState<boolean>(false);
  const [weeklyDataDay, setWeeklyDataDay] = useState<string>("");

  // Metric preferences - Step 2
  const [metricPreferences, setMetricPreferences] = useState<Record<string, string>>(
    Object.fromEntries(AVAILABLE_METRICS.map(metric => [metric.id, "not_tracking"]))
  );

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const calculateHeightInCm = (): number | null => {
    if (heightUnit === "cm" && heightCm) {
      return parseFloat(heightCm);
    } else if (heightUnit === "ft_in" && heightFt) {
      const feet = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      return Math.round((feet * 30.48) + (inches * 2.54));
    }
    return null;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("User not found. Please sign in again.");
      }

      // Calculate height in cm
      const heightInCm = calculateHeightInCm();
      
      // Update profile with basic information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          gender,
          height_cm: heightInCm,
          height_unit: heightUnit,
          date_of_birth: dob,
          ethnicity,
          weight: parseFloat(weight) || null,
          weight_unit: weightUnit,
          gets_bloods_tested: getsBloodsTested,
          takes_supplements: takesSupplement,
          takes_peds: takesPeds,
          weekly_data_day: weeklyDataDay,
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Save metric preferences
      const metricPreferencesArray = Object.entries(metricPreferences).map(([metric_name, tracking_frequency]) => ({
        user_id: user.id,
        metric_name,
        tracking_frequency
      }));

      const { error: metricsError } = await supabase
        .from('user_metric_preferences')
        .upsert(metricPreferencesArray);

      if (metricsError) throw metricsError;

      toast({
        title: "Profile updated",
        description: "Your health journey begins now!",
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error saving onboarding data:", err);
      setError(err.message || "Failed to save your preferences");
      toast({
        title: "Error",
        description: err.message || "Failed to save your preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMetricFrequencyChange = (metricId: string, frequency: string) => {
    setMetricPreferences(prev => ({
      ...prev,
      [metricId]: frequency
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden rounded-lg border border-border/50 bg-card/90 backdrop-blur-sm shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <h1 className="text-2xl font-bold text-primary">Your Vita Health</h1>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Welcome, let's customize your dashboard for you</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 1 
                  ? "First, we'll collect some basic information to personalize your experience" 
                  : "Next, let's set up which metrics you'd like to track and how often"}
              </p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Gender</Label>
                  <ToggleGroup 
                    type="single" 
                    value={gender} 
                    onValueChange={(val) => val && setGender(val)}
                    variant="outline" 
                    className="inline-flex gap-0 -space-x-px rounded-lg shadow-sm shadow-black/5 bg-background"
                  >
                    <ToggleGroupItem 
                      value="male" 
                      className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                    >
                      Male
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="female" 
                      className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                    >
                      Female
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="space-y-3">
                  <Label>Height</Label>
                  <div className="space-y-2">
                    <ToggleGroup 
                      type="single" 
                      value={heightUnit} 
                      onValueChange={(val) => val && setHeightUnit(val as "cm" | "ft_in")}
                      variant="outline" 
                      className="inline-flex gap-0 -space-x-px rounded-lg shadow-sm shadow-black/5 bg-background"
                    >
                      <ToggleGroupItem 
                        value="cm" 
                        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                      >
                        Centimeters
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="ft_in" 
                        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                      >
                        Feet/Inches
                      </ToggleGroupItem>
                    </ToggleGroup>
                    
                    {heightUnit === "cm" ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                          placeholder="Height in cm"
                        />
                        <span className="text-sm font-medium">cm</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={heightFt}
                          onChange={(e) => setHeightFt(e.target.value)}
                          placeholder="Feet"
                          className="w-24"
                        />
                        <span className="text-sm font-medium">ft</span>
                        <Input
                          type="number"
                          value={heightIn}
                          onChange={(e) => setHeightIn(e.target.value)}
                          placeholder="Inches"
                          className="w-24"
                        />
                        <span className="text-sm font-medium">in</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Weight</Label>
                  <div className="space-y-2">
                    <ToggleGroup 
                      type="single" 
                      value={weightUnit} 
                      onValueChange={(val) => val && setWeightUnit(val as "kg" | "lb")}
                      variant="outline" 
                      className="inline-flex gap-0 -space-x-px rounded-lg shadow-sm shadow-black/5 bg-background"
                    >
                      <ToggleGroupItem 
                        value="kg" 
                        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                      >
                        Kilograms
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="lb" 
                        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                      >
                        Pounds
                      </ToggleGroupItem>
                    </ToggleGroup>
                    
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder={`Weight in ${weightUnit}`}
                      />
                      <span className="text-sm font-medium">{weightUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Ethnicity</Label>
                  <Select value={ethnicity} onValueChange={setEthnicity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      {ETHNICITIES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bloodsCheck">Do you get your bloods tested?</Label>
                    <Switch 
                      id="bloodsCheck"
                      checked={getsBloodsTested} 
                      onCheckedChange={setGetsBloodsTested} 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supplementsCheck">Do you take over the counter supplements?</Label>
                    <Switch 
                      id="supplementsCheck"
                      checked={takesSupplement} 
                      onCheckedChange={setTakesSupplement} 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pedsCheck">Are you taking any PEDs?</Label>
                    <Switch 
                      id="pedsCheck"
                      checked={takesPeds} 
                      onCheckedChange={setTakesPeds} 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>When would you like to input your weekly data?</Label>
                  <Select value={weeklyDataDay} onValueChange={setWeeklyDataDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day of week" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNextStep} className="gap-2">
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <p className="text-sm">
                  How often would you like to track each metric?
                </p>

                <div className="space-y-4">
                  {AVAILABLE_METRICS.map((metric) => (
                    <div key={metric.id} className="grid grid-cols-[1fr,auto] gap-4 items-center">
                      <Label>{metric.name}</Label>
                      <ToggleGroup 
                        type="single" 
                        value={metricPreferences[metric.id]} 
                        onValueChange={(val) => val && handleMetricFrequencyChange(metric.id, val)}
                        variant="outline" 
                        className="inline-flex gap-0 -space-x-px rounded-lg shadow-sm shadow-black/5 bg-background"
                      >
                        <ToggleGroupItem 
                          value="daily" 
                          className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 text-sm px-2 py-1"
                        >
                          Daily
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="weekly" 
                          className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 text-sm px-2 py-1"
                        >
                          Weekly
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="not_tracking" 
                          className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 text-sm px-2 py-1"
                        >
                          Not Tracking
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : "Complete Setup"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
