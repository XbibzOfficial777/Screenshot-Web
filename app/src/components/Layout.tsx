import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Camera, 
  Settings, 
  History, 
  BarChart3, 
  Menu, 
  Sun, 
  Moon, 
  Monitor,
  ChevronLeft,
  ChevronRight,
  Github
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Camera },
  { label: 'History', href: '/history', icon: History },
  { label: 'Statistics', href: '/stats', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
          <Camera className="w-5 h-5 text-primary-foreground" />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">Screenshot Pro</span>
            <span className="text-xs text-muted-foreground">Browser Automation</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${active 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`w-5 h-5 ${active ? '' : 'group-hover:scale-110'} transition-transform`} />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border/50 space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'} gap-2`}
        >
          {resolvedTheme === 'dark' ? (
            <>
              <Sun className="w-4 h-4" />
              {!sidebarCollapsed && <span>Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              {!sidebarCollapsed && <span>Dark Mode</span>}
            </>
          )}
        </Button>

        {!sidebarCollapsed && (
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`
          hidden lg:flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        <NavContent />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground shadow-lg"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}