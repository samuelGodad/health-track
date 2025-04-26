
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserIcon,
  SettingsIcon,
  MessageSquareIcon,
  CreditCardIcon,
  LogOutIcon
} from "lucide-react";

export const UserDropdown = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center rounded-full bg-secondary/70 p-1 hover:bg-secondary transition-colors">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>My Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageSquareIcon className="mr-2 h-4 w-4" />
          <span>Leave Feedback</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
