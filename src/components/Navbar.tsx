import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ActivityIcon,
  BarChartIcon,
  DropletIcon,
  HeartPulseIcon,
  ImageIcon,
  PillIcon,
  TargetIcon,
  MenuIcon,
  UserIcon,
  SettingsIcon,
  MessageSquareIcon,
  CreditCardIcon,
  LogOutIcon
} from "lucide-react";
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

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive 
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean;
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300",
        "hover:bg-secondary/80",
        isActive ? "bg-secondary text-primary font-medium" : "text-muted-foreground"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-all duration-300",
        isActive ? "text-primary" : "text-muted-foreground"
      )} />
      <span>{label}</span>
    </Link>
  );
};

const UserDropdown = () => {
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

const Navbar = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-14">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-semibold text-foreground"
          >
            <HeartPulseIcon className="h-6 w-6 text-primary" />
            <span>Your Veta Health</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem 
              to="/dashboard" 
              icon={BarChartIcon}
              label="Dashboard" 
              isActive={location.pathname === '/dashboard'} 
            />
            <NavItem 
              to="/daily-metrics" 
              icon={ActivityIcon} 
              label="Daily Metrics" 
              isActive={location.pathname === '/daily-metrics'} 
            />
            <NavItem 
              to="/supplements" 
              icon={PillIcon} 
              label="Supplements" 
              isActive={location.pathname === '/supplements'} 
            />
            <NavItem 
              to="/targets" 
              icon={TargetIcon} 
              label="Targets" 
              isActive={location.pathname === '/targets'} 
            />
            <NavItem 
              to="/body-progress" 
              icon={ImageIcon} 
              label="Progress" 
              isActive={location.pathname === '/body-progress'} 
            />
            <NavItem 
              to="/blood-tests" 
              icon={DropletIcon} 
              label="Blood Tests" 
              isActive={location.pathname === '/blood-tests'} 
            />
          </nav>

          <div className="flex items-center gap-4">
            {user && <UserDropdown />}
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-muted-foreground"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <div className="max-w-screen-xl mx-auto px-4 py-2 space-y-1">
            <NavItem 
              to="/dashboard" 
              icon={BarChartIcon}
              label="Dashboard" 
              isActive={location.pathname === '/dashboard'} 
            />
            <NavItem 
              to="/daily-metrics" 
              icon={ActivityIcon} 
              label="Daily Metrics" 
              isActive={location.pathname === '/daily-metrics'} 
            />
            <NavItem 
              to="/supplements" 
              icon={PillIcon} 
              label="Supplements" 
              isActive={location.pathname === '/supplements'} 
            />
            <NavItem 
              to="/targets" 
              icon={TargetIcon} 
              label="Targets" 
              isActive={location.pathname === '/targets'} 
            />
            <NavItem 
              to="/body-progress" 
              icon={ImageIcon} 
              label="Progress" 
              isActive={location.pathname === '/body-progress'} 
            />
            <NavItem 
              to="/blood-tests" 
              icon={DropletIcon} 
              label="Blood Tests" 
              isActive={location.pathname === '/blood-tests'} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
