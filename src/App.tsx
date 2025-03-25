
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BloodTests from "./pages/BloodTests";
import DailyMetrics from "./pages/DailyMetrics";
import BodyProgress from "./pages/BodyProgress";
import Supplements from "./pages/Supplements";
import Targets from "./pages/Targets";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import AuthWrapper from "./components/AuthWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Protected routes (will add AuthWrapper later) */}
          <Route path="/dashboard" element={<Index />} />
          <Route path="/blood-tests" element={<BloodTests />} />
          <Route path="/daily-metrics" element={<DailyMetrics />} />
          <Route path="/body-progress" element={<BodyProgress />} />
          <Route path="/supplements" element={<Supplements />} />
          <Route path="/targets" element={<Targets />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
