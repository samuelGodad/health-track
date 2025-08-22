
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { HeartPulseIcon, FlaskConicalIcon, MenuIcon } from "lucide-react";
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!mounted) return null;

  // Don't show blood results nav item on cycle planner page
  const showBloodResults = location.pathname !== '/cycle-planner';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-semibold text-foreground"
            >
              <span className="whitespace-nowrap">Enhanced Health</span>
              <img src="/logo.svg" alt="Enhanced Health" className="h-6 w-6 flex-shrink-0" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center flex-1 justify-center">
            {showBloodResults && (
              <NavItem 
                to="/blood-tests" 
                icon={FlaskConicalIcon} 
                label="Blood Results" 
                isActive={location.pathname === '/blood-tests'} 
              />
            )}
          </nav>

          <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
            {user && (
              <div className="flex-shrink-0">
                <UserDropdown />
              </div>
            )}
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-muted-foreground flex-shrink-0"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <MobileNav 
        ref={mobileMenuRef}
        isOpen={mobileMenuOpen} 
        currentPath={location.pathname} 
        onNavClick={() => setMobileMenuOpen(false)}
      />
    </div>
  );
};

export default Navbar;
