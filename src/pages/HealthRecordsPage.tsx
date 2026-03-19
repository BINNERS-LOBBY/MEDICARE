import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText, Image, Upload, Search, Eye, Download,
  TestTube, Bone, Pill, CalendarDays, Filter, X,
  ClipboardList, Stethoscope, Heart,
} from "lucide-react";

type ReportType = "blood-test" | "x-ray" | "prescription" | "scan" | "lab" | "other";

interface HealthRecord {
  id: string;
  name: string;
  type: ReportType;
  date: string;
  fileType: "pdf" | "image";
  size: string;
  doctor?: string;
  notes?: string;
}

const TYPE_META: Record<ReportType, { label: string; icon: typeof FileText; color: string }> = {
  "blood-test": { label: "Blood Test", icon: TestTube, color: "bg-destructive/10 text-destructive" },
  "x-ray": { label: "X-Ray", icon: Bone, color: "bg-primary/10 text-primary" },
  "prescription": { label: "Prescription", icon: Pill, color: "bg-success/10 text-success" },
  "scan": { label: "CT / MRI Scan", icon: Image, color: "bg-accent/10 text-accent" },
  "lab": { label: "Lab Report", icon: TestTube, color: "bg-warning/10 text-warning" },
  "other": { label: "Other", icon: FileText, color: "bg-muted text-muted-foreground" },
};

const DUMMY_RECORDS: HealthRecord[] = [
  { id: "1", name: "Complete Blood Count (CBC)", type: "blood-test", date: "2026-03-10", fileType: "pdf", size: "1.2 MB", doctor: "Dr. James Wilson", notes: "All values within normal range. Hemoglobin: 14.2 g/dL, WBC: 7,500/μL, Platelets: 250,000/μL." },
  { id: "2", name: "Chest X-Ray – Front View", type: "x-ray", date: "2026-02-22", fileType: "image", size: "3.8 MB", doctor: "Dr. Emily Roberts", notes: "No abnormalities detected. Lungs clear, heart size normal." },
  { id: "3", name: "Amoxicillin Prescription", type: "prescription", date: "2026-02-15", fileType: "pdf", size: "245 KB", doctor: "Dr. James Wilson", notes: "Amoxicillin 500mg, 3x daily for 7 days. For upper respiratory infection." },
  { id: "4", name: "Brain MRI Scan Report", type: "scan", date: "2026-01-30", fileType: "pdf", size: "5.1 MB", doctor: "Dr. Sarah Patel", notes: "No lesions or structural abnormalities noted. Follow-up in 12 months." },
  { id: "5", name: "Lipid Panel Results", type: "lab", date: "2026-01-18", fileType: "pdf", size: "890 KB", doctor: "Dr. James Wilson", notes: "Total cholesterol: 195 mg/dL, LDL: 118 mg/dL, HDL: 55 mg/dL. Borderline – lifestyle changes recommended." },
  { id: "6", name: "Eye Examination Report", type: "other", date: "2025-12-05", fileType: "pdf", size: "1.5 MB", doctor: "Dr. Lisa Chang", notes: "Visual acuity 20/25 both eyes. Minor astigmatism. New prescription provided." },
  { id: "7", name: "Knee X-Ray – Left", type: "x-ray", date: "2025-11-20", fileType: "image", size: "4.2 MB", doctor: "Dr. Mark Torres", notes: "Mild joint space narrowing. No fractures. Physical therapy recommended." },
  { id: "8", name: "Thyroid Function Test", type: "blood-test", date: "2025-10-14", fileType: "pdf", size: "720 KB", doctor: "Dr. James Wilson", notes: "TSH: 2.8 mIU/L (normal). Free T4: 1.1 ng/dL (normal). No action required." },
];

const ALL_TYPES: ReportType[] = ["blood-test", "x-ray", "prescription", "scan", "lab", "other"];

