
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Daily from "./pages/Daily";
import Weekly from "./pages/Weekly";
import BloodTests from "./pages/BloodTests";
import Analytics from "./pages/Analytics";
import Trends from "./pages/Trends";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthWrapper from "./components/AuthWrapper";
import CyclePlanner from "./pages/CyclePlanner";
import { DashboardLayout } from "@/components/DashboardLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Removed onboarding route */}
            <Route 
              path="/dashboard" 
              element={<AuthWrapper><DashboardLayout><Dashboard /></DashboardLayout></AuthWrapper>} 
            />
            <Route 
              path="/daily" 
              element={<AuthWrapper><DashboardLayout><Daily /></DashboardLayout></AuthWrapper>} 
            />
            <Route 
              path="/weekly" 
              element={<AuthWrapper><DashboardLayout><Weekly /></DashboardLayout></AuthWrapper>} 
            />
            <Route 
              path="/blood-tests" 
              element={<AuthWrapper><DashboardLayout><BloodTests /></DashboardLayout></AuthWrapper>} 
            />
            <Route 
              path="/analytics" 
              element={<AuthWrapper><DashboardLayout><Analytics /></DashboardLayout></AuthWrapper>} 
            />
            <Route 
              path="/trends" 
              element={<AuthWrapper><DashboardLayout><Trends /></DashboardLayout></AuthWrapper>} 
            />
            <Route 
              path="/profile" 
              element={<AuthWrapper><DashboardLayout><Profile /></DashboardLayout></AuthWrapper>} 
            />
            <Route 
              path="/settings" 
              element={<AuthWrapper><DashboardLayout><Settings /></DashboardLayout></AuthWrapper>} 
            />

            {/* Cycle Planner page displays the actual planner UI */}
            <Route
              path="/cycle-planner"
              element={<AuthWrapper><DashboardLayout><CyclePlanner /></DashboardLayout></AuthWrapper>}
            />

            {/* Redirects for legacy/old routes */}
            <Route path="/injection-assistant" element={<Navigate to="/dashboard" replace />} />
            <Route path="/daily-metrics" element={<Navigate to="/daily" replace />} />
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
