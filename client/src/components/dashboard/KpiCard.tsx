import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpward } from "@/lib/icons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

type KpiCardProps = {
  title: string;
  value: number;
  unit?: string;
  change?: number;
  trend: "up" | "down" | "none";
  icon: React.ReactNode;
  progressValue?: number;
  chartType?: "sparkline";
  chartData?: number[];
  description: string;
  isLoading?: boolean;
};

export function KpiCard({
  title,
  value,
  unit,
  change,
  trend,
  icon,
  progressValue,
  chartType,
  chartData,
  description,
  isLoading = false,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <Card className="widget-card overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16 mt-2" />
            </div>
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-2 w-full" />
          </div>
          <Skeleton className="h-4 w-36 mt-3" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="widget-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold font-mono text-slate-900">
                {value}
                {unit && <span className="text-sm text-slate-500 ml-1">{unit}</span>}
              </p>
              {change && trend !== "none" && (
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend === "up" ? "text-secondary-600" : "text-red-600"
                }`}>
                  <span className={`text-${
                    trend === "up" ? "secondary" : "red"
                  }-500 text-sm mr-1`}>
                    {trend === "up" ? <ArrowUpward className="text-secondary-500 text-sm" /> : "↓"}
                  </span>
                  {change}%
                </p>
              )}
            </div>
          </div>
          <div className={`p-2 ${
            title.includes("Impact") ? "bg-primary-50" :
            title.includes("Velocity") ? "bg-secondary-50" :
            title.includes("Adoption") ? "bg-amber-50" :
            "bg-secondary-50"
          } rounded-md`}>
            {icon}
          </div>
        </div>
        <div className="mt-4">
          {progressValue !== undefined && (
            <div className="relative pt-1">
              <Progress 
                value={progressValue} 
                className="h-2 rounded"
                indicatorColor={`${
                  title.includes("Impact") ? "bg-primary-500" :
                  title.includes("Adoption") ? "bg-amber-500" :
                  "bg-secondary-500"
                } rounded`}
              />
            </div>
          )}
          {chartType === "sparkline" && chartData && Array.isArray(chartData) && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={40}>
              <LineChart data={chartData.map(value => ({ value }))}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={
                    title.includes("Velocity") ? "#22c55e" :
                    title.includes("Usability") ? "#22c55e" :
                    "#6366f1"
                  } 
                  strokeWidth={2} 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-500">{description}</p>
      </div>
    </Card>
  );
}
