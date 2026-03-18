import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({ children, className, delay = 0, hover = true }: AnimatedCardProps) {
  return (
    <div
      className={cn(
        "animate-stagger-fade",
        hover && "hover-lift",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}
