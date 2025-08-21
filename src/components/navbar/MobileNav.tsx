
import { forwardRef } from "react";
import { NavItem } from "./NavItem";
import { 
  FlaskConicalIcon, 
  HeartPulseIcon, 
  CalendarIcon, 
  TrendingUpIcon, 
  TargetIcon, 
  PillIcon,
  BarChart3Icon,
  SettingsIcon,
  UserIcon
} from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  currentPath: string;
  onNavClick?: () => void;
}

export const MobileNav = forwardRef<HTMLDivElement, MobileNavProps>(
  ({ isOpen, currentPath, onNavClick }, ref) => {
    if (!isOpen) return null;

    return (
      <div 
        ref={ref} 
        className="md:hidden bg-background/95 backdrop-blur-md border-b border-border shadow-lg animate-in slide-in-from-top-2 duration-300"
      >
        <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-2">
          {/* Main Navigation Items */}
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-2">
            Main Navigation
          </div>
          
          <NavItem 
            to="/daily" 
            icon={HeartPulseIcon} 
            label="Daily" 
            isActive={currentPath === '/daily'} 
            onClick={onNavClick}
          />
          
          <NavItem 
            to="/blood-tests" 
            icon={FlaskConicalIcon} 
            label="Blood Results" 
            isActive={currentPath === '/blood-tests'} 
            onClick={onNavClick}
          />
          
          <NavItem 
            to="/analytics" 
            icon={BarChart3Icon} 
            label="Analytics" 
            isActive={currentPath === '/analytics'} 
            onClick={onNavClick}
          />
          
          <NavItem 
            to="/trends" 
            icon={TrendingUpIcon} 
            label="Trends" 
            isActive={currentPath === '/trends'} 
            onClick={onNavClick}
          />
          
          <NavItem 
            to="/cycle-planner" 
            icon={CalendarIcon} 
            label="Cycle Planner" 
            isActive={currentPath === '/cycle-planner'} 
            onClick={onNavClick}
          />
          
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-2 mt-4">
            Management
          </div>
          
          <NavItem 
            to="/targets" 
            icon={TargetIcon} 
            label="Targets" 
            isActive={currentPath === '/targets'} 
            onClick={onNavClick}
          />
          
          <NavItem 
            to="/supplements" 
            icon={PillIcon} 
            label="Supplements" 
            isActive={currentPath === '/supplements'} 
            onClick={onNavClick}
          />
          
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-2 mt-4">
            Account
          </div>
          
          <NavItem 
            to="/profile" 
            icon={UserIcon} 
            label="Profile" 
            isActive={currentPath === '/profile'} 
            onClick={onNavClick}
          />
          
          <NavItem 
            to="/settings" 
            icon={SettingsIcon} 
            label="Settings" 
            isActive={currentPath === '/settings'} 
            onClick={onNavClick}
          />
        </div>
      </div>
    );
  }
);

MobileNav.displayName = 'MobileNav';
