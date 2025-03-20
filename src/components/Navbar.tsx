
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ActivityIcon,
  BarChartIcon,
  DropletIcon,
  HeartPulseIcon,
  ImageIcon,
  WeightIcon,
  PillIcon,
  TargetIcon,
  ChevronLeftIcon,
  MenuIcon
} from "lucide-react";

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

const Navbar = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // This is to prevent hydration mismatch
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
            <span>FitTrack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem 
              to="/" 
              icon={BarChartIcon}
              label="Dashboard" 
              isActive={location.pathname === '/'} 
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

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-muted-foreground"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <div className="max-w-screen-xl mx-auto px-4 py-2 space-y-1">
            <NavItem 
              to="/" 
              icon={BarChartIcon}
              label="Dashboard" 
              isActive={location.pathname === '/'} 
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
