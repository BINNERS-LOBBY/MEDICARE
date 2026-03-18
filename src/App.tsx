import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorListPage from "./pages/DoctorListPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import AppointmentConfirmedPage from "./pages/AppointmentConfirmedPage";
import VideoCallPage from "./pages/VideoCallPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/patient-dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
      <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><DoctorListPage /></ProtectedRoute>} />
      <Route path="/book/:doctorId" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} />
      <Route path="/appointment-confirmed" element={<ProtectedRoute><AppointmentConfirmedPage /></ProtectedRoute>} />
      <Route path="/video-call" element={<ProtectedRoute><VideoCallPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
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
);

export default App;
