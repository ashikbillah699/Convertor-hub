import { Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardProfile from "@/components/dashboard/DashboardProfile";
import DashboardHistory from "@/components/dashboard/DashboardHistory";
import UserPanel from "@/components/dashboard/UserPanel";
import AdminPanel from "@/components/dashboard/AdminPanel";
import DeveloperPanel from "@/components/dashboard/DeveloperPanel";
import DashboardSettings from "@/components/dashboard/DashboardSettings";
import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics";
import DashboardSubscription from "@/components/dashboard/DashboardSubscription";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="analytics" element={<DashboardAnalytics />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="history" element={<DashboardHistory />} />
            <Route path="user" element={<UserPanel />} />
            <Route path="subscription" element={<DashboardSubscription />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="developer" element={<DeveloperPanel />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
