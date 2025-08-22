import "./global.css";
import "./lib/errorHandler"; // Global error handling for demo mode
import "./lib/rechartsSuppress"; // Suppress Recharts defaultProps warnings

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CorporateDashboard from "./pages/CorporateDashboard";
import MachineManagement from "./pages/MachineManagement";
import NotFound from "./pages/NotFound";
import { officeNameToPath, isValidOfficePath } from "./lib/officeRouting";
import OfficeOverview from "./pages/OfficeOverview";
import FloatingNavigation, {
  QuickBackFab,
} from "./components/FloatingNavigation";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route
          path="/"
          element={
            user ? (
              user.role === "technician" && user.officeName ? (
                (() => {
                  const officePath = officeNameToPath(user.officeName);
                  console.log("Technician redirect:", {
                    user: user.username,
                    role: user.role,
                    officeName: user.officeName,
                    officePath: officePath,
                    redirectTo: `/office/${officePath}`,
                  });
                  return <Navigate to={`/office/${officePath}`} replace />;
                })()
              ) : user.role === "admin" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/machine" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CorporateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/machine"
          element={
            <ProtectedRoute>
              <MachineManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/office/:officePath"
          element={
            <ProtectedRoute>
              <OfficeOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/machine/:machineId"
          element={
            <ProtectedRoute>
              <MachineManagement />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Add floating navigation for authenticated users */}
      {user && (
        <>
          <FloatingNavigation />
          <QuickBackFab showOnScroll={true} />
        </>
      )}
    </>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

// Handle root creation properly for hot reloads
const rootElement = document.getElementById("root")!;

// Store root in global scope to persist across hot reloads
if (!(window as any).__reactRoot) {
  (window as any).__reactRoot = createRoot(rootElement);
}

(window as any).__reactRoot.render(<App />);
