import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, Clock, Video, MapPin, Search,
  Activity, Calendar, FileText
} from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const navigate = useNavigate();

  const myAppointments = appointments.filter((a) => a.patientId === user?.id || user?.id === "p-new");
  const upcoming = myAppointments.filter((a) => a.status === "upcoming");
  const completed = myAppointments.filter((a) => a.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">Here's an overview of your health journey</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcoming.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Activity className="h-6 w-6 text-success" />
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
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{myAppointments.length}</p>
                <p className="text-sm text-muted-foreground">Total Visits</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button onClick={() => navigate("/doctors")} className="gap-2">
            <Search className="h-4 w-4" /> Find a Doctor
          </Button>
        </div>

        {/* Upcoming appointments */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <div className="py-8 text-center">
                <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground">No upcoming appointments</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/doctors")}>
                  Book Now
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                        {appt.doctorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appt.doctorName}</p>
                        <p className="text-sm text-muted-foreground">{appt.specialization}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                          <Video className="h-3.5 w-3.5" /> Join
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
