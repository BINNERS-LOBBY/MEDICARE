import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { AppHeader } from "@/components/AppHeader";
import { AnimatedCard } from "@/components/AnimatedCard";
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
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">Here's an overview of your health journey</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Calendar, value: upcoming.length, label: "Upcoming", color: "bg-primary/10 text-primary", delay: 0 },
            { icon: Activity, value: completed.length, label: "Completed", color: "bg-success/10 text-success", delay: 80 },
            { icon: FileText, value: myAppointments.length, label: "Total Visits", color: "bg-accent/10 text-accent", delay: 160 },
          ].map((stat) => (
            <AnimatedCard key={stat.label} delay={stat.delay}>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color.split(" ")[0]}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.split(" ")[1]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mb-8 flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          <Button onClick={() => navigate("/doctors")} className="gap-2 hover-scale">
            <Search className="h-4 w-4" /> Find a Doctor
          </Button>
        </div>

        {/* Upcoming appointments */}
        <AnimatedCard delay={300} hover={false}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <div className="py-8 text-center animate-fade-in">
                  <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                  <Button variant="outline" size="sm" className="mt-3 hover-scale" onClick={() => navigate("/doctors")}>
                    Book Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((appt, i) => (
                    <div
                      key={appt.id}
                      className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between animate-stagger-fade"
                      style={{ animationDelay: `${400 + i * 80}ms`, animationFillMode: "both" }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm transition-transform duration-200 hover:scale-110">
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
                          <Button size="sm" variant="outline" className="gap-1 hover-scale" onClick={() => navigate("/video-call")}>
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
        </AnimatedCard>
      </main>
    </div>
  );
}
