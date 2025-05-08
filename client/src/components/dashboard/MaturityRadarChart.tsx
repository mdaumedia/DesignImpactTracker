import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, FileDownload } from "@/lib/icons";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export type MaturityDimension = {
  name: string;
  score: number;
  fullMark: number;
};

type MaturityRadarChartProps = {
  title: string;
  data: MaturityDimension[];
  isLoading: boolean;
  className?: string;
};

export function MaturityRadarChart({
  title,
  data,
  isLoading,
  className = "",
}: MaturityRadarChartProps) {
  // Sample data if API isn't ready yet
  const sampleData: MaturityDimension[] = [
    { name: "Component Coverage", score: 78, fullMark: 100 },
    { name: "Documentation", score: 65, fullMark: 100 },
    { name: "Governance", score: 82, fullMark: 100 },
    { name: "Team Adoption", score: 75, fullMark: 100 },
    { name: "Versioning", score: 87, fullMark: 100 },
    { name: "Accessibility", score: 70, fullMark: 100 },
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
          <Skeleton className="h-[300px] w-full rounded" />
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
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Radar
                name="Current Status"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.5}
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
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm text-slate-600">
            Overall maturity score:{" "}
            <span className="font-semibold">
              {Math.round(
                chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length
              )}%
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}