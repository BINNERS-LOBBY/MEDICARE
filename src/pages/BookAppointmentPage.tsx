import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { DOCTORS, TIME_SLOTS } from "@/data/doctors";
import { AppHeader } from "@/components/AppHeader";
import { AnimatedCard } from "@/components/AnimatedCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, Clock, Star, Video, MapPin, ArrowLeft, Loader2 } from "lucide-react";

export default function BookAppointmentPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const { addAppointment } = useAppointments();
  const navigate = useNavigate();

  const doctor = DOCTORS.find((d) => d.id === doctorId);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [type, setType] = useState<"in-person" | "telemedicine">("telemedicine");
  const [isBooking, setIsBooking] = useState(false);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="py-20 text-center text-muted-foreground animate-fade-in">Doctor not found</div>
      </div>
    );
  }

  const canBook = date && time && !isBooking;

  const handleBook = async () => {
    if (!date || !time || !user) return;
    setIsBooking(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
    setIsBooking(false);
    navigate("/appointment-confirmed", { state: appt });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Full-screen loading overlay */}
      {isBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center gap-4 animate-scale-in">
            <LoadingSpinner size="lg" />
            <div className="text-center">
              <p className="font-display text-lg font-semibold text-foreground">Booking your appointment...</p>
              <p className="mt-1 text-sm text-muted-foreground">Confirming with {doctor.name}</p>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Button variant="ghost" size="sm" className="mb-4 gap-1 text-muted-foreground hover-scale" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <h1 className="font-display text-2xl font-bold text-foreground mb-6 animate-fade-in">Book Appointment</h1>

        {/* Doctor info */}
        <AnimatedCard delay={50}>
          <Card className="mb-6 shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full gradient-medical text-lg font-bold text-primary-foreground transition-transform duration-200 hover:scale-110">
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
        </AnimatedCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Date picker */}
          <AnimatedCard delay={150}>
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
          </AnimatedCard>

          {/* Time & type */}
          <div className="space-y-6">
            <AnimatedCard delay={250}>
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
                          "rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]",
                          time === slot
                            ? "border-primary bg-primary text-primary-foreground shadow-md"
                            : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Visit type */}
            <AnimatedCard delay={350}>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-base">Visit Type</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <button
                    onClick={() => setType("telemedicine")}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                      type === "telemedicine"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Video className={cn("h-6 w-6 transition-colors duration-200", type === "telemedicine" ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">Video Call</span>
                  </button>
                  <button
                    onClick={() => setType("in-person")}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                      type === "in-person"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <MapPin className={cn("h-6 w-6 transition-colors duration-200", type === "in-person" ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">In-Person</span>
                  </button>
                </CardContent>
              </Card>
            </AnimatedCard>

            <div className="animate-stagger-fade" style={{ animationDelay: "450ms", animationFillMode: "both" }}>
              <Button
                className="w-full gap-2 transition-transform duration-150 active:scale-[0.98]"
                size="lg"
                disabled={!canBook}
                onClick={handleBook}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
