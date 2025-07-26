
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    Object.fromEntries(AVAILABLE_METRICS.map(metric => [metric.id, ""]))
  );

  // Pre-fill data from Google OAuth if available
  useEffect(() => {
    if (user?.user_metadata) {
      const { first_name, last_name, full_name, name } = user.user_metadata;
      
      // If we have first_name and last_name from Google, pre-fill them
      if (first_name && last_name) {
        // These will be saved to the profile in handleSubmit
        console.log('Pre-filling with Google data:', { first_name, last_name });
      }
      
      // If we have full_name but no first/last, try to parse it
      if (!first_name && !last_name && (full_name || name)) {
        const fullName = full_name || name;
        const nameParts = fullName.split(' ');
        if (nameParts.length >= 2) {
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');
          console.log('Parsed name from Google:', { firstName, lastName });
        }
      }
    }
  }, [user]);

  // Check if user already has a profile and redirect to dashboard
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking profile:", error);
        }
        
        // If user already has a complete profile (with first_name), check metric preferences
        if (profile?.first_name) {
          console.log('Complete profile found, checking metric preferences...');
          
          const { data: metricPreferences, error: metricError } = await supabase
            .from('user_metric_preferences')
            .select('metric_name, tracking_frequency')
            .eq('user_id', user.id);

          console.log('Metric preferences check:', {
            hasPreferences: !!metricPreferences && metricPreferences.length > 0,
            preferenceCount: metricPreferences?.length || 0
          });

          // If user has both complete profile AND metric preferences, redirect to dashboard
          if (metricPreferences && metricPreferences.length > 0) {
            console.log('User has complete profile and metric preferences, redirecting to dashboard');
            navigate('/dashboard');
          }
          // If no metric preferences, stay on onboarding to complete them
        }
      } catch (error) {
        console.error("Error checking existing profile:", error);
      }
    };

    checkExistingProfile();
  }, [user, navigate]);
  
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    
    if (!gender) errors.gender = "Please select your gender";
    if (heightUnit === "cm" && !heightCm) errors.height = "Please enter your height";
    if (heightUnit === "ft_in" && (!heightFt || !heightIn)) errors.height = "Please enter your height";
    if (!dob) errors.dob = "Please enter your date of birth";
    if (!ethnicity) errors.ethnicity = "Please select your ethnicity";
    if (!weight) errors.weight = "Please enter your weight";
    if (!weeklyDataDay) errors.weeklyDataDay = "Please select a day for weekly data";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    
    // Check if all metrics have a selection
    const missingMetrics = Object.entries(metricPreferences).filter(([_, value]) => !value);
    if (missingMetrics.length > 0) {
      errors.metrics = "Please select tracking frequency for all metrics";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(step + 1);
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
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
    if (!validateStep2()) {
      toast({
        title: "Missing information",
        description: "Please select tracking frequency for all metrics",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("User not found. Please sign in again.");
      }

      // Calculate height in cm
      const heightInCm = calculateHeightInCm();
      
      // Extract user data from Google OAuth or form
      let firstName = user.user_metadata?.first_name;
      let lastName = user.user_metadata?.last_name;
      
      // If Google didn't provide first/last name, try to parse from full_name
      if (!firstName && !lastName && user.user_metadata?.full_name) {
        const nameParts = user.user_metadata.full_name.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
      
      // If still no names, try the 'name' field
      if (!firstName && !lastName && user.user_metadata?.name) {
        const nameParts = user.user_metadata.name.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
      
      // Create or update profile with basic information
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
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
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString()
        });

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 p-4">
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden rounded-lg border-none bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <h1 className="text-2xl font-bold text-blue-600">Your Enhanced Health</h1>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800">
                {user?.user_metadata?.first_name 
                  ? `Welcome, ${user.user_metadata.first_name}! Let's customize your dashboard`
                  : "Welcome, let's customize your dashboard for you"
                }
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {user?.user_metadata?.first_name && (
                  <span className="text-blue-600 font-medium">
                    Thanks for signing up with Google! 
                  </span>
                )}
                {step === 1 
                  ? "First, we'll collect some basic information to personalize your experience" 
                  : "Next, let's set up which metrics you'd like to track and how often"}
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-gray-700">Gender</Label>
                  {formErrors.gender && <p className="text-sm text-red-500">{formErrors.gender}</p>}
                  <ToggleGroup 
                    type="single" 
                    value={gender} 
                    onValueChange={(val) => val && setGender(val)}
                    variant="outline" 
                    className="inline-flex w-full gap-0 rounded-lg shadow-sm bg-background"
                  >
                    <ToggleGroupItem 
                      value="male" 
                      className="flex-1 rounded-l-lg rounded-r-none"
                    >
                      Male
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="female" 
                      className="flex-1 rounded-l-none rounded-r-lg"
                    >
                      Female
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700">Height</Label>
                  {formErrors.height && <p className="text-sm text-red-500">{formErrors.height}</p>}
                  <div className="space-y-2">
                    <ToggleGroup 
                      type="single" 
                      value={heightUnit} 
                      onValueChange={(val) => val && setHeightUnit(val as "cm" | "ft_in")}
                      variant="outline" 
                      className="inline-flex w-full gap-0 rounded-lg shadow-sm bg-background"
                    >
                      <ToggleGroupItem 
                        value="cm" 
                        className="flex-1 rounded-l-lg rounded-r-none"
                      >
                        Centimeters
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="ft_in" 
                        className="flex-1 rounded-l-none rounded-r-lg"
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
                          className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-600">cm</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={heightFt}
                          onChange={(e) => setHeightFt(e.target.value)}
                          placeholder="Feet"
                          className="w-24 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-600">ft</span>
                        <Input
                          type="number"
                          value={heightIn}
                          onChange={(e) => setHeightIn(e.target.value)}
                          placeholder="Inches"
                          className="w-24 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-600">in</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700">Date of Birth</Label>
                  {formErrors.dob && <p className="text-sm text-red-500">{formErrors.dob}</p>}
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700">Weight</Label>
                  {formErrors.weight && <p className="text-sm text-red-500">{formErrors.weight}</p>}
                  <div className="space-y-2">
                    <ToggleGroup 
                      type="single" 
                      value={weightUnit} 
                      onValueChange={(val) => val && setWeightUnit(val as "kg" | "lb")}
                      variant="outline" 
                      className="inline-flex w-full gap-0 rounded-lg shadow-sm bg-background"
                    >
                      <ToggleGroupItem 
                        value="kg" 
                        className="flex-1 rounded-l-lg rounded-r-none"
                      >
                        Kilograms
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="lb" 
                        className="flex-1 rounded-l-none rounded-r-lg"
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
                        className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-600">{weightUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700">Ethnicity</Label>
                  {formErrors.ethnicity && <p className="text-sm text-red-500">{formErrors.ethnicity}</p>}
                  <Select value={ethnicity} onValueChange={setEthnicity}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bloodsCheck" className="text-gray-700">Do you get your bloods tested?</Label>
                    <Switch 
                      id="bloodsCheck"
                      checked={getsBloodsTested} 
                      onCheckedChange={setGetsBloodsTested}
                      className="data-[state=checked]:bg-blue-400"
                    />
                  </div>
                
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supplementsCheck" className="text-gray-700">Do you take over the counter supplements?</Label>
                    <Switch 
                      id="supplementsCheck"
                      checked={takesSupplement} 
                      onCheckedChange={setTakesSupplement}
                      className="data-[state=checked]:bg-blue-400"
                    />
                  </div>
                
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pedsCheck" className="text-gray-700">Are you taking any PEDs?</Label>
                    <Switch 
                      id="pedsCheck"
                      checked={takesPeds} 
                      onCheckedChange={setTakesPeds}
                      className="data-[state=checked]:bg-blue-400" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700">When would you like to input your weekly data?</Label>
                  {formErrors.weeklyDataDay && <p className="text-sm text-red-500">{formErrors.weeklyDataDay}</p>}
                  <Select value={weeklyDataDay} onValueChange={setWeeklyDataDay}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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

                <div className="flex justify-end mt-8">
                  <Button onClick={handleNextStep} className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 mb-4">
                  How often would you like to track each metric?
                </p>
                
                {formErrors.metrics && (
                  <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-lg text-sm">
                    {formErrors.metrics}
                  </div>
                )}

                <div className="space-y-4">
                  {AVAILABLE_METRICS.map((metric) => (
                    <div key={metric.id} className="grid grid-cols-[1fr,auto] gap-4 items-center">
                      <Label className="text-gray-700">{metric.name}</Label>
                      <ToggleGroup 
                        type="single" 
                        value={metricPreferences[metric.id]} 
                        onValueChange={(val) => val && handleMetricFrequencyChange(metric.id, val)}
                        variant="outline" 
                        className="inline-flex gap-0 rounded-lg shadow-sm bg-background"
                      >
                        <ToggleGroupItem 
                          value="daily" 
                          className="rounded-l-lg rounded-r-none text-sm px-3 py-1"
                        >
                          Daily
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="weekly" 
                          className="rounded-none text-sm px-3 py-1"
                        >
                          Weekly
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="not_tracking" 
                          className="rounded-l-none rounded-r-lg text-sm px-3 py-1"
                        >
                          Not Tracking
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handlePrevStep} className="border-gray-200 text-gray-700 hover:bg-gray-100 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
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
