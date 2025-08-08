
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  UserIcon,
  MailIcon,
  ShieldIcon,
  LogOutIcon,
  CheckCircleIcon,
  XCircleIcon,
  EditIcon,
  KeyIcon,
  CameraIcon,
  LoaderIcon,
} from 'lucide-react';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  height_cm?: number;
  height_unit?: string;
  weight?: number;
  weight_unit?: string;
  ethnicity?: string;
}

// Note: Notification settings removed - user_preferences table doesn't exist yet
// interface NotificationSettings {
//   email_notifications: boolean;
//   blood_test_reminders: boolean;
//   metric_tracking_reminders: boolean;
//   weekly_reports: boolean;
// }

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, date_of_birth, gender, height_cm, height_unit, weight, weight_unit, ethnicity')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
        return;
      }

      if (data) {
        setProfile(data);
      }

      // Load avatar separately from storage
      loadAvatar();
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadAvatar = async () => {
    if (!user) return;
    
    try {
      // Load avatar from localStorage
      const avatarKey = `avatar_${user.id}`;
      const savedAvatar = localStorage.getItem(avatarKey);
      
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
      }
    } catch (error) {
      console.log('No avatar found, using fallback');
    }
  };

  // Notification settings temporarily removed - user_preferences table doesn't exist
  // const loadNotificationSettings = async () => {
  //   if (!user) return;
  //   
  //   try {
  //     const { data, error } = await supabase
  //       .from('user_preferences')
  //       .select('preference_key, preference_value')
  //       .eq('user_id', user.id)
  //       .in('preference_key', ['email_notifications', 'blood_test_reminders', 'metric_tracking_reminders', 'weekly_reports']);

  //     if (error) {
  //       console.error('Error loading notification settings:', error);
  //       return;
  //     }

  //     const settings: Partial<NotificationSettings> = {};
  //     data?.forEach(setting => {
  //       settings[setting.preference_key as keyof NotificationSettings] = setting.preference_value === 'true';
  //     });

  //     setNotifications(prev => ({ ...prev, ...settings }));
  //   } catch (error) {
  //     console.error('Error loading notification settings:', error);
  //   }
  // };

  const saveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          height_cm: profile.height_cm,
          height_unit: profile.height_unit,
          weight: profile.weight,
          weight_unit: profile.weight_unit,
          ethnicity: profile.ethnicity,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving profile:', error);
        toast.error('Failed to save profile');
        return;
      }

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // Notification settings temporarily removed - user_preferences table doesn't exist
  // const saveNotificationSetting = async (key: keyof NotificationSettings, value: boolean) => {
  //   if (!user) return;
  //   
  //   try {
  //     const { error } = await supabase
  //       .from('user_preferences')
  //       .upsert({
  //         user_id: user.id,
  //         preference_key: key,
  //         preference_value: value.toString(),
  //       });

  //     if (error) {
  //       console.error('Error saving notification setting:', error);
  //       toast.error('Failed to update notification setting');
  //       return;
  //     }

  //     setNotifications(prev => ({ ...prev, [key]: value }));
  //     toast.success('Notification setting updated');
  //   } catch (error) {
  //     console.error('Error saving notification setting:', error);
  //     toast.error('Failed to update notification setting');
  //   }
  // };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    
    setIsUploadingAvatar(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target?.result as string;
        
        // Store avatar as base64 in localStorage (simple solution)
        const avatarKey = `avatar_${user.id}`;
        localStorage.setItem(avatarKey, base64String);
        
        // Update state to show new avatar
        setAvatarUrl(base64String);
        
        toast.success('Avatar updated successfully');
        setIsUploadingAvatar(false);
      };
      
      reader.onerror = () => {
        toast.error('Failed to process image');
        setIsUploadingAvatar(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      toast.error('Failed to upload avatar');
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    uploadAvatar(file);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const getInitials = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  const getFullName = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile.first_name) {
      return profile.first_name;
    }
    return user?.email || "User";
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          {user?.email_confirmed_at ? (
            <>
              <CheckCircleIcon className="h-3 w-3 text-green-600" />
              Verified
            </>
          ) : (
            <>
              <XCircleIcon className="h-3 w-3 text-red-600" />
              Unverified
            </>
          )}
        </Badge>
      </div>

      {/* Profile Overview Card */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                  disabled={isUploadingAvatar}
                />
                <Label
                  htmlFor="avatar-upload"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {isUploadingAvatar ? (
                    <LoaderIcon className="h-3 w-3 animate-spin" />
                  ) : (
                    <CameraIcon className="h-3 w-3" />
                  )}
                </Label>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{getFullName()}</h3>
              <p className="text-muted-foreground flex items-center gap-1">
                <MailIcon className="h-4 w-4" />
                {user?.email}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">
                  Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  }) : 'N/A'}
                </span>
              </div>
            </div>
            <Button 
              variant={isEditing ? "default" : "outline"} 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <EditIcon className="h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={profile.first_name || ""} 
                  onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={profile.last_name || ""} 
                  onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={user?.email || ""} 
                disabled 
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input 
                id="dateOfBirth" 
                type="date" 
                value={profile.date_of_birth || ""} 
                onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={profile.gender || ""} 
                  onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ethnicity">Ethnicity</Label>
                <Select 
                  value={profile.ethnicity || ""} 
                  onValueChange={(value) => setProfile(prev => ({ ...prev, ethnicity: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ethnicity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caucasian">Caucasian</SelectItem>
                    <SelectItem value="african_american">African American</SelectItem>
                    <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="native_american">Native American</SelectItem>
                    <SelectItem value="pacific_islander">Pacific Islander</SelectItem>
                    <SelectItem value="mixed">Mixed Race</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <div className="flex gap-2">
                  <Input 
                    id="height" 
                    type="number" 
                    value={profile.height_cm || ""} 
                    onChange={(e) => setProfile(prev => ({ ...prev, height_cm: parseFloat(e.target.value) || undefined }))}
                    disabled={!isEditing}
                    placeholder="Height"
                  />
                  <Select 
                    value={profile.height_unit || "cm"} 
                    onValueChange={(value) => setProfile(prev => ({ ...prev, height_unit: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input 
                    id="weight" 
                    type="number" 
                    value={profile.weight || ""} 
                    onChange={(e) => setProfile(prev => ({ ...prev, weight: parseFloat(e.target.value) || undefined }))}
                    disabled={!isEditing}
                    placeholder="Weight"
                  />
                  <Select 
                    value={profile.weight_unit || "kg"} 
                    onValueChange={(value) => setProfile(prev => ({ ...prev, weight_unit: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isEditing && (
              <Button 
                onClick={saveProfile} 
                disabled={isSaving} 
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </CardContent>
        </Card>



        {/* Account & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5" />
              Account & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium">Email Verified</span>
                <p className="text-xs text-muted-foreground">Your email address has been verified</p>
              </div>
              <Badge variant={user?.email_confirmed_at ? "default" : "destructive"}>
                {user?.email_confirmed_at ? "Verified" : "Unverified"}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Last Sign In</span>
              <span className="text-sm text-muted-foreground">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A"}
              </span>
            </div>

            <div className="pt-2 space-y-2">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <KeyIcon className="h-4 w-4" />
                Change Password
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center gap-2 text-red-600 hover:text-red-700">
                    <LogOutIcon className="h-4 w-4" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be redirected to the sign-in page and will need to enter your credentials again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
