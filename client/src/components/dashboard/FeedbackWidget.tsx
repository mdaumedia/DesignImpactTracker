import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ArrowForward } from "@/lib/icons";

type FeedbackItem = {
  id: string;
  user: {
    initials: string;
    color: string;
  };
  content: string;
  description: string;
  rating: number;
  feature: string;
};

type FeedbackWidgetProps = {
  title: string;
  feedback: FeedbackItem[];
  isLoading: boolean;
};

export function FeedbackWidget({ title, feedback, isLoading }: FeedbackWidgetProps) {
  // Sample data if API isn't ready yet
  const sampleFeedback: FeedbackItem[] = [
    {
      id: "1",
      user: {
        initials: "MS",
        color: "bg-amber-100 text-amber-700",
      },
      content: "New dashboard is much cleaner!",
      description: "The layout makes it easier to find what I need quickly.",
      rating: 5,
      feature: "Payments Feature",
    },
    {
      id: "2",
      user: {
        initials: "AK",
        color: "bg-primary-100 text-primary-700",
      },
      content: "Transaction list is more readable",
      description: "The new typography makes scanning much faster.",
      rating: 4,
      feature: "Accounts Feature",
    },
    {
      id: "3",
      user: {
        initials: "DP",
        color: "bg-secondary-100 text-secondary-700",
      },
      content: "Investment charts are intuitive",
      description: "I can understand my portfolio performance at a glance now.",
      rating: 5,
      feature: "Investments Feature",
    },
  ];

  const feedbackItems = feedback.length > 0 ? feedback : sampleFeedback;

  if (isLoading) {
    return (
      <Card className="widget-card overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-start">
                  <Skeleton className="h-8 w-8 rounded-full mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
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
          <div>
            <Badge variant="secondary" className="bg-secondary-100 text-secondary-800">
              New
            </Badge>
          </div>
        </div>
        
        <div className="space-y-4">
          {feedbackItems.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className={`w-8 h-8 rounded-full ${item.user.color} flex items-center justify-center font-semibold text-sm`}>
                    {item.user.initials}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.content}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                  <div className="mt-2 flex items-center text-xs text-slate-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`text-sm mr-1 ${
                          i < item.rating ? "text-amber-500" : "text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2">{item.feature}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            View All Feedback
            <ArrowForward className="ml-1 text-sm" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
