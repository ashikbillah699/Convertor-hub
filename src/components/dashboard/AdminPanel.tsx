import { useState } from "react";
import { Shield, Users, Activity, Database, Server, AlertTriangle, CheckCircle, Ban, UserCog, Eye, Trash2, Search, ChevronDown, Package, Code, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "User" | "Admin" | "Developer";
  status: "Active" | "Inactive" | "Banned";
  joinDate: string;
  lastActive: string;
  toolsUsed: number;
  storageUsed: string;
}

interface DevActivity {
  id: number;
  developer: string;
  action: string;
  target: string;
  type: "product" | "tool" | "api" | "deploy" | "config";
  timestamp: string;
  status: "success" | "failed" | "pending";
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [allUsers, setAllUsers] = useState<UserData[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Active", joinDate: "2024-01-15", lastActive: "2 min ago", toolsUsed: 45, storageUsed: "120 MB" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active", joinDate: "2023-11-20", lastActive: "Online", toolsUsed: 230, storageUsed: "2.1 GB" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Developer", status: "Inactive", joinDate: "2024-02-10", lastActive: "3 days ago", toolsUsed: 180, storageUsed: "890 MB" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User", status: "Active", joinDate: "2024-03-05", lastActive: "1 hour ago", toolsUsed: 22, storageUsed: "45 MB" },
    { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "User", status: "Active", joinDate: "2024-01-28", lastActive: "5 min ago", toolsUsed: 67, storageUsed: "340 MB" },
    { id: 6, name: "Dev Rakib", email: "rakib@example.com", role: "Developer", status: "Active", joinDate: "2023-12-01", lastActive: "Online", toolsUsed: 320, storageUsed: "4.5 GB" },
    { id: 7, name: "Sarah Lee", email: "sarah@example.com", role: "User", status: "Banned", joinDate: "2024-02-20", lastActive: "N/A", toolsUsed: 5, storageUsed: "10 MB" },
    { id: 8, name: "Dev Tanvir", email: "tanvir@example.com", role: "Developer", status: "Active", joinDate: "2024-01-10", lastActive: "30 min ago", toolsUsed: 275, storageUsed: "3.2 GB" },
  ]);

  const devActivities: DevActivity[] = [
    { id: 1, developer: "Dev Rakib", action: "Added new product", target: "PDF Merger Pro", type: "product", timestamp: "10 min ago", status: "success" },
    { id: 2, developer: "Dev Tanvir", action: "Updated tool", target: "Image Compressor v2.1", type: "tool", timestamp: "25 min ago", status: "success" },
    { id: 3, developer: "Bob Wilson", action: "Created API endpoint", target: "/api/v2/batch-convert", type: "api", timestamp: "1 hour ago", status: "success" },
    { id: 4, developer: "Dev Rakib", action: "Deployed update", target: "Video Converter", type: "deploy", timestamp: "2 hours ago", status: "success" },
    { id: 5, developer: "Dev Tanvir", action: "Added new product", target: "Audio Extractor", type: "product", timestamp: "3 hours ago", status: "success" },
    { id: 6, developer: "Bob Wilson", action: "Config change", target: "Rate limiting updated", type: "config", timestamp: "5 hours ago", status: "pending" },
    { id: 7, developer: "Dev Rakib", action: "Added new product", target: "Text Summarizer AI", type: "product", timestamp: "1 day ago", status: "success" },
    { id: 8, developer: "Dev Tanvir", action: "Deleted tool", target: "Legacy Converter", type: "tool", timestamp: "1 day ago", status: "success" },
    { id: 9, developer: "Dev Rakib", action: "Updated API docs", target: "v2 Documentation", type: "api", timestamp: "2 days ago", status: "success" },
    { id: 10, developer: "Bob Wilson", action: "Added new product", target: "Batch Resizer", type: "product", timestamp: "3 days ago", status: "failed" },
  ];

  const systemStats = [
    { label: "Total Users", value: allUsers.filter(u => u.role === "User").length.toString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Developers", value: allUsers.filter(u => u.role === "Developer").length.toString(), icon: Code, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Products Added", value: devActivities.filter(a => a.type === "product").length.toString(), icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Active Sessions", value: "89", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  const systemHealth = [
    { name: "API Server", status: "healthy", uptime: "99.9%" },
    { name: "Database", status: "healthy", uptime: "99.8%" },
    { name: "File Storage", status: "warning", uptime: "98.5%" },
    { name: "CDN", status: "healthy", uptime: "99.99%" },
  ];

  const filteredUsers = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const changeRole = (userId: number, newRole: "User" | "Admin" | "Developer") => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast({ title: "Role Updated", description: `User role changed to ${newRole}` });
  };

  const toggleStatus = (userId: number) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const newStatus = u.status === "Active" ? "Inactive" : "Active";
      return { ...u, status: newStatus };
    }));
    toast({ title: "Status Updated" });
  };

  const banUser = (userId: number) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === "Banned" ? "Active" : "Banned" as const } : u));
    toast({ title: "User status updated", variant: "destructive" });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "product": return <Package className="h-4 w-4 text-primary" />;
      case "tool": return <Code className="h-4 w-4 text-green-500" />;
      case "api": return <Server className="h-4 w-4 text-blue-500" />;
      case "deploy": return <Activity className="h-4 w-4 text-amber-500" />;
      case "config": return <UserCog className="h-4 w-4 text-muted-foreground" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const devSummary = allUsers.filter(u => u.role === "Developer").map(dev => ({
    ...dev,
    productsAdded: devActivities.filter(a => a.developer === dev.name && a.type === "product").length,
    totalActions: devActivities.filter(a => a.developer === dev.name).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Full control over users, developers, and system</p>
      </div>

      {/* System Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${stat.bg} shrink-0`}>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex">
          <TabsTrigger value="users" className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="developers" className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm">
            <Code className="h-4 w-4" /> Developers
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm">
            <History className="h-4 w-4" /> Activity Log
          </TabsTrigger>
          <TabsTrigger value="system" className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm">
            <Server className="h-4 w-4" /> System
          </TabsTrigger>
        </TabsList>

        {/* Users & Developers Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <div className="flex gap-2">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[120px]"><SelectValue placeholder="Role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile card view */}
              <div className="block sm:hidden space-y-3">
                {filteredUsers.map(u => (
                  <div key={u.id} className="p-3 rounded-lg border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold">{u.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <Badge variant={u.status === "Active" ? "default" : u.status === "Banned" ? "destructive" : "secondary"} className="text-xs">{u.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{u.role}</Badge>
                      <div className="flex gap-1">
                        <Select value={u.role} onValueChange={(val) => changeRole(u.id, val as any)}>
                          <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="User">User</SelectItem>
                            <SelectItem value="Developer">Developer</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus(u.id)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => banUser(u.id)}>
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop table view */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Last Active</TableHead>
                      <TableHead className="hidden lg:table-cell">Tools Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(u => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold shrink-0">{u.name.charAt(0)}</div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{u.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={u.role} onValueChange={(val) => changeRole(u.id, val as any)}>
                            <SelectTrigger className="h-8 text-xs w-[110px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="User">User</SelectItem>
                              <SelectItem value="Developer">Developer</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.status === "Active" ? "default" : u.status === "Banned" ? "destructive" : "secondary"} className="text-xs">
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{u.lastActive}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{u.toolsUsed}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedUser(u)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus(u.id)}>
                              <UserCog className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => banUser(u.id)}>
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Developer Summary Tab */}
        <TabsContent value="developers" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {devSummary.map(dev => (
              <Card key={dev.id} className="border-border">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">{dev.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{dev.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{dev.email}</p>
                    </div>
                    <Badge variant={dev.status === "Active" ? "default" : "secondary"} className="text-xs shrink-0">{dev.status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-secondary">
                      <p className="text-lg font-bold">{dev.productsAdded}</p>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary">
                      <p className="text-lg font-bold">{dev.totalActions}</p>
                      <p className="text-xs text-muted-foreground">Actions</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary">
                      <p className="text-lg font-bold">{dev.toolsUsed}</p>
                      <p className="text-xs text-muted-foreground">Tools</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Storage: {dev.storageUsed}</span>
                    <span>Last: {dev.lastActive}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => changeRole(dev.id, "User")}>Demote</Button>
                    <Button variant="destructive" size="sm" className="flex-1 text-xs" onClick={() => banUser(dev.id)}>
                      {dev.status === "Banned" ? "Unban" : "Ban"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Developer Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {devActivities.map(activity => (
                  <div key={activity.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/50 rounded-lg px-2 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        <span className="text-primary">{activity.developer}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.target} · {activity.timestamp}</p>
                    </div>
                    <Badge
                      variant={activity.status === "success" ? "default" : activity.status === "failed" ? "destructive" : "secondary"}
                      className="text-xs shrink-0"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth.map((service, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {service.status === "healthy" ? (
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{service.name}</span>
                          <span className="text-muted-foreground">{service.uptime}</span>
                        </div>
                        <Progress value={parseFloat(service.uptime)} className="h-1.5 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Storage Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Used</span>
                  <span className="font-medium">45 GB / 100 GB</span>
                </div>
                <Progress value={45} className="h-2" />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-secondary text-center">
                    <p className="text-lg font-bold">1,247</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary text-center">
                    <p className="text-lg font-bold">12,450</p>
                    <p className="text-xs text-muted-foreground">Files Processed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-muted-foreground text-xs">Role</p>
                  <p className="font-medium">{selectedUser.role}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-medium">{selectedUser.status}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-muted-foreground text-xs">Joined</p>
                  <p className="font-medium">{selectedUser.joinDate}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-muted-foreground text-xs">Tools Used</p>
                  <p className="font-medium">{selectedUser.toolsUsed}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary col-span-2">
                  <p className="text-muted-foreground text-xs">Storage Used</p>
                  <p className="font-medium">{selectedUser.storageUsed}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
              <Button variant="destructive" onClick={() => { banUser(selectedUser.id); setSelectedUser(null); }}>
                {selectedUser.status === "Banned" ? "Unban" : "Ban User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPanel;
