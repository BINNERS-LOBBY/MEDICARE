import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText, Search, Eye, TestTube, Bone, Pill, Image,
  CalendarDays, Users, ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type ReportType = "blood-test" | "x-ray" | "prescription" | "scan" | "lab" | "other";

interface PatientRecord {
  patientName: string;
  reportName: string;
  type: ReportType;
  date: string;
  fileType: "pdf" | "image";
}

const TYPE_META: Record<ReportType, { label: string; icon: typeof FileText; color: string }> = {
  "blood-test": { label: "Blood Test", icon: TestTube, color: "bg-destructive/10 text-destructive" },
  "x-ray": { label: "X-Ray", icon: Bone, color: "bg-primary/10 text-primary" },
  "prescription": { label: "Prescription", icon: Pill, color: "bg-success/10 text-success" },
  "scan": { label: "CT / MRI Scan", icon: Image, color: "bg-accent/10 text-accent" },
  "lab": { label: "Lab Report", icon: TestTube, color: "bg-warning/10 text-warning" },
  "other": { label: "Other", icon: FileText, color: "bg-muted text-muted-foreground" },
};

const DUMMY: PatientRecord[] = [
  { patientName: "Sarah Johnson", reportName: "Complete Blood Count (CBC)", type: "blood-test", date: "2026-03-10", fileType: "pdf" },
  { patientName: "Sarah Johnson", reportName: "Chest X-Ray – Front View", type: "x-ray", date: "2026-02-22", fileType: "image" },
  { patientName: "Michael Chen", reportName: "Lipid Panel Results", type: "lab", date: "2026-01-18", fileType: "pdf" },
  { patientName: "Emily Davis", reportName: "Brain MRI Scan Report", type: "scan", date: "2026-01-30", fileType: "pdf" },
  { patientName: "Michael Chen", reportName: "Amoxicillin Prescription", type: "prescription", date: "2026-02-15", fileType: "pdf" },
  { patientName: "Emily Davis", reportName: "Knee X-Ray – Left", type: "x-ray", date: "2025-11-20", fileType: "image" },
];

export default function PatientRecordsViewPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = DUMMY.filter(
    (r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.reportName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3 animate-fade-in">
          <Button variant="ghost" size="icon" onClick={() => navigate("/doctor-dashboard")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Patient Records
            </h1>
            <p className="mt-0.5 text-muted-foreground">View health records uploaded by your patients</p>
          </div>
        </div>

        {/* Search */}
        <AnimatedCard delay={80} hover={false}>
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by patient or report name…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </AnimatedCard>

        {/* Records table-style cards */}
        <div className="space-y-3">
          {filtered.map((rec, i) => {
            const meta = TYPE_META[rec.type];
            const Icon = meta.icon;
            return (
              <AnimatedCard key={`${rec.patientName}-${rec.reportName}`} delay={160 + i * 60}>
                <Card className="shadow-card">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.color.split(" ")[0]}`}>
                        <Icon className={`h-5 w-5 ${meta.color.split(" ")[1]}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{rec.reportName}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {rec.patientName}</span>
                          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {new Date(rec.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{rec.fileType}</Badge>
                      <Button size="sm" variant="outline" className="gap-1.5 hover-scale">
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            );
          })}
          {filtered.length === 0 && (
            <AnimatedCard delay={160}>
              <Card className="shadow-card">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-muted-foreground">No records found</p>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}
        </div>
      </main>
    </div>
  );
}
