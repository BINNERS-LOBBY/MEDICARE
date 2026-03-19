import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Heart, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => navigate(user?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard")}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-medical">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">MediCare</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {user?.role === "patient" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/patient-dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/doctors")}>
                Find Doctors
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/health-records")}>
                Health Records
              </Button>
            </>
          )}
          {user?.role === "doctor" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/doctor-dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/patient-records")}>
                Patient Records
              </Button>
            </>
          )}
          <div className="ml-2 flex items-center gap-3 border-l pl-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
            </div>
            <span className="hidden text-sm font-medium lg:block">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </nav>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-card px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {user?.role === "patient" && (
              <>
                <Button variant="ghost" size="sm" className="justify-start" onClick={() => { navigate("/patient-dashboard"); setMobileMenuOpen(false); }}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" className="justify-start" onClick={() => { navigate("/doctors"); setMobileMenuOpen(false); }}>
                  Find Doctors
                </Button>
                <Button variant="ghost" size="sm" className="justify-start" onClick={() => { navigate("/health-records"); setMobileMenuOpen(false); }}>
                  Health Records
                </Button>
              </>
            )}
            {user?.role === "doctor" && (
              <>
                <Button variant="ghost" size="sm" className="justify-start" onClick={() => { navigate("/doctor-dashboard"); setMobileMenuOpen(false); }}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" className="justify-start" onClick={() => { navigate("/patient-records"); setMobileMenuOpen(false); }}>
                  Patient Records
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="justify-start text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
