import { useAuth } from "@/contexts/AuthContext";
import { User, Star, Bookmark, Bell, FileText, Image, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const UserPanel = () => {
  const { user } = useAuth();

  const savedTools = [
    { name: "PDF Merger", icon: FileText, lastUsed: "2 hours ago" },
    { name: "Image Compressor", icon: Image, lastUsed: "1 day ago" },
    { name: "Video Converter", icon: Video, lastUsed: "3 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Panel</h1>
        <p className="text-muted-foreground">Manage your preferences and saved items</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              Saved Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedTools.map((tool, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <tool.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">Last used: {tool.lastUsed}</p>
                  </div>
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif" className="text-sm">Email Notifications</Label>
              <Switch id="email-notif" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tool-updates" className="text-sm">Tool Updates</Label>
              <Switch id="tool-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-summary" className="text-sm">Weekly Summary</Label>
              <Switch id="weekly-summary" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-features" className="text-sm">New Features</Label>
              <Switch id="new-features" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserPanel;
