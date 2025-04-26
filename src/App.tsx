import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CyclePlanner from "./pages/CyclePlanner"; 
import BloodTests from "./pages/BloodTests";
import InjectionAssistant from "./pages/InjectionAssistant";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import AuthWrapper from "./components/AuthWrapper";
import { CycleProvider } from "./contexts/CycleContext";

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CycleProvider>
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
                  path="/cycle-planner" 
                  element={<AuthWrapper><CyclePlanner /></AuthWrapper>} 
                />
                <Route 
                  path="/injection-assistant" 
                  element={<AuthWrapper><InjectionAssistant /></AuthWrapper>} 
                />
                <Route 
                  path="/blood-tests" 
                  element={<AuthWrapper><BloodTests /></AuthWrapper>} 
                />
                
                <Route path="/dashboard" element={<Navigate to="/cycle-planner" replace />} />
                
                <Route path="/daily-metrics" element={<Navigate to="/cycle-planner" replace />} />
                <Route path="/body-progress" element={<Navigate to="/cycle-planner" replace />} />
                <Route path="/supplements" element={<Navigate to="/cycle-planner" replace />} />
                <Route path="/targets" element={<Navigate to="/cycle-planner" replace />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CycleProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
