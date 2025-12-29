import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon: LucideIcon;
  description?: string;
  color?: string; // class name for text color e.g. "text-violet-500"
  iconBg?: string; // class name for icon background e.g. "bg-violet-100"
  borderColor?: string; // hex color for left border
  className?: string;
  action?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  color,
  iconBg,
  borderColor,
  className,
  action,
}: StatsCardProps) {
  return (
    <Card 
      className={cn("group hover:shadow-lg transition-all duration-300 border-l-4", className)} 
      style={{ borderLeftColor: borderColor }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-full transition-transform duration-300 group-hover:scale-110", iconBg || "bg-secondary")}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex justify-between items-center mt-1">
            {description && (
            <p className="text-xs text-muted-foreground">
                {description}
            </p>
            )}
            {action}
        </div>
      </CardContent>
    </Card>
  );
}
