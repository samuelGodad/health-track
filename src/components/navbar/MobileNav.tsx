
import { NavItem } from "./NavItem";
import { FlaskConicalIcon } from "lucide-react";

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
          to="/blood-tests" 
          icon={FlaskConicalIcon} 
          label="Blood Results" 
          isActive={currentPath === '/blood-tests'} 
        />
      </div>
    </div>
  );
};
