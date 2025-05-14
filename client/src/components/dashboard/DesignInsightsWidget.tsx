import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ChevronRight, TrendingUp, AlertTriangle, Zap, LineChart, Pin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type DesignInsight = {
  id: string;
  title: string;
  description: string;
  type: "trend" | "anomaly" | "recommendation" | "prediction";
  confidence: number;
  relatedFeatures: string[];
  generatedAt: string;
  pinned: boolean;
  seen: boolean;
};

type DesignInsightsWidgetProps = {
  title: string;
  insights: DesignInsight[];
  isLoading: boolean;
  onPinInsight: (id: string, pinned: boolean) => void;
  onMarkAsSeen: (id: string) => void;
  className?: string;
};

export function DesignInsightsWidget({
  title,
  insights,
  isLoading,
  onPinInsight,
  onMarkAsSeen,
  className = "",
}: DesignInsightsWidgetProps) {
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  
  if (isLoading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-32" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredInsights = filter === "all" 
    ? insights 
    : insights.filter(insight => !insight.seen);

  const insightTypeIcons = {
    trend: <TrendingUp size={18} className="text-primary-500" />,
    anomaly: <AlertTriangle size={18} className="text-amber-500" />,
    recommendation: <Lightbulb size={18} className="text-secondary-500" />,
    prediction: <LineChart size={18} className="text-purple-500" />,
  };

  const getInsightTypeName = (type: "trend" | "anomaly" | "recommendation" | "prediction") => {
    const typeNames = {
      trend: "Trend Identified",
      anomaly: "Anomaly Detected",
      recommendation: "Recommendation",
      prediction: "Prediction",
    };
    return typeNames[type];
  };

  const getInsightBadgeColor = (type: "trend" | "anomaly" | "recommendation" | "prediction") => {
    const colors = {
      trend: "bg-primary-50 text-primary-700 border-primary-200",
      anomaly: "bg-amber-50 text-amber-700 border-amber-200",
      recommendation: "bg-secondary-50 text-secondary-700 border-secondary-200",
      prediction: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[type];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-secondary-600";
    if (confidence >= 75) return "text-primary-600";
    if (confidence >= 60) return "text-amber-600";
    return "text-slate-600";
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Zap className="mr-2 text-primary-500" size={20} />
            {title}
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "unread" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread
            </Button>
          </div>
        </div>
        <CardDescription>
          AI-powered insights from your design metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {filteredInsights.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Lightbulb className="mx-auto mb-2" size={24} />
              <p>No insights to display</p>
              {filter === "unread" && (
                <p className="text-sm mt-1">All insights have been read</p>
              )}
            </div>
          ) : (
            filteredInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 border rounded-lg ${
                  !insight.seen ? "border-primary-200 bg-primary-50" : "border-slate-200"
                }`}
                onAnimationComplete={() => {
                  if (!insight.seen) {
                    // Mark as seen after animation if it's new
                    setTimeout(() => onMarkAsSeen(insight.id), 2000);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    {insightTypeIcons[insight.type]}
                    <span className="ml-2 font-medium">{insight.title}</span>
                    {!insight.seen && (
                      <Badge variant="outline" className="ml-2 text-xs bg-blue-50 border-blue-200 text-blue-700">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onPinInsight(insight.id, !insight.pinned)}
                            className={insight.pinned ? "text-amber-500" : "text-slate-400"}
                          >
                            <Pin size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {insight.pinned ? "Unpin insight" : "Pin insight"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <Badge variant="outline" className={`mb-2 text-xs ${getInsightBadgeColor(insight.type)}`}>
                  {getInsightTypeName(insight.type)}
                </Badge>
                
                <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <div className="flex items-center">
                    <span className={`font-mono font-medium ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span>{new Date(insight.generatedAt).toLocaleDateString()}</span>
                    <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
                
                {insight.relatedFeatures.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-1">
                    {insight.relatedFeatures.map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}