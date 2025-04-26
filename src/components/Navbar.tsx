
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HeartPulseIcon, ClipboardIcon, SyringeIcon, FlaskConicalIcon, MenuIcon } from "lucide-react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { cn } from "@/lib/utils";
import { NavItem } from "./navbar/NavItem";
import { UserDropdown } from "./navbar/UserDropdown";
import { MobileNav } from "./navbar/MobileNav";

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
            <span>Your Vita Health</span>
          </Link>

          <nav className="hidden md:flex items-center">
            <NavItem 
              to="/cycle-planner" 
              icon={ClipboardIcon}
              label="Cycle Planner" 
              isActive={location.pathname === '/cycle-planner'} 
            />
            <NavItem 
              to="/injection-assistant" 
              icon={SyringeIcon} 
              label="Injection Assistant" 
              isActive={location.pathname === '/injection-assistant'} 
            />
            <NavItem 
              to="/blood-tests" 
              icon={FlaskConicalIcon} 
              label="Blood Results" 
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

      <MobileNav isOpen={mobileMenuOpen} currentPath={location.pathname} />
    </div>
  );
};

export default Navbar;
