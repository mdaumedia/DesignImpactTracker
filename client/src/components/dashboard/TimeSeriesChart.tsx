import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical } from "@/lib/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type TimeSeriesChartProps = {
  title: string;
  data: any[];
  isLoading: boolean;
  stats: {
    avgTime: string;
    fastest: string;
    slowest: string;
  };
};

export function TimeSeriesChart({ title, data, isLoading, stats }: TimeSeriesChartProps) {
  // Sample data format if API isn't ready yet
  const sampleData = [
    { date: "Jan", value: 6.2 },
    { date: "Feb", value: 5.3 },
    { date: "Mar", value: 4.8 },
    { date: "Apr", value: 4.2 },
    { date: "May", value: 3.9 },
    { date: "Jun", value: 3.7 },
    { date: "Jul", value: 3.8 },
  ];
  
  const chartData = data.length > 0 ? data : sampleData;
  
  if (isLoading) {
    return (
      <Card className="widget-card overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-[220px] w-full rounded" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="widget-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-800">{title}</h3>
          <div className="flex space-x-2">
            <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <MoreVertical className="text-lg" />
            </button>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                unit=" days" 
                width={60}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                name="Design Time"
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded bg-slate-50 p-2">
            <p className="text-slate-500">Avg. Time</p>
            <p className="font-mono font-medium text-slate-700">{stats.avgTime}</p>
          </div>
          <div className="rounded bg-slate-50 p-2">
            <p className="text-slate-500">Fastest</p>
            <p className="font-mono font-medium text-slate-700">{stats.fastest}</p>
          </div>
          <div className="rounded bg-slate-50 p-2">
            <p className="text-slate-500">Slowest</p>
            <p className="font-mono font-medium text-slate-700">{stats.slowest}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
