
import { NavItem } from "./NavItem";
import { ClipboardIcon, SyringeIcon, FlaskConicalIcon } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  currentPath: string;
}

export const MobileNav = ({ isOpen, currentPath }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 py-2 space-y-1">
        <NavItem 
          to="/cycle-planner" 
          icon={ClipboardIcon}
          label="Cycle Planner" 
          isActive={currentPath === '/cycle-planner'} 
        />
        <NavItem 
          to="/injection-assistant" 
          icon={SyringeIcon} 
          label="Injection Assistant" 
          isActive={currentPath === '/injection-assistant'} 
        />
        <NavItem 
          to="/blood-tests" 
          icon={FlaskConicalIcon} 
          label="Blood Results" 
          isActive={currentPath === '/blood-tests'} 
        />
      </div>
    </div>
  );
};
