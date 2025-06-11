
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
  SyringeIcon,
  ClipboardIcon,
  BarChart3Icon,
  TrendingUpIcon,
  ActivityIcon,
  UserIcon,
  SettingsIcon,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Blood Results',
    url: '/blood-tests',
    icon: FlaskConicalIcon,
  },
  {
    title: 'Cycle Planning',
    url: '/cycle-planner',
    icon: ClipboardIcon,
  },
  {
    title: 'Injections',
    url: '/injection-assistant',
    icon: SyringeIcon,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3Icon,
  },
  {
    title: 'Trends',
    url: '/trends',
    icon: TrendingUpIcon,
  },
];

const secondaryItems = [
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
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
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
