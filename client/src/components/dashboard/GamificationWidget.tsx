import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Award, TrendingUp, ArrowUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

type AchievementData = {
  id: string;
  name: string;
  description: string;
  iconName: string;
  points: number;
  earned: boolean;
  progress?: number;
};

type LeaderboardEntry = {
  id: string;
  username: string;
  avatar: string;
  level: number;
  points: number;
  streak: number;
  position: number;
  trend: "up" | "down" | "none";
};

type GamificationWidgetProps = {
  title: string;
  userLevel: number;
  userPoints: number;
  pointsToNextLevel: number;
  achievements: AchievementData[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  className?: string;
};

export function GamificationWidget({
  title,
  userLevel,
  userPoints,
  pointsToNextLevel,
  achievements,
  leaderboard,
  isLoading,
  className = "",
}: GamificationWidgetProps) {
  const [activeTab, setActiveTab] = React.useState<"achievements" | "leaderboard">("achievements");

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
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-1/2" />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderAchievement = (achievement: AchievementData) => {
    const icons = {
      trophy: <Trophy size={20} />,
      star: <Star size={20} />,
      award: <Award size={20} />,
      trending_up: <TrendingUp size={20} />
    };

    const icon = icons[achievement.iconName as keyof typeof icons] || <Award size={20} />;

    return (
      <motion.div
        key={achievement.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-start p-3 border rounded-lg ${
          achievement.earned ? "border-primary bg-primary-50" : "border-slate-200"
        }`}
      >
        <div className={`p-2 mr-3 rounded-full ${
          achievement.earned ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{achievement.name}</h4>
            <Badge variant={achievement.earned ? "default" : "outline"}>
              {achievement.points} pts
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">{achievement.description}</p>
          {typeof achievement.progress === 'number' && !achievement.earned && (
            <div className="mt-2">
              <Progress value={achievement.progress} className="h-1.5" />
              <p className="text-xs text-slate-400 mt-1 text-right">
                {achievement.progress}% complete
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry, index: number) => {
    return (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`flex items-center p-3 border-b ${
          entry.id === "current" ? "bg-primary-50 border rounded-lg border-primary" : ""
        }`}
      >
        <div className="w-8 font-mono font-bold text-center">
          {entry.position}
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3">
          {entry.avatar || entry.username.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-medium">{entry.username}</span>
            {entry.trend === "up" && (
              <ArrowUp 
                size={14} 
                className="ml-1.5 text-secondary-500" 
              />
            )}
          </div>
          <div className="text-sm text-slate-500">
            Level {entry.level} • {entry.streak} day streak
          </div>
        </div>
        <div className="font-mono font-bold text-primary-600">
          {entry.points}
        </div>
      </motion.div>
    );
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 text-primary-500" size={20} />
          {title}
        </CardTitle>
        <CardDescription>
          Track your design progress and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-display font-semibold">Level {userLevel}</h3>
            <span className="text-sm font-mono font-bold text-primary-600">{userPoints} pts</span>
          </div>
          <Progress value={(userPoints / (userPoints + pointsToNextLevel)) * 100} className="h-2" />
          <p className="text-xs text-slate-500 mt-2 text-right">
            {pointsToNextLevel} points to next level
          </p>
        </div>
        
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 flex-1 font-medium text-center ${
              activeTab === "achievements" 
                ? "text-primary-600 border-b-2 border-primary-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
          </button>
          <button
            className={`px-4 py-2 flex-1 font-medium text-center ${
              activeTab === "leaderboard" 
                ? "text-primary-600 border-b-2 border-primary-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === "achievements" ? (
            <motion.div
              key="achievements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 max-h-64 overflow-y-auto pr-1"
            >
              {achievements.map(renderAchievement)}
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-64 overflow-y-auto pr-1"
            >
              {leaderboard.map(renderLeaderboardEntry)}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}