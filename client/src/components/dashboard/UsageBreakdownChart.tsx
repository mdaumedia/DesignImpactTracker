import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, FileDownload } from "@/lib/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export type UsageData = {
  department: string;
  usage: number;
  target: number;
  color: string;
};

type UsageBreakdownChartProps = {
  title: string;
  data: UsageData[];
  isLoading: boolean;
  className?: string;
};

export function UsageBreakdownChart({
  title,
  data,
  isLoading,
  className = "",
}: UsageBreakdownChartProps) {
  // Sample data if API isn't ready yet
  const sampleData: UsageData[] = [
    { department: "UX Team", usage: 92, target: 90, color: "#6366f1" },
    { department: "Frontend", usage: 85, target: 80, color: "#22c55e" },
    { department: "Mobile", usage: 68, target: 75, color: "#f59e0b" },
    { department: "Marketing", usage: 45, target: 60, color: "#ef4444" },
    { department: "Internal Tools", usage: 78, target: 70, color: "#8b5cf6" },
  ];

  const chartData = data.length > 0 ? data : sampleData;

  if (isLoading) {
    return (
      <Card className={`widget-card overflow-hidden ${className}`}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`widget-card overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-800">{title}</h3>
          <div className="flex space-x-2">
            <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <FileDownload className="text-sm" />
            </button>
            <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <MoreVertical className="text-lg" />
            </button>
          </div>
        </div>
        <div className="chart-container h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={{ stroke: "#cbd5e1" }}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="department"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={{ stroke: "#cbd5e1" }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
              <Legend />
              <Bar 
                dataKey="usage" 
                name="Current Usage" 
                radius={[0, 4, 4, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Bar
                dataKey="target"
                name="Target Usage"
                fill="#cbd5e1"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm text-slate-600">
            Overall usage:{" "}
            <span className="font-semibold">
              {Math.round(
                chartData.reduce((sum, item) => sum + item.usage, 0) / chartData.length
              )}%
            </span>{" "}
            against target of{" "}
            <span className="font-semibold">
              {Math.round(
                chartData.reduce((sum, item) => sum + item.target, 0) / chartData.length
              )}%
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}