import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  HeartPulseIcon,
  LayoutDashboardIcon,
  FlaskConicalIcon,
  BarChart3Icon,
  TrendingUpIcon,
  UserIcon,
  SettingsIcon,
  CalendarIcon,
  CalendarDaysIcon,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Daily',
    url: '/daily',
    icon: CalendarIcon,
  },
  {
    title: 'Weekly',
    url: '/weekly',
    icon: CalendarDaysIcon,
  },
  {
    title: 'Blood Results',
    url: '/blood-tests',
    icon: FlaskConicalIcon,
  },
  {
    title: 'Blood Analytics',
    url: '/analytics',
    icon: BarChart3Icon,
  },
  {
    title: 'Trends',
    url: '/trends',
    icon: TrendingUpIcon,
  },
];

const accountItems = [
  {
    title: 'Profile',
    url: '/profile',
    icon: UserIcon,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: SettingsIcon,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <HeartPulseIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Vita Health</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Remove Navigation group (Overview section) */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          © 2024 Vita Health
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
