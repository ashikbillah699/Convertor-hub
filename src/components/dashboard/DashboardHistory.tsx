import { FileText, Image, Video, Type, Download, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const historyItems = [
  { action: "Converted PDF to Word", time: "2 minutes ago", tool: "PDF Tools", icon: FileText, size: "2.4 MB" },
  { action: "Resized image to 1920x1080", time: "15 minutes ago", tool: "Image Tools", icon: Image, size: "1.1 MB" },
  { action: "Compressed video file", time: "1 hour ago", tool: "Video Tools", icon: Video, size: "45 MB" },
  { action: "Merged 3 PDF files", time: "3 hours ago", tool: "PDF Tools", icon: FileText, size: "8.2 MB" },
  { action: "Converted text case", time: "5 hours ago", tool: "Text Tools", icon: Type, size: "12 KB" },
  { action: "Converted PNG to JPG", time: "1 day ago", tool: "Image Tools", icon: Image, size: "3.5 MB" },
  { action: "Extracted audio from video", time: "2 days ago", tool: "Video Tools", icon: Video, size: "15 MB" },
  { action: "Split PDF into pages", time: "3 days ago", tool: "PDF Tools", icon: FileText, size: "4.8 MB" },
];

const DashboardHistory = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground">Your recent tool usage and file conversions</p>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            All Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {historyItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/50 rounded-lg px-2 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time} · {item.size}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground shrink-0">
                  {item.tool}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHistory;
