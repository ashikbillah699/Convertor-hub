import { useState } from "react";
import { Check, Zap, Crown, Building2, Download, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Zap,
    features: ["10 tools/day", "Basic file size (10 MB)", "Community support", "Ads shown"],
    color: "border-border",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    period: "/month",
    icon: Crown,
    features: ["Unlimited tools", "Large files (500 MB)", "Priority support", "No ads", "API access"],
    color: "border-primary shadow-lg",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$49",
    period: "/month",
    icon: Building2,
    features: ["Everything in Pro", "Unlimited file size", "Dedicated support", "Team collaboration", "Custom integrations", "SLA guarantee"],
    color: "border-border",
  },
];

const invoices = [
  { id: "INV-0128", date: "2026-07-01", amount: "$9.00", status: "Paid" },
  { id: "INV-0119", date: "2026-06-01", amount: "$9.00", status: "Paid" },
  { id: "INV-0104", date: "2026-05-01", amount: "$9.00", status: "Paid" },
  { id: "INV-0091", date: "2026-04-01", amount: "$9.00", status: "Paid" },
];

const DashboardSubscription = () => {
  const [current, setCurrent] = useState("free");

  const handleUpgrade = (id: string) => {
    setCurrent(id);
    toast.success(`Switched to ${plans.find((p) => p.id === id)?.name} plan (demo)`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription & Billing</h1>
        <p className="text-muted-foreground">Manage your plan and payment history</p>
      </div>

      <Card className="border-border bg-primary/5">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-xl font-bold flex items-center gap-2">
              {plans.find((p) => p.id === current)?.name}
              <Badge variant="outline" className="text-xs">Active</Badge>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Next billing</p>
            <p className="font-medium">{current === "free" ? "—" : "Aug 1, 2026"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={cn("border-2 transition-all relative", plan.color)}>
            {plan.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold gradient-primary text-primary-foreground">
                Most Popular
              </span>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <plan.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={current === plan.id ? "outline" : plan.popular ? "gradient" : "outline"}
                className="w-full"
                disabled={current === plan.id}
                onClick={() => handleUpgrade(plan.id)}
              >
                {current === plan.id ? "Current Plan" : plan.id === "free" ? "Downgrade" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/50 rounded-lg px-2 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{inv.id}</p>
                  <p className="text-xs text-muted-foreground">{inv.date}</p>
                </div>
                <span className="text-sm font-medium">{inv.amount}</span>
                <Badge variant="secondary" className="text-xs">{inv.status}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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

export default DashboardSubscription;
