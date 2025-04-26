
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard"; 
import BloodTests from "./pages/BloodTests";
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
                element={<AuthWrapper><Dashboard /></AuthWrapper>} 
              />
              <Route 
                path="/blood-tests" 
                element={<AuthWrapper><BloodTests /></AuthWrapper>} 
              />
              
              {/* Redirect removed routes to dashboard */}
              <Route path="/daily-metrics" element={<Navigate to="/dashboard" replace />} />
              <Route path="/body-progress" element={<Navigate to="/dashboard" replace />} />
              <Route path="/supplements" element={<Navigate to="/dashboard" replace />} />
              <Route path="/targets" element={<Navigate to="/dashboard" replace />} />
              
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
