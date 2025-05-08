import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, FileDownload } from "@/lib/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export type AdoptionTrendData = {
  date: string;
  components: number;
  patterns: number;
  tokens: number;
};

type AdoptionTrendChartProps = {
  title: string;
  data: AdoptionTrendData[];
  isLoading: boolean;
  className?: string;
};

export function AdoptionTrendChart({
  title,
  data,
  isLoading,
  className = "",
}: AdoptionTrendChartProps) {
  // Sample data if API isn't ready yet
  const sampleData: AdoptionTrendData[] = [
    { date: "Q1 2023", components: 45, patterns: 30, tokens: 65 },
    { date: "Q2 2023", components: 58, patterns: 42, tokens: 78 },
    { date: "Q3 2023", components: 67, patterns: 55, tokens: 85 },
    { date: "Q4 2023", components: 73, patterns: 65, tokens: 92 },
    { date: "Q1 2024", components: 79, patterns: 72, tokens: 95 },
    { date: "Q2 2024", components: 85, patterns: 78, tokens: 98 },
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
          <Skeleton className="h-[250px] w-full rounded" />
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
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={{ stroke: "#cbd5e1" }}
                unit="%"
                width={40}
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
              <ReferenceLine y={80} stroke="#e2e8f0" strokeDasharray="3 3" label={{ 
                value: 'Target', 
                position: 'right', 
                fill: '#64748b',
                fontSize: 12 
              }} />
              <Line
                type="monotone"
                dataKey="components"
                name="UI Components"
                stroke="#6366f1"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="patterns"
                name="UI Patterns"
                stroke="#22c55e"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="tokens"
                name="Design Tokens"
                stroke="#f59e0b"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded bg-slate-50 p-2">
            <p className="text-slate-500">Components</p>
            <p className="font-mono font-medium text-slate-700">{chartData[chartData.length - 1].components}%</p>
          </div>
          <div className="rounded bg-slate-50 p-2">
            <p className="text-slate-500">Patterns</p>
            <p className="font-mono font-medium text-slate-700">{chartData[chartData.length - 1].patterns}%</p>
          </div>
          <div className="rounded bg-slate-50 p-2">
            <p className="text-slate-500">Tokens</p>
            <p className="font-mono font-medium text-slate-700">{chartData[chartData.length - 1].tokens}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
}