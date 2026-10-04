import { useState } from "react";
import { Bell, FileText, Zap, Star, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  icon: typeof Bell;
  color: string;
  read: boolean;
}

const initial: Notification[] = [
  { id: 1, title: "New tool released", desc: "AI Image Enhancer is now live", time: "2m ago", icon: Zap, color: "text-primary", read: false },
  { id: 2, title: "File processed", desc: "Your PDF merge completed", time: "1h ago", icon: CheckCircle2, color: "text-green-500", read: false },
  { id: 3, title: "Weekly digest", desc: "You saved 3.5 hours this week", time: "1d ago", icon: Star, color: "text-amber-500", read: false },
  { id: 4, title: "Storage almost full", desc: "80% of your quota used", time: "2d ago", icon: AlertCircle, color: "text-rose-500", read: true },
  { id: 5, title: "New blog post", desc: "10 tips for faster PDF work", time: "3d ago", icon: FileText, color: "text-blue-500", read: true },
];

const NotificationBell = () => {
  const [items, setItems] = useState<Notification[]>(initial);
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="font-semibold text-sm">Notifications</p>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 text-left hover:bg-muted/50 transition-colors",
                  !n.read && "bg-primary/5"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary shrink-0">
                  <n.icon className={cn("h-4 w-4", n.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{n.time}</p>
                </div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
              </button>
            ))
          )}
        </div>
        <div className="p-2 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
