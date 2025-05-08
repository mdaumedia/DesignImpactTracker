import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical } from "@/lib/icons";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

type CorrelationChartProps = {
  title: string;
  data: any[];
  isLoading: boolean;
  rSquared: number;
};

export function CorrelationChart({
  title,
  data,
  isLoading,
  rSquared,
}: CorrelationChartProps) {
  // Sample data if API isn't ready yet
  const sampleData = [
    { designQuality: 72, retention: 64 },
    { designQuality: 76, retention: 69 },
    { designQuality: 78, retention: 68 },
    { designQuality: 81, retention: 74 },
    { designQuality: 83, retention: 76 },
    { designQuality: 85, retention: 78 },
    { designQuality: 87, retention: 82 },
    { designQuality: 89, retention: 85 },
    { designQuality: 92, retention: 87 },
  ];

  const chartData = data.length > 0 ? data : sampleData;

  if (isLoading) {
    return (
      <Card className="widget-card overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-[220px] w-full rounded" />
          <Skeleton className="h-5 w-3/4 mt-4" />
        </div>
      </Card>
    );
  }

  const domain = [
    Math.floor(Math.min(...chartData.map((d) => Math.min(d.designQuality, d.retention))) * 0.95),
    Math.ceil(Math.max(...chartData.map((d) => Math.max(d.designQuality, d.retention))) * 1.05),
  ];

  // Calculate linear regression for trend line
  const n = chartData.length;
  const sumX = chartData.reduce((acc, d) => acc + d.designQuality, 0);
  const sumY = chartData.reduce((acc, d) => acc + d.retention, 0);
  const sumXY = chartData.reduce((acc, d) => acc + d.designQuality * d.retention, 0);
  const sumXX = chartData.reduce((acc, d) => acc + d.designQuality * d.designQuality, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const trendlineData = [
    { x: domain[0], y: slope * domain[0] + intercept },
    { x: domain[1], y: slope * domain[1] + intercept },
  ];

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
            <ScatterChart
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="designQuality" 
                name="Design Quality" 
                domain={domain}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                label={{ 
                  value: 'Design Quality Score', 
                  position: 'insideBottom', 
                  offset: -5,
                  fontSize: 12,
                  fill: '#64748b'
                }}
              />
              <YAxis 
                type="number" 
                dataKey="retention" 
                name="User Retention" 
                domain={domain}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                label={{ 
                  value: 'User Retention (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  fontSize: 12,
                  fill: '#64748b'
                }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                formatter={(value: number) => [`${value}`, '']}
              />
              <Legend verticalAlign="top" height={36} />
              <Scatter
                name="Design Quality vs Retention"
                data={chartData}
                fill="#6366f1"
                line={{ stroke: '#6366f1', strokeWidth: 2 }}
                lineType="fitting"
              />
              <ReferenceLine
                segment={trendlineData}
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm text-slate-600">
            <span className="font-medium">R² value: {rSquared}</span> - Strong positive
            correlation between design system adoption and user retention rates
          </p>
        </div>
      </div>
    </Card>
  );
}
