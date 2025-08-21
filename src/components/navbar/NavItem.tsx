
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export const NavItem = ({ to, icon: Icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-3 transition-all duration-300",
        "hover:bg-secondary/80",
        isActive ? "border-b-2 border-primary text-primary font-medium" : "text-muted-foreground"
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
