import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ToolsPage from "./pages/ToolsPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ImageTools from "./pages/tools/ImageTools";
import PdfTools from "./pages/tools/PdfTools";
import TextTools from "./pages/tools/TextTools";
import VideoAudioTools from "./pages/tools/VideoAudioTools";
import GeneralTools from "./pages/tools/GeneralTools";
import Calculators from "./pages/tools/Calculators";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading account" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/pdf" element={<ToolsPage />} />
            <Route path="/tools/image" element={<ToolsPage />} />
            <Route path="/tools/video" element={<ToolsPage />} />
            <Route path="/tools/audio" element={<ToolsPage />} />
            <Route path="/tools/text" element={<ToolsPage />} />
            <Route path="/tools/general" element={<ToolsPage />} />
            <Route path="/tools/calculator" element={<ToolsPage />} />
            <Route path="/tools/image/:toolId" element={<ImageTools />} />
            <Route path="/tools/pdf/:toolId" element={<PdfTools />} />
            <Route path="/tools/text/:toolId" element={<TextTools />} />
            <Route path="/tools/video/:toolId" element={<VideoAudioTools />} />
            <Route path="/tools/audio/:toolId" element={<VideoAudioTools />} />
            <Route path="/tools/general/:toolId" element={<GeneralTools />} />
            <Route path="/tools/calculator/:toolId" element={<Calculators />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/products/:productSlug" element={<ProductDetailPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard/*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
