import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, Users, Video, MapPin, CheckCircle } from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const navigate = useNavigate();

  const myAppointments = appointments.filter(
    (a) => a.doctorId === user?.id || user?.id === "d-new"
  );
  const today = myAppointments.filter((a) => a.status === "upcoming");
  const completed = myAppointments.filter((a) => a.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Good morning, {user?.name} 🩺
          </h1>
          <p className="mt-1 text-muted-foreground">Here's your schedule overview</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{today.length}</p>
                <p className="text-sm text-muted-foreground">Today's Patients</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completed.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Video className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {today.filter((a) => a.type === "telemedicine").length}
                </p>
                <p className="text-sm text-muted-foreground">Video Calls</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment list */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {today.length === 0 ? (
              <div className="py-8 text-center">
                <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground">No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {today.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground text-sm">
                        {appt.patientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appt.patientName}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {appt.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {appt.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={appt.type === "telemedicine" ? "default" : "secondary"} className="gap-1 text-xs">
                        {appt.type === "telemedicine" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        {appt.type === "telemedicine" ? "Video" : "In-Person"}
                      </Badge>
                      {appt.type === "telemedicine" && (
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => navigate("/video-call")}>
                          <Video className="h-3.5 w-3.5" /> Start Call
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
