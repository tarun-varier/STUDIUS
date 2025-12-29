"use client";

import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  type?: "default" | "error" | "success" | "info";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  type = "default",
}: EmptyStateProps) {
  const icons = {
    default: Info,
    error: XCircle,
    success: CheckCircle2,
    info: AlertCircle,
  };

  const colors = {
    default: "text-muted-foreground",
    error: "text-destructive",
    success: "text-green-500",
    info: "text-blue-500",
  };

  const Icon = icon ? () => <>{icon}</> : icons[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-4",
          type === "error" && "bg-destructive/10",
          type === "success" && "bg-green-500/10",
          type === "info" && "bg-blue-500/10",
          type === "default" && "bg-muted"
        )}
      >
        <Icon className={cn("h-8 w-8", colors[type])} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