export default function HealthRecordsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ReportType | "all">("all");
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<HealthRecord | null>(null);

  const filtered = DUMMY_RECORDS.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchType = activeFilter === "all" || r.type === activeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Page title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            My Health Records
          </h1>
          <p className="mt-1 text-muted-foreground">Upload, view, and manage your medical reports</p>
        </div>

        {/* Upload area */}
        <AnimatedCard delay={0} hover={false}>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
            className={`mb-8 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
              isDragOver
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border bg-card hover:border-primary/40 hover:bg-primary/[0.02]"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-transform duration-200 hover:scale-110">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Drag & drop files here</p>
              <p className="mt-0.5 text-sm text-muted-foreground">PDF or image files up to 10 MB</p>
            </div>
            <Button variant="outline" className="mt-2 gap-2 hover-scale">
              <Upload className="h-4 w-4" /> Browse Files
            </Button>
          </div>
        </AnimatedCard>

        {/* Search & filters */}
        <AnimatedCard delay={100} hover={false}>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Badge
                variant={activeFilter === "all" ? "default" : "secondary"}
                className="cursor-pointer hover-scale"
                onClick={() => setActiveFilter("all")}
              >
                All
              </Badge>
              {ALL_TYPES.map((t) => (
                <Badge
                  key={t}
                  variant={activeFilter === t ? "default" : "secondary"}
                  className="cursor-pointer gap-1 hover-scale"
                  onClick={() => setActiveFilter(t)}
                >
                  {TYPE_META[t].label}
                </Badge>
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Records list */}
        {filtered.length === 0 ? (
          <AnimatedCard delay={200}>
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-muted-foreground">No records found</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((record, i) => {
              const meta = TYPE_META[record.type];
              const Icon = meta.icon;
              return (
                <AnimatedCard key={record.id} delay={200 + i * 60}>
                  <Card
                    className="shadow-card h-full cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20"
                    onClick={() => setPreviewRecord(record)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.color.split(" ")[0]} transition-transform duration-200 group-hover:scale-110`}>
                          <Icon className={`h-5 w-5 ${meta.color.split(" ")[1]}`} />
                        </div>
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                          {record.fileType}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2 text-sm font-semibold leading-snug">
                        {record.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span>{record.size}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1.5 hover-scale"
                          onClick={(e) => { e.stopPropagation(); setPreviewRecord(record); }}
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1.5 hover-scale"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      <Dialog open={!!previewRecord} onOpenChange={(open) => !open && setPreviewRecord(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden animate-scale-in">
          {previewRecord && (() => {
            const meta = TYPE_META[previewRecord.type];
            const Icon = meta.icon;
            return (
              <>
                {/* Header banner */}
                <div className={`relative px-6 pb-6 pt-8 ${meta.color.split(" ")[0]}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-card/90 shadow-lg animate-scale-in">
                      <Icon className={`h-7 w-7 ${meta.color.split(" ")[1]}`} />
                    </div>
                    <div className="min-w-0 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
                      <DialogTitle className="text-lg font-bold text-foreground leading-snug">
                        {previewRecord.name}
                      </DialogTitle>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                          {meta.label}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                          {previewRecord.fileType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview placeholder */}
                <div className="px-6 animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
                  <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 py-20">
                    {previewRecord.fileType === "image" ? (
                      <div className="text-center">
                        <Image className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">Image preview</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileText className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">PDF document preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 px-6 pb-6 pt-4">
                  <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(previewRecord.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Doctor</p>
                        <p className="text-sm font-medium text-foreground">{previewRecord.doctor || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {previewRecord.notes && (
                    <div className="animate-fade-in" style={{ animationDelay: "250ms", animationFillMode: "both" }}>
                      <div className="flex items-start gap-2 rounded-lg border bg-card p-4">
                        <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Notes</p>
                          <p className="text-sm leading-relaxed text-foreground">{previewRecord.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
                    <Button className="flex-1 gap-2 hover-scale">
                      <Download className="h-4 w-4" /> Download Report
                    </Button>
                    <Button variant="outline" className="hover-scale" onClick={() => setPreviewRecord(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
