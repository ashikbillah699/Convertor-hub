import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
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
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Navigate to="/admin" replace />} />
          <Route path="/signup" element={<Navigate to="/admin" replace />} />
          <Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
          <Route path="/profile" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
