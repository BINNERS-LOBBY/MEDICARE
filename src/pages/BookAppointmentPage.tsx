import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { DOCTORS, TIME_SLOTS } from "@/data/doctors";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, Clock, Star, Video, MapPin, ArrowLeft } from "lucide-react";

export default function BookAppointmentPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const { addAppointment } = useAppointments();
  const navigate = useNavigate();

  const doctor = DOCTORS.find((d) => d.id === doctorId);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [type, setType] = useState<"in-person" | "telemedicine">("telemedicine");

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="py-20 text-center text-muted-foreground">Doctor not found</div>
      </div>
    );
  }

  const canBook = date && time;

  const handleBook = () => {
    if (!date || !time || !user) return;
    const appt = {
      id: `a-${Date.now()}`,
      patientId: user.id,
      patientName: user.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      date: format(date, "yyyy-MM-dd"),
      time,
      status: "upcoming" as const,
      type,
    };
    addAppointment(appt);
    navigate("/appointment-confirmed", { state: appt });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Button variant="ghost" size="sm" className="mb-4 gap-1 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Book Appointment</h1>

        {/* Doctor info */}
        <Card className="mb-6 shadow-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full gradient-medical text-lg font-bold text-primary-foreground">
              {doctor.avatar}
            </div>
            <div>
              <h2 className="font-display font-semibold text-foreground">{doctor.name}</h2>
              <p className="text-sm text-primary">{doctor.specialization}</p>
              <div className="mt-1 flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="font-medium">{doctor.rating}</span>
                <span className="text-muted-foreground">· {doctor.experience} years experience</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Date picker */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <CalendarDays className="h-5 w-5 text-primary" /> Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date()}
                className="pointer-events-auto rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Time & type */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-base">
                  <Clock className="h-5 w-5 text-primary" /> Select Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                        time === slot
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visit type */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-base">Visit Type</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <button
                  onClick={() => setType("telemedicine")}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                    type === "telemedicine"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <Video className={cn("h-6 w-6", type === "telemedicine" ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm font-medium">Video Call</span>
                </button>
                <button
                  onClick={() => setType("in-person")}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                    type === "in-person"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <MapPin className={cn("h-6 w-6", type === "in-person" ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm font-medium">In-Person</span>
                </button>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" disabled={!canBook} onClick={handleBook}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
