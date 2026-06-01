import { LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    icon?: LucideIcon;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    className?: string;
}

export function StatsCard({ title, value, icon: Icon, change, changeType = "neutral", className }: StatsCardProps) {
    return (
        <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                {Icon && <Icon className="h-4 w-4 text-gray-400" />}
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                {change && (
                    <span
                        className={cn(
                            "text-xs font-medium",
                            changeType === "positive" && "text-green-600",
                            changeType === "negative" && "text-red-600",
                            changeType === "neutral" && "text-gray-500"
                        )}
                    >
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}
