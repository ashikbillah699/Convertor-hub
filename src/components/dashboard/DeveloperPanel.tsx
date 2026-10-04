import { Code, Terminal, Key, Webhook, FileJson, Copy, ExternalLink, Package, History, Plus, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const DeveloperPanel = () => {
  const { toast } = useToast();

  const myProducts = [
    { name: "PDF Merger Pro", status: "Published", downloads: 1240, created: "2024-01-15", category: "PDF Tools" },
    { name: "Image Compressor v2", status: "Published", downloads: 890, created: "2024-02-10", category: "Image Tools" },
    { name: "Audio Extractor", status: "Draft", downloads: 0, created: "2024-03-20", category: "Audio Tools" },
    { name: "Text Summarizer AI", status: "Published", downloads: 2100, created: "2024-01-05", category: "Text Tools" },
    { name: "Batch Resizer", status: "Under Review", downloads: 0, created: "2024-03-28", category: "Image Tools" },
  ];

  const activityHistory = [
    { action: "Added new product", target: "PDF Merger Pro", time: "10 min ago", type: "product" },
    { action: "Updated tool settings", target: "Image Compressor v2", time: "2 hours ago", type: "update" },
    { action: "Deployed to production", target: "Text Summarizer AI", time: "5 hours ago", type: "deploy" },
    { action: "Created API endpoint", target: "/api/v2/summarize", time: "1 day ago", type: "api" },
    { action: "Added new product", target: "Audio Extractor", time: "2 days ago", type: "product" },
    { action: "Updated documentation", target: "API v2 Docs", time: "3 days ago", type: "docs" },
    { action: "Fixed bug", target: "PDF Merger - merge order", time: "4 days ago", type: "fix" },
    { action: "Added new product", target: "Batch Resizer", time: "5 days ago", type: "product" },
    { action: "Config change", target: "Rate limiting to 100/min", time: "1 week ago", type: "config" },
    { action: "Deployed to production", target: "Image Compressor v2.1", time: "1 week ago", type: "deploy" },
  ];

  const stats = [
    { label: "Products", value: myProducts.length.toString(), color: "text-primary", bg: "bg-primary/10" },
    { label: "Published", value: myProducts.filter(p => p.status === "Published").length.toString(), color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Downloads", value: myProducts.reduce((a, p) => a + p.downloads, 0).toLocaleString(), color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Actions", value: activityHistory.length.toString(), color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  const apiEndpoints = [
    { method: "GET", path: "/api/v1/tools", desc: "List all tools", status: "stable" },
    { method: "POST", path: "/api/v1/convert", desc: "Convert a file", status: "stable" },
    { method: "GET", path: "/api/v1/history", desc: "Get user history", status: "beta" },
    { method: "POST", path: "/api/v1/batch", desc: "Batch processing", status: "beta" },
    { method: "DELETE", path: "/api/v1/files/:id", desc: "Delete a file", status: "stable" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Developer Panel</h1>
        <p className="text-muted-foreground">Manage products, API access, and view activity</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex">
          <TabsTrigger value="products" className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm">
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm">
            <History className="h-4 w-4" /> History
          </TabsTrigger>
          <TabsTrigger value="api" className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm">
            <Terminal className="h-4 w-4" /> API
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  My Products
                </CardTitle>
                <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myProducts.map((product, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category} · {product.created}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{product.downloads.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">downloads</p>
                    </div>
                    <Badge
                      variant={product.status === "Published" ? "default" : product.status === "Draft" ? "secondary" : "outline"}
                      className="text-xs shrink-0"
                    >
                      {product.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Activity History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {activityHistory.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/50 rounded-lg px-2 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary shrink-0">
                      {item.type === "product" ? <Package className="h-4 w-4 text-primary" /> :
                       item.type === "deploy" ? <BarChart3 className="h-4 w-4 text-green-500" /> :
                       item.type === "api" ? <Terminal className="h-4 w-4 text-blue-500" /> :
                       <Code className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.target} · {item.time}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">{item.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Public Key</Label>
                <div className="flex gap-2">
                  <Input value="pk_live_xxxxxxxxxxxxxxxxxxxx" readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard("pk_live_xxxxxxxxxxxxxxxxxxxx")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secret Key</Label>
                <div className="flex gap-2">
                  <Input value="sk_live_••••••••••••••••••••" readOnly className="font-mono text-sm" type="password" />
                  <Button variant="outline" size="icon"><Copy className="h-4 w-4" /></Button>
                </div>
              </div>
              <Button variant="destructive" size="sm">Regenerate Keys</Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {apiEndpoints.map((endpoint, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2 sm:gap-3 py-2.5 border-b border-border last:border-0">
                    <Badge variant={endpoint.method === "GET" ? "secondary" : endpoint.method === "DELETE" ? "destructive" : "default"} className="font-mono text-xs w-16 justify-center">
                      {endpoint.method}
                    </Badge>
                    <code className="text-xs sm:text-sm font-mono flex-1 min-w-0 text-muted-foreground break-all">{endpoint.path}</code>
                    <span className="text-xs text-muted-foreground hidden md:block">{endpoint.desc}</span>
                    <Badge variant={endpoint.status === "stable" ? "secondary" : "outline"} className="text-xs">{endpoint.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileJson className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">API Documentation</h3>
                  <p className="text-sm text-muted-foreground">Full reference for all endpoints and SDKs</p>
                </div>
                <Button variant="outline" className="gap-2">
                  View Docs <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperPanel;
