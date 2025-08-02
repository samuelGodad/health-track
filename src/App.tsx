
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
import Onboarding from "./pages/Onboarding";
import AuthCallback from "./pages/AuthCallback";
import AuthWrapper from "./components/AuthWrapper";
import CyclePlanner from "./pages/CyclePlanner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CycleProvider } from "@/contexts/CycleContext";

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
            <Route path="/onboarding" element={<AuthWrapper><Onboarding /></AuthWrapper>} />
            <Route path="/auth-callback" element={<AuthCallback />} />

            {/* Wrap authenticated routes with CycleProvider */}
            <Route 
              path="/dashboard" 
              element={
                <AuthWrapper>
                  <CycleProvider>
                    <DashboardLayout><Dashboard /></DashboardLayout>
                  </CycleProvider>
                </AuthWrapper>
              } 
            />
            <Route 
              path="/daily" 
              element={
                <AuthWrapper>
                  <CycleProvider>
                    <DashboardLayout><Daily /></DashboardLayout>
                  </CycleProvider>
                </AuthWrapper>
              } 
            />
            <Route 
              path="/weekly" 
              element={
                <AuthWrapper>
                  <CycleProvider>
                    <DashboardLayout><Weekly /></DashboardLayout>
                  </CycleProvider>
                </AuthWrapper>
              } 
            />
            <Route 
              path="/blood-tests" 
              element={
                <AuthWrapper>
                  <CycleProvider>
                    <DashboardLayout><BloodTests /></DashboardLayout>
                  </CycleProvider>
                </AuthWrapper>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <AuthWrapper>
                  <CycleProvider>
                    <DashboardLayout><Analytics /></DashboardLayout>
                  </CycleProvider>
                </AuthWrapper>
              } 
            />
            <Route 
              path="/trends" 
              element={
                <AuthWrapper>
                  <CycleProvider>
                    <DashboardLayout><Trends /></DashboardLayout>
                  </CycleProvider>
                </AuthWrapper>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <AuthWrapper>
                  <CycleProvider>
                    <DashboardLayout><Profile /></DashboardLayout>
                  </CycleProvider>
                </AuthWrapper>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AuthWrapper>
                  <CycleProvider>
                    <DashboardLayout><Settings /></DashboardLayout>
                  </CycleProvider>
                </AuthWrapper>
              } 
            />

            {/* Cycle Planner page displays the actual planner UI */}
            <Route
              path="/cycle-planner"
              element={
                <AuthWrapper>
                  <CycleProvider>
                    <DashboardLayout><CyclePlanner /></DashboardLayout>
                  </CycleProvider>
                </AuthWrapper>
              }
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
