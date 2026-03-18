import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = "md", text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        <Loader2 className={cn("animate-spin-slow text-primary", sizeClasses[size])} />
        <div className={cn("absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-ring", sizeClasses[size])} />
      </div>
      {text && <p className="text-sm font-medium text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
}
