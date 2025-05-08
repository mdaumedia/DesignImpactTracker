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
} from "recharts";

type FeatureAdoptionChartProps = {
  title: string;
  data: any[];
  isLoading: boolean;
  className?: string;
};

export function FeatureAdoptionChart({
  title,
  data,
  isLoading,
  className = "",
}: FeatureAdoptionChartProps) {
  // Sample data if API isn't ready yet
  const sampleData = [
    {
      feature: "Payments",
      powerUsers: 90,
      casualUsers: 75,
      newUsers: 65,
    },
    {
      feature: "Accounts",
      powerUsers: 88,
      casualUsers: 72,
      newUsers: 62,
    },
    {
      feature: "Investments",
      powerUsers: 85,
      casualUsers: 68,
      newUsers: 55,
    },
    {
      feature: "Dashboard",
      powerUsers: 92,
      casualUsers: 78,
      newUsers: 67,
    },
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
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="feature"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                domain={[0, 100]} 
                unit="%" 
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value}%`, '']}
              />
              <Legend />
              <Bar 
                dataKey="powerUsers" 
                name="Power Users" 
                stackId="a" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="casualUsers" 
                name="Casual Users" 
                stackId="a" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="newUsers" 
                name="New Users" 
                stackId="a" 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
