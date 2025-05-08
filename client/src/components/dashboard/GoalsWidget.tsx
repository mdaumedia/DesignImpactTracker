import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical } from "@/lib/icons";

type Goal = {
  id: string;
  name: string;
  current: number;
  target: number;
  progress: number; // percentage of target
  color: "primary" | "secondary" | "amber";
  unit?: string;
};

type GoalsWidgetProps = {
  title: string;
  goals: Goal[];
  isLoading: boolean;
};

export function GoalsWidget({ title, goals, isLoading }: GoalsWidgetProps) {
  // Sample data if API isn't ready yet
  const sampleGoals: Goal[] = [
    {
      id: "1",
      name: "Design System Adoption",
      current: 76,
      target: 80,
      progress: 95,
      color: "primary",
      unit: "%",
    },
    {
      id: "2",
      name: "Design Velocity",
      current: 3.8,
      target: 3.0,
      progress: 79,
      color: "amber",
      unit: "days",
    },
    {
      id: "3",
      name: "Usability Score",
      current: 92.7,
      target: 90,
      progress: 100,
      color: "secondary",
    },
    {
      id: "4",
      name: "Component Reuse",
      current: 68,
      target: 75,
      progress: 91,
      color: "primary",
      unit: "%",
    },
    {
      id: "5",
      name: "Design Consistency",
      current: 89,
      target: 95,
      progress: 94,
      color: "amber",
      unit: "%",
    },
  ];

  const goalItems = goals.length > 0 ? goals : sampleGoals;

  if (isLoading) {
    return (
      <Card className="widget-card overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex justify-end mt-1">
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Skeleton className="h-10 w-full rounded" />
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
          <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <MoreVertical className="text-lg" />
          </button>
        </div>
        
        <div className="space-y-5">
          {goalItems.map((goal) => (
            <div key={goal.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">{goal.name}</span>
                <span className="text-sm font-mono font-medium text-slate-700">
                  {goal.current}{goal.unit} / {goal.target}{goal.unit}
                </span>
              </div>
              <Progress 
                value={goal.progress} 
                className="h-2"
                indicatorColor={`bg-${goal.color}-500`}
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-slate-500">
                  {goal.progress >= 100 
                    ? "Target achieved" 
                    : `${goal.progress}% of target`}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <Button className="w-full">
            Set New Goals
          </Button>
        </div>
      </div>
    </Card>
  );
}
