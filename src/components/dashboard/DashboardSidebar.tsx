import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, User, Clock, Shield, Code, Settings, ChevronLeft, ChevronRight, Menu,
  BarChart3, CreditCard,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "History", href: "/dashboard/history", icon: Clock },
  { title: "User Panel", href: "/dashboard/user", icon: User },
  { title: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { title: "Admin Panel", href: "/dashboard/admin", icon: Shield },
  { title: "Developer", href: "/dashboard/developer", icon: Code },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

const SidebarNav = ({ collapsed = false, onItemClick }: { collapsed?: boolean; onItemClick?: () => void }) => {
  const location = useLocation();

  return (
    <div className="py-4 space-y-1 px-2">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href ||
          (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
        const isExactDashboard = item.href === "/dashboard" && location.pathname === "/dashboard";

        return (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              (isActive || isExactDashboard)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={collapsed ? item.title : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        );
      })}
    </div>
  );
};

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setSheetOpen(true)}
          className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-lg"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="px-4 pt-4 text-lg font-bold gradient-text">Dashboard</SheetTitle>
            <SidebarNav onItemClick={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] border-r border-border bg-card flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex-1 overflow-y-auto">
        <SidebarNav collapsed={collapsed} />
      </div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
};

export default DashboardSidebar;
