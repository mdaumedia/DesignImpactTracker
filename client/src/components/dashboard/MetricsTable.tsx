import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, FileDownload, ArrowUpward, ArrowDownward } from "@/lib/icons";

type MetricRow = {
  id: string;
  feature: {
    name: string;
    icon: string;
    lastUpdated: string;
  };
  impactScore: {
    value: number;
    change: number;
    trend: "up" | "down" | "none";
  };
  adoptionRate: {
    value: number;
    change: number;
    trend: "up" | "down" | "none";
  };
  timeToDesign: {
    value: string;
    change: number;
    trend: "up" | "down" | "none";
  };
  usabilityScore: {
    value: number;
    change: number;
    trend: "up" | "down" | "none";
  };
};

type MetricsTableProps = {
  title: string;
  data: MetricRow[];
  isLoading: boolean;
  className?: string;
};

export function MetricsTable({
  title,
  data,
  isLoading,
  className = "",
}: MetricsTableProps) {
  // Sample data if API isn't ready yet
  const sampleData: MetricRow[] = [
    {
      id: "1",
      feature: {
        name: "Payments",
        icon: "payments",
        lastUpdated: "2 days ago",
      },
      impactScore: {
        value: 92.4,
        change: 4.2,
        trend: "up",
      },
      adoptionRate: {
        value: 88.7,
        change: 6.1,
        trend: "up",
      },
      timeToDesign: {
        value: "2.4 days",
        change: 12.8,
        trend: "down",
      },
      usabilityScore: {
        value: 94.2,
        change: 2.3,
        trend: "up",
      },
    },
    {
      id: "2",
      feature: {
        name: "Accounts",
        icon: "account_balance",
        lastUpdated: "5 days ago",
      },
      impactScore: {
        value: 86.7,
        change: 3.1,
        trend: "up",
      },
      adoptionRate: {
        value: 79.2,
        change: 4.3,
        trend: "up",
      },
      timeToDesign: {
        value: "3.8 days",
        change: 8.2,
        trend: "down",
      },
      usabilityScore: {
        value: 88.5,
        change: 1.8,
        trend: "up",
      },
    },
    {
      id: "3",
      feature: {
        name: "Investments",
        icon: "trending_up",
        lastUpdated: "1 day ago",
      },
      impactScore: {
        value: 90.1,
        change: 5.6,
        trend: "up",
      },
      adoptionRate: {
        value: 82.4,
        change: 7.2,
        trend: "up",
      },
      timeToDesign: {
        value: "3.1 days",
        change: 10.4,
        trend: "down",
      },
      usabilityScore: {
        value: 91.8,
        change: 3.2,
        trend: "up",
      },
    },
    {
      id: "4",
      feature: {
        name: "Dashboard",
        icon: "dashboard",
        lastUpdated: "3 days ago",
      },
      impactScore: {
        value: 84.3,
        change: 2.8,
        trend: "up",
      },
      adoptionRate: {
        value: 72.1,
        change: 3.4,
        trend: "up",
      },
      timeToDesign: {
        value: "4.6 days",
        change: 0,
        trend: "none",
      },
      usabilityScore: {
        value: 87.2,
        change: 1.5,
        trend: "up",
      },
    },
  ];

  const tableData = data.length > 0 ? data : sampleData;

  // Helper function to render icons based on material icon names
  const renderFeatureIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      payments: <span className="material-icons">payments</span>,
      account_balance: <span className="material-icons">account_balance</span>,
      trending_up: <span className="material-icons">trending_up</span>,
      dashboard: <span className="material-icons">dashboard</span>,
    };
    
    return iconMap[iconName] || <span className="material-icons">extension</span>;
  };

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
          
          <div className="overflow-x-auto">
            <Skeleton className="h-[300px] w-full" />
          </div>
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
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Impact Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Adoption Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Time to Design
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Usability Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md
                        ${row.feature.name === "Payments" ? "bg-primary-100 text-primary-600" :
                          row.feature.name === "Accounts" ? "bg-amber-100 text-amber-600" :
                          row.feature.name === "Investments" ? "bg-secondary-100 text-secondary-600" :
                          "bg-slate-100 text-slate-600"}`
                      }>
                        {renderFeatureIcon(row.feature.icon)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{row.feature.name}</div>
                        <div className="text-xs text-slate-500">Last updated {row.feature.lastUpdated}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-slate-900">{row.impactScore.value}</div>
                    <div className={`text-xs ${
                      row.impactScore.trend === "up" ? "text-secondary-600" :
                      row.impactScore.trend === "down" ? "text-red-600" : "text-slate-500"
                    } flex items-center`}>
                      {row.impactScore.trend === "up" ? (
                        <ArrowUpward className="text-secondary-500 text-xs mr-1" />
                      ) : row.impactScore.trend === "down" ? (
                        <ArrowDownward className="text-red-500 text-xs mr-1" />
                      ) : null}
                      {row.impactScore.change}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-slate-900">{row.adoptionRate.value}%</div>
                    <div className={`text-xs ${
                      row.adoptionRate.trend === "up" ? "text-secondary-600" :
                      row.adoptionRate.trend === "down" ? "text-red-600" : "text-slate-500"
                    } flex items-center`}>
                      {row.adoptionRate.trend === "up" ? (
                        <ArrowUpward className="text-secondary-500 text-xs mr-1" />
                      ) : row.adoptionRate.trend === "down" ? (
                        <ArrowDownward className="text-red-500 text-xs mr-1" />
                      ) : null}
                      {row.adoptionRate.change}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-slate-900">{row.timeToDesign.value}</div>
                    <div className={`text-xs ${
                      row.timeToDesign.trend === "down" ? "text-secondary-600" :
                      row.timeToDesign.trend === "up" ? "text-red-600" : "text-slate-500"
                    } flex items-center`}>
                      {row.timeToDesign.trend === "down" ? (
                        <ArrowDownward className="text-secondary-500 text-xs mr-1" />
                      ) : row.timeToDesign.trend === "up" ? (
                        <ArrowUpward className="text-red-500 text-xs mr-1" />
                      ) : null}
                      {row.timeToDesign.change > 0 ? `${row.timeToDesign.change}%` : "No change"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-slate-900">{row.usabilityScore.value}</div>
                    <div className={`text-xs ${
                      row.usabilityScore.trend === "up" ? "text-secondary-600" :
                      row.usabilityScore.trend === "down" ? "text-red-600" : "text-slate-500"
                    } flex items-center`}>
                      {row.usabilityScore.trend === "up" ? (
                        <ArrowUpward className="text-secondary-500 text-xs mr-1" />
                      ) : row.usabilityScore.trend === "down" ? (
                        <ArrowDownward className="text-red-500 text-xs mr-1" />
                      ) : null}
                      {row.usabilityScore.change}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
