
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export const NavItem = ({ to, icon: Icon, label, isActive, onClick }: NavItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Call the onClick callback immediately to close mobile menu
    if (onClick) {
      onClick();
    }
    // Navigate to the target route
    navigate(to);
  };

  return (
    <button 
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 px-6 py-3 transition-all duration-300 w-full text-left",
        "hover:bg-secondary/80",
        isActive ? "border-b-2 border-primary text-primary font-medium" : "text-muted-foreground"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-all duration-300",
        isActive ? "text-primary" : "text-muted-foreground"
      )} />
      <span>{label}</span>
    </button>
  );
};
