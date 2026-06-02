import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sindico from "./pages/Sindico";
import Morador from "./pages/Morador";
import Fornecedor from "./pages/Fornecedor";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import EscolherUnidade from "./pages/EscolhaCondominio";
import Register from "./pages/Register";
import TwoFactorVerify from "./pages/TwoFactorVerify";
import TwoFactorSetup from "./pages/TwoFactorSetup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyData from "./pages/MyData";
import DownloadData from "./pages/DownloadData";
import LgpdConsent from "./pages/LgpdConsent";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sindico" element={<Sindico />} />
            <Route path="/morador" element={<Morador />} />
            <Route path="/fornecedor" element={<Fornecedor />} />
            <Route path="/escolherUnidade" element={<EscolherUnidade />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/2fa-verify" element={<TwoFactorVerify />} />
            <Route path="/2fa-setup" element={<TwoFactorSetup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/my-data" element={<MyData />} />
            <Route path="/download-data" element={<DownloadData />} />
            <Route path="/lgpd-consent" element={<LgpdConsent />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
