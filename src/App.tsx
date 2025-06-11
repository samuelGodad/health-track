
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BloodTests from "./pages/BloodTests";
import Analytics from "./pages/Analytics";
import Trends from "./pages/Trends";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import AuthWrapper from "./components/AuthWrapper";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            
            <Route 
              path="/onboarding" 
              element={<AuthWrapper><Onboarding /></AuthWrapper>} 
            />
            <Route 
              path="/dashboard" 
              element={<AuthWrapper><Dashboard /></AuthWrapper>} 
            />
            <Route 
              path="/blood-tests" 
              element={<AuthWrapper><BloodTests /></AuthWrapper>} 
            />
            <Route 
              path="/analytics" 
              element={<AuthWrapper><Analytics /></AuthWrapper>} 
            />
            <Route 
              path="/trends" 
              element={<AuthWrapper><Trends /></AuthWrapper>} 
            />
            
            {/* Redirect old routes to dashboard */}
            <Route path="/cycle-planner" element={<Navigate to="/dashboard" replace />} />
            <Route path="/injection-assistant" element={<Navigate to="/dashboard" replace />} />
            <Route path="/daily-metrics" element={<Navigate to="/dashboard" replace />} />
            <Route path="/body-progress" element={<Navigate to="/dashboard" replace />} />
            <Route path="/supplements" element={<Navigate to="/dashboard" replace />} />
            <Route path="/targets" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
