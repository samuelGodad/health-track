
import React from "react";
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

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Convert to a function component
function App() {
  return (
    <React.StrictMode>
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
              
              {/* Protected routes with AuthWrapper */}
              <Route 
                path="/onboarding" 
                element={<AuthWrapper><Onboarding /></AuthWrapper>} 
              />
              <Route 
                path="/dashboard" 
                element={<AuthWrapper><Index /></AuthWrapper>} 
              />
              <Route 
                path="/blood-tests" 
                element={<AuthWrapper><BloodTests /></AuthWrapper>} 
              />
              <Route 
                path="/daily-metrics" 
                element={<AuthWrapper><DailyMetrics /></AuthWrapper>} 
              />
              <Route 
                path="/body-progress" 
                element={<AuthWrapper><BodyProgress /></AuthWrapper>} 
              />
              <Route 
                path="/supplements" 
                element={<AuthWrapper><Supplements /></AuthWrapper>} 
              />
              <Route 
                path="/targets" 
                element={<AuthWrapper><Targets /></AuthWrapper>} 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
