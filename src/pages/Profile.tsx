
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Page content only, NO header/hamburger/sidebar here */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
            <p className="text-muted-foreground">Manage your account information and preferences.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" />
              </div>
              
              <Button className="w-full">Update Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Account Created</span>
                <span className="text-sm text-muted-foreground">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Last Sign In</span>
                <span className="text-sm text-muted-foreground">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A"}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Email Verified</span>
                <span className="text-sm text-muted-foreground">
                  {user?.email_confirmed_at ? "Yes" : "No"}
                </span>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
