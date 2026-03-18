import { useLocation, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CalendarDays, Clock, Video, MapPin, ArrowRight } from "lucide-react";

export default function AppointmentConfirmedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const appt = location.state as any;

  if (!appt) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="py-20 text-center text-muted-foreground animate-fade-in">No appointment data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="text-center animate-scale-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 animate-pulse-ring">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Appointment Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">Your appointment has been successfully booked</p>
        </div>

        <div className="animate-stagger-fade" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          <Card className="mt-8 shadow-card hover-lift">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-medical text-sm font-bold text-primary-foreground transition-transform duration-200 hover:scale-110">
                  {appt.doctorName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{appt.doctorName}</p>
                  <p className="text-sm text-primary">{appt.specialization}</p>
                </div>
              </div>
              <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{appt.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{appt.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {appt.type === "telemedicine" ? (
                    <Video className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-foreground">
                    {appt.type === "telemedicine" ? "Video Consultation" : "In-Person Visit"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row animate-stagger-fade" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
          <Button className="flex-1 gap-2 hover-scale" onClick={() => navigate("/patient-dashboard")}>
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
          {appt.type === "telemedicine" && (
            <Button variant="outline" className="flex-1 gap-2 hover-scale" onClick={() => navigate("/video-call")}>
              <Video className="h-4 w-4" /> Start Video Call
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
