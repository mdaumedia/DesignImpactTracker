import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { TimeSeriesChart } from "@/components/dashboard/TimeSeriesChart";
import { CorrelationChart } from "@/components/dashboard/CorrelationChart";
import { FeatureAdoptionChart } from "@/components/dashboard/FeatureAdoptionChart";
import { FeedbackWidget } from "@/components/dashboard/FeedbackWidget";
import { MetricsTable } from "@/components/dashboard/MetricsTable";
import { GoalsWidget } from "@/components/dashboard/GoalsWidget";
import {
  QueryStats,
  TrendingUp,
  Speed,
  ThumbsUp,
} from "@/lib/icons";

// Dashboard Page
export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
  });
  
  const [timeRange, setTimeRange] = React.useState("quarter");
  const [filters, setFilters] = React.useState({
    feature: "all",
    persona: "all",
    platform: "all",
    metricType: "all",
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {/* Dashboard header */}
          <div className="mb-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold leading-7 text-slate-800 sm:text-3xl sm:truncate">
                  Design Impact Dashboard
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track and analyze design system performance metrics
                </p>
              </div>

              {/* Time Range Selector */}
              <div className="mt-4 sm:mt-0 sm:flex-shrink-0">
                <div className="inline-flex shadow-sm rounded-md">
                  <button
                    type="button"
                    onClick={() => handleTimeRangeChange("7days")}
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-r-0 border-slate-300 text-sm font-medium ${
                      timeRange === "7days"
                        ? "bg-primary-50 text-primary-700"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    7 days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeRangeChange("30days")}
                    className={`relative inline-flex items-center px-4 py-2 border border-r-0 border-slate-300 text-sm font-medium ${
                      timeRange === "30days"
                        ? "bg-primary-50 text-primary-700"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    30 days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeRangeChange("quarter")}
                    className={`relative inline-flex items-center px-4 py-2 border border-r-0 border-slate-300 text-sm font-medium ${
                      timeRange === "quarter"
                        ? "bg-primary-50 text-primary-700"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Quarter
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeRangeChange("year")}
                    className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-slate-300 text-sm font-medium ${
                      timeRange === "year"
                        ? "bg-primary-50 text-primary-700"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onApply={() => {
              // Would typically trigger a data refetch with new filters
            }}
            onReset={() => {
              setFilters({
                feature: "all",
                persona: "all",
                platform: "all",
                metricType: "all",
              });
            }}
          />

          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <KpiCard
              title="Design Impact Score"
              value={dashboardData?.impactScore?.value || 85.4}
              change={dashboardData?.impactScore?.change || 12}
              trend="up"
              icon={<QueryStats className="text-primary-500" />}
              progressValue={dashboardData?.impactScore?.value || 85.4}
              description="Based on weighted average of all metrics"
              isLoading={isLoading}
            />

            <KpiCard
              title="Design Velocity"
              value={dashboardData?.velocity?.value || 3.8}
              unit="days/feature"
              change={dashboardData?.velocity?.change || 16}
              trend="up"
              icon={<Speed className="text-secondary-500" />}
              chartType="sparkline"
              chartData={dashboardData?.velocity?.trend || [3.2, 3.5, 3.8, 3.6, 3.9, 3.7, 3.8]}
              description="16% faster than previous quarter"
              isLoading={isLoading}
            />

            <KpiCard
              title="System Adoption"
              value={dashboardData?.adoption?.value || 76.2}
              unit="%"
              change={dashboardData?.adoption?.change || 4.1}
              trend="up"
              icon={<TrendingUp className="text-amber-500" />}
              progressValue={dashboardData?.adoption?.value || 76.2}
              description="% of UI using design system components"
              isLoading={isLoading}
            />

            <KpiCard
              title="Usability Score"
              value={dashboardData?.usability?.value || 92.7}
              change={dashboardData?.usability?.change || 2.3}
              trend="up"
              icon={<ThumbsUp className="text-secondary-500" />}
              chartType="sparkline"
              chartData={dashboardData?.usability?.trend || [86.4, 87.2, 88.9, 90.3, 91.8, 92.7]}
              description="Based on SUS methodology (max 100)"
              isLoading={isLoading}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TimeSeriesChart
              title="Design Velocity Trend"
              data={dashboardData?.velocityTrend || []}
              isLoading={isLoading}
              stats={{
                avgTime: "3.8 days",
                fastest: "1.2 days",
                slowest: "7.4 days",
              }}
            />

            <CorrelationChart
              title="Design Impact vs User Retention"
              data={dashboardData?.impactRetentionCorrelation || []}
              isLoading={isLoading}
              rSquared={0.78}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <FeatureAdoptionChart
              title="Feature Adoption by Persona"
              data={dashboardData?.featureAdoption || []}
              isLoading={isLoading}
              className="col-span-1 lg:col-span-2"
            />

            <FeedbackWidget
              title="User Feedback"
              feedback={dashboardData?.feedback || []}
              isLoading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MetricsTable
              title="Design Metrics by Feature"
              data={dashboardData?.featureMetrics || []}
              isLoading={isLoading}
              className="col-span-1 lg:col-span-2"
            />

            <GoalsWidget
              title="Design Goals"
              goals={dashboardData?.goals || []}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
