import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  Wrench, BarChart3, Clock, Star, FileText, Image, Video, Type,
  Calculator, Zap, ArrowRight, TrendingUp, Heart, User, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DashboardOverview = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Tools Used", value: "12", icon: Wrench, color: "text-primary", bg: "bg-primary/10" },
    { label: "Files Converted", value: "47", icon: BarChart3, color: "text-accent", bg: "bg-accent/10" },
    { label: "Time Saved", value: "3.5h", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Favorites", value: "8", icon: Star, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const recentActivity = [
    { action: "Converted PDF to Word", time: "2 minutes ago", tool: "PDF Tools", icon: FileText },
    { action: "Resized image to 1920x1080", time: "15 minutes ago", tool: "Image Tools", icon: Image },
    { action: "Compressed video file", time: "1 hour ago", tool: "Video Tools", icon: Video },
    { action: "Merged 3 PDF files", time: "3 hours ago", tool: "PDF Tools", icon: FileText },
    { action: "Converted text case", time: "5 hours ago", tool: "Text Tools", icon: Type },
  ];

  const quickTools = [
    { name: "PDF to Word", href: "/tools/pdf/pdf-to-word", icon: FileText, color: "text-red-500" },
    { name: "Image Resize", href: "/tools/image/resize", icon: Image, color: "text-blue-500" },
    { name: "Video Compress", href: "/tools/video/compress", icon: Video, color: "text-purple-500" },
    { name: "Word Counter", href: "/tools/text/word-counter", icon: Type, color: "text-green-500" },
    { name: "Calculator", href: "/tools/calculator/basic", icon: Calculator, color: "text-orange-500" },
    { name: "All Tools", href: "/tools", icon: Wrench, color: "text-primary" },
  ];

  const favoriteTools = [
    { name: "PDF Merger", uses: 15, icon: FileText },
    { name: "Image Compressor", uses: 12, icon: Image },
    { name: "Video Converter", uses: 8, icon: Video },
    { name: "Case Converter", uses: 6, icon: Type },
  ];

  const usageData = [
    { label: "PDF Tools", value: 45, max: 100 },
    { label: "Image Tools", value: 30, max: 100 },
    { label: "Video Tools", value: 15, max: 100 },
    { label: "Text Tools", value: 10, max: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl gradient-primary p-6 md:p-8 text-primary-foreground">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Welcome back, {user?.display_name || user?.email?.split("@")[0] || "Guest"}! 👋
            </h1>
            <p className="text-primary-foreground/80">Here's your activity overview and quick access to your tools.</p>
          </div>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/tools" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Explore Tools
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Tools */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickTools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                  <tool.icon className={`h-5 w-5 ${tool.color}`} />
                </div>
                <span className="text-xs font-medium text-center">{tool.name}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/50 rounded-lg px-2 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary shrink-0">
                      <activity.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground shrink-0">
                      {activity.tool}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">{user?.display_name || "User"}</h3>
                <p className="text-sm text-muted-foreground mb-3">{user?.email || "Guest"}</p>
                <div className="space-y-2 text-left text-sm">
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Member since</span>
                    <span>N/A</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/dashboard/profile">
                    <Settings className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Favorite Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favoriteTools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary shrink-0">
                      <tool.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.uses} uses</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Breakdown */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Usage Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {usageData.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
