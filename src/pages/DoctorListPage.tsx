import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { DOCTORS, SPECIALIZATIONS, Doctor } from "@/data/doctors";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Search, Calendar } from "lucide-react";

export default function DoctorListPage() {
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = DOCTORS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = !selectedSpec || d.specialization === selectedSpec;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Find a Doctor</h1>
          <p className="mt-1 text-muted-foreground">Browse our specialists and book your appointment</p>
        </div>

        {/* Search & filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedSpec === null ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedSpec(null)}
            >
              All
            </Badge>
            {SPECIALIZATIONS.map((spec) => (
              <Badge
                key={spec}
                variant={selectedSpec === spec ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedSpec(spec === selectedSpec ? null : spec)}
              >
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        {/* Doctor cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onBook={() => navigate(`/book/${doctor.id}`)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No doctors found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  );
}

function DoctorCard({ doctor, onBook }: { doctor: Doctor; onBook: () => void }) {
  return (
    <Card className="shadow-card transition-shadow hover:shadow-card-hover">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full gradient-medical text-lg font-bold text-primary-foreground">
            {doctor.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-foreground">{doctor.name}</h3>
            <p className="text-sm text-primary">{doctor.specialization}</p>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-sm font-medium text-foreground">{doctor.rating}</span>
              <span className="text-sm text-muted-foreground">· {doctor.experience}yr exp</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {doctor.availability.map((day) => (
            <span key={day} className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {day}
            </span>
          ))}
        </div>
        <Button className="mt-4 w-full gap-2" onClick={onBook}>
          <Calendar className="h-4 w-4" /> Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
}
