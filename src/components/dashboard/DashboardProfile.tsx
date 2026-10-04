import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const DashboardProfile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Placeholder: replace with your backend call
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user?.display_name || "User"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email || "Guest"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/50">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user?.email || "Not available"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/50">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Free Plan</span>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="mt-2">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;
