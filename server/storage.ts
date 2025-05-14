import {
  users, features, designMetrics, goals, feedback,
  achievements, userAchievements, leaderboard,
  dataConnections, dataImportLogs, designInsights, dashboardLayouts,
  type User, type Feature, type DesignMetric, type Goal, type Feedback,
  type Achievement, type UserAchievement, type Leaderboard,
  type DataConnection, type DataImportLog, type DesignInsight, type DashboardLayout,
  type InsertUser, type InsertFeature, type InsertDesignMetric, type InsertGoal, type InsertFeedback,
  type InsertAchievement, type InsertUserAchievement, type InsertLeaderboard,
  type InsertDataConnection, type InsertDataImportLog, type InsertDesignInsight, type InsertDashboardLayout
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

type SummaryMetric = {
  value: number;
  change: number;
  trend: "up" | "down" | "none";
  trendData?: number[];
};

type TimeSeriesData = {
  date: string;
  value: number;
}[];

type CorrelationData = {
  designQuality: number;
  retention: number;
}[];

type FeatureAdoptionData = {
  feature: string;
  powerUsers: number;
  casualUsers: number;
  newUsers: number;
}[];

type MaturityDimension = {
  name: string;
  score: number;
  fullMark: number;
};

type UsageData = {
  department: string;
  usage: number;
  target: number;
  color: string;
};

type AdoptionTrendData = {
  date: string;
  components: number;
  patterns: number;
  tokens: number;
};

type FeatureMetric = {
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

type GoalItem = {
  id: string;
  name: string;
  current: number;
  target: number;
  progress: number;
  color: "primary" | "secondary" | "amber";
  unit?: string;
};

export interface IStorage {
  // User management (keeping existing methods)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Design dashboard specific methods
  getSummaryMetric(metricName: string): Promise<SummaryMetric>;
  getTimeSeriesData(metricName: string): Promise<TimeSeriesData>;
  getCorrelationData(metric1: string, metric2: string): Promise<CorrelationData>;
  getFeatureAdoptionByPersona(): Promise<FeatureAdoptionData>;
  getFeatureMetrics(): Promise<FeatureMetric[]>;
  getUserFeedback(): Promise<FeedbackItem[]>;
  getDesignGoals(): Promise<GoalItem[]>;
  
  // Design system maturity, usage, and adoption methods
  getDesignSystemMaturity(): Promise<MaturityDimension[]>;
  getDesignSystemUsage(): Promise<UsageData[]>;
  getAdoptionTrends(): Promise<AdoptionTrendData[]>;
  
  // Filtered metric queries
  getMetricsByFeature(featureId: string): Promise<DesignMetric[]>;
  getMetricsByTimeRange(startDate: string, endDate: string, metricType?: string): Promise<DesignMetric[]>;
  
  // Data creation methods
  createFeature(feature: InsertFeature): Promise<Feature>;
  createMetric(metric: InsertDesignMetric): Promise<DesignMetric>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  createFeedback(feedbackItem: InsertFeedback): Promise<Feedback>;
  
  // Advanced Features - AI-powered design insights
  getDesignInsights(): Promise<any[]>; // Using any temporarily until we define a proper type
  createDesignInsight(insight: any): Promise<any>;
  updateDesignInsight(id: string, updates: { pinned?: boolean; seen?: boolean }): Promise<any>;
  
  // Advanced Features - Data source connections
  getDataConnections(): Promise<any[]>;
  createDataConnection(connection: any): Promise<any>;
  syncDataConnection(id: string): Promise<any>;
  
  // Advanced Features - Gamification
  getUserAchievements(userId: number): Promise<any[]>;
  getLeaderboard(): Promise<any[]>;
  getUserLevel(userId: number): Promise<number>;
  getUserPoints(userId: number): Promise<number>;
  getPointsToNextLevel(userId: number): Promise<number>;
  
  // Advanced Features - Dashboard customization
  getDashboardLayout(userId: number): Promise<any>;
  saveDashboardLayout(userId: number, layout: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private features: Map<number, Feature>;
  private designMetrics: Map<number, DesignMetric>;
  private designGoals: Map<number, Goal>;
  private userFeedback: Map<number, Feedback>;

  private currentUserId: number;
  private currentFeatureId: number;
  private currentMetricId: number;
  private currentGoalId: number;
  private currentFeedbackId: number;

  constructor() {
    this.users = new Map();
    this.features = new Map();
    this.designMetrics = new Map();
    this.designGoals = new Map();
    this.userFeedback = new Map();

    this.currentUserId = 1;
    this.currentFeatureId = 1;
    this.currentMetricId = 1;
    this.currentGoalId = 1;
    this.currentFeedbackId = 1;

    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample user
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "password123", // Never do this in production!
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSummaryMetric(metricName: string): Promise<SummaryMetric> {
    // Mock data for different metrics
    const mockData: Record<string, SummaryMetric> = {
      velocity: {
        value: 32,
        change: 15,
        trend: "up",
        trendData: [25, 27, 28, 30, 32]
      },
      adoption: {
        value: 78,
        change: -5,
        trend: "down",
        trendData: [85, 83, 80, 79, 78]
      },
      usability: {
        value: 92,
        change: 8,
        trend: "up",
        trendData: [84, 86, 88, 90, 92]
      }
    };

    return mockData[metricName] || {
      value: 0,
      change: 0,
      trend: "none",
      trendData: [0, 0, 0, 0, 0]
    };
  }

  async getTimeSeriesData(metricName: string): Promise<TimeSeriesData> {
    // Mock data for different metrics
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const mockData: Record<string, TimeSeriesData> = {
      velocityTrend: dates.map((date, i) => ({
        date,
        value: 20 + Math.floor(Math.random() * 20) + i * 0.5
      }))
    };

    return mockData[metricName] || dates.map(date => ({ date, value: 0 }));
  }

  async getCorrelationData(metric1: string, metric2: string): Promise<CorrelationData> {
    // Mock correlation data between impact score and retention
    const mockData: Record<string, CorrelationData> = {
      impactRetentionCorrelation: Array.from({ length: 20 }, () => ({
        designQuality: 60 + Math.floor(Math.random() * 30),
        retention: 65 + Math.floor(Math.random() * 25)
      }))
    };

    return mockData[`${metric1}${metric2}Correlation`] || [];
  }

  async getFeatureAdoptionByPersona(): Promise<FeatureAdoptionData> {
    // Mock feature adoption data by user persona
    const mockData: Record<string, FeatureAdoptionData> = {
      featureAdoption: [
        { feature: "Dashboard", powerUsers: 85, casualUsers: 62, newUsers: 38 },
        { feature: "Analytics Charts", powerUsers: 92, casualUsers: 45, newUsers: 22 },
        { feature: "Payment Flow", powerUsers: 78, casualUsers: 68, newUsers: 52 },
        { feature: "Accounts", powerUsers: 95, casualUsers: 72, newUsers: 60 },
        { feature: "Mobile Nav", powerUsers: 65, casualUsers: 58, newUsers: 42 }
      ]
    };

    return mockData.featureAdoption || [];
  }

  async getFeatureMetrics(): Promise<FeatureMetric[]> {
    // Mock feature metrics
    return [
      {
        id: "1",
        feature: {
          name: "Dashboard Component",
          icon: "dashboard",
          lastUpdated: "2 days ago"
        },
        impactScore: {
          value: 9.2,
          change: 1.8,
          trend: "up"
        },
        adoptionRate: {
          value: 84,
          change: 12,
          trend: "up"
        },
        timeToDesign: {
          value: "3.2 days",
          change: -0.8,
          trend: "down" // down is good for time metrics
        },
        usabilityScore: {
          value: 92,
          change: 8,
          trend: "up"
        }
      },
      {
        id: "2",
        feature: {
          name: "Payment Flow",
          icon: "payments",
          lastUpdated: "5 days ago"
        },
        impactScore: {
          value: 9.5,
          change: 0.5,
          trend: "up"
        },
        adoptionRate: {
          value: 72,
          change: -3,
          trend: "down"
        },
        timeToDesign: {
          value: "5.8 days",
          change: 1.2,
          trend: "up" // up is bad for time metrics
        },
        usabilityScore: {
          value: 84,
          change: -2,
          trend: "down"
        }
      },
      {
        id: "3",
        feature: {
          name: "Account Management",
          icon: "account_balance",
          lastUpdated: "1 week ago"
        },
        impactScore: {
          value: 8.7,
          change: 2.1,
          trend: "up"
        },
        adoptionRate: {
          value: 91,
          change: 15,
          trend: "up"
        },
        timeToDesign: {
          value: "4.5 days",
          change: -1.2,
          trend: "down"
        },
        usabilityScore: {
          value: 88,
          change: 6,
          trend: "up"
        }
      }
    ];
  }

  async getUserFeedback(): Promise<FeedbackItem[]> {
    // Mock user feedback
    return [
      {
        id: "1",
        user: { initials: "JD", color: "bg-blue-500" },
        content: "Dashboard is intuitive and shows the right metrics",
        description: "User found the dashboard metrics valuable for decision making",
        rating: 5,
        feature: "Dashboard"
      },
      {
        id: "2",
        user: { initials: "AK", color: "bg-green-500" },
        content: "Payment confirmation screen is confusing",
        description: "User experienced issues with understanding the payment confirmation process",
        rating: 2,
        feature: "Payment Flow"
      },
      {
        id: "3",
        user: { initials: "MR", color: "bg-purple-500" },
        content: "Account section is missing quick access to settings",
        description: "User suggested adding a shortcut to frequently used settings",
        rating: 3,
        feature: "Account Management"
      },
      {
        id: "4",
        user: { initials: "LT", color: "bg-amber-500" },
        content: "Love the new analytics visualizations",
        description: "User found the data visualizations much more helpful than before",
        rating: 5,
        feature: "Analytics Charts"
      }
    ];
  }

  async getDesignGoals(): Promise<GoalItem[]> {
    // Mock design goals
    return [
      {
        id: "1",
        name: "Improve User Satisfaction",
        current: 78,
        target: 90,
        progress: 78 / 90 * 100,
        color: "primary",
        unit: "%"
      },
      {
        id: "2",
        name: "Design System Adoption",
        current: 65,
        target: 85,
        progress: 65 / 85 * 100,
        color: "secondary",
        unit: "%"
      },
      {
        id: "3",
        name: "Reduce Design Time",
        current: 5.2,
        target: 3,
        progress: (1 - ((5.2 - 3) / 5.2)) * 100,
        color: "amber",
        unit: "days"
      }
    ];
  }

  async getDesignSystemMaturity(): Promise<MaturityDimension[]> {
    // Mock design system maturity radar chart data
    return [
      { name: "Components", score: 80, fullMark: 100 },
      { name: "Patterns", score: 65, fullMark: 100 },
      { name: "Documentation", score: 90, fullMark: 100 },
      { name: "Processes", score: 70, fullMark: 100 },
      { name: "Governance", score: 55, fullMark: 100 },
      { name: "Adoption", score: 75, fullMark: 100 }
    ];
  }

  async getDesignSystemUsage(): Promise<UsageData[]> {
    // Mock design system usage data
    return [
      { department: "Product", usage: 85, target: 90, color: "#8884d8" },
      { department: "Marketing", usage: 70, target: 80, color: "#83a6ed" },
      { department: "Support", usage: 55, target: 75, color: "#8dd1e1" },
      { department: "Mobile", usage: 90, target: 85, color: "#82ca9d" },
      { department: "Internal Tools", usage: 40, target: 60, color: "#a4de6c" }
    ];
  }

  async getAdoptionTrends(): Promise<AdoptionTrendData[]> {
    // Mock adoption trends data
    const today = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(date.getMonth() - (5 - i));
      return date.toISOString().split('T')[0].substring(0, 7); // YYYY-MM format
    });

    return months.map((date, i) => ({
      date,
      components: 30 + i * 8 + Math.floor(Math.random() * 5),
      patterns: 15 + i * 5 + Math.floor(Math.random() * 3),
      tokens: 45 + i * 10 + Math.floor(Math.random() * 8)
    }));
  }

  async getMetricsByFeature(featureId: string): Promise<DesignMetric[]> {
    return Array.from(this.designMetrics.values()).filter(
      metric => metric.featureId === featureId
    );
  }

  async getMetricsByTimeRange(startDate: string, endDate: string, metricType?: string): Promise<DesignMetric[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return Array.from(this.designMetrics.values()).filter(metric => {
      const recordDate = new Date(metric.recordedAt);
      const matchesTimeRange = recordDate >= start && recordDate <= end;
      const matchesType = metricType ? metric.metricName.includes(metricType) : true;
      return matchesTimeRange && matchesType;
    });
  }

  async getFeature(id: number): Promise<Feature | undefined> {
    return this.features.get(id);
  }

  async createFeature(feature: InsertFeature): Promise<Feature> {
    const id = this.currentFeatureId++;
    const newFeature: Feature = {
      id,
      name: feature.name,
      description: feature.description ?? null,
      iconName: feature.iconName ?? null,
      lastUpdated: feature.lastUpdated ?? new Date(),
    };
    this.features.set(id, newFeature);
    return newFeature;
  }

  async createMetric(metric: InsertDesignMetric): Promise<DesignMetric> {
    const id = this.currentMetricId++;
    const newMetric: DesignMetric = {
      id,
      metricName: metric.metricName,
      metricValue: metric.metricValue,
      featureId: metric.featureId,
      recordedAt: metric.recordedAt ?? new Date(),
      userSegment: metric.userSegment ?? null,
      platformType: metric.platformType ?? null,
    };
    this.designMetrics.set(id, newMetric);
    return newMetric;
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = this.currentGoalId++;
    const newGoal: Goal = {
      id,
      name: goal.name,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      createdAt: goal.createdAt ?? new Date(),
      unit: goal.unit ?? null,
      color: goal.color ?? null,
    };
    this.designGoals.set(id, newGoal);
    return newGoal;
  }

  async createFeedback(feedbackItem: InsertFeedback): Promise<Feedback> {
    const id = this.currentFeedbackId++;
    const newFeedback: Feedback = {
      id,
      featureId: feedbackItem.featureId,
      content: feedbackItem.content,
      rating: feedbackItem.rating,
      createdAt: feedbackItem.createdAt ?? new Date(),
      userInitials: feedbackItem.userInitials,
      userColorClass: feedbackItem.userColorClass ?? null,
      description: feedbackItem.description ?? null,
    };
    this.userFeedback.set(id, newFeedback);
    return newFeedback;
  }

  async getDesignInsights(): Promise<any[]> {
    // Mock design insights
    return [
      {
        id: "1",
        title: "Adoption trend detected in Dashboard component",
        description: "Dashboard component adoption has increased by 32% over the last month, correlating with improved user retention metrics.",
        type: "trend",
        confidence: 89,
        relatedFeatures: ["Dashboard", "User Analytics"],
        generatedAt: new Date().toISOString(),
        pinned: false,
        seen: true
      },
      {
        id: "2",
        title: "Usability issue in Payment Flow",
        description: "Users are spending 40% more time on the payment confirmation screen compared to industry benchmarks. Consider simplifying this screen.",
        type: "anomaly",
        confidence: 76,
        relatedFeatures: ["Payments"],
        generatedAt: new Date().toISOString(),
        pinned: true,
        seen: true
      },
      {
        id: "3",
        title: "Consider unifying button styles across Accounts section",
        description: "Analysis shows inconsistent button styling in the Accounts section may be impacting user confidence. Standardizing would improve UX metrics.",
        type: "recommendation",
        confidence: 82,
        relatedFeatures: ["Accounts", "Design System"],
        generatedAt: new Date().toISOString(),
        pinned: false,
        seen: false
      }
    ];
  }

  async createDesignInsight(insight: any): Promise<any> {
    // In a real application, this would persist the insight to a database
    return {
      id: `insight-${Date.now()}`,
      title: insight.title,
      description: insight.description,
      type: insight.type,
      confidence: insight.confidence,
      relatedFeatures: insight.relatedFeatures,
      generatedAt: new Date().toISOString(),
      pinned: false,
      seen: false
    };
  }

  async updateDesignInsight(id: string, updates: { pinned?: boolean; seen?: boolean }): Promise<any> {
    // In a real application, this would update the insight in a database
    return {
      id,
      title: "Mock Insight",
      description: "This is a mock response for updating an insight",
      type: "trend",
      confidence: 80,
      relatedFeatures: ["Design System"],
      generatedAt: new Date().toISOString(),
      pinned: updates.pinned ?? false,
      seen: updates.seen ?? false
    };
  }

  async getDataConnections(): Promise<any[]> {
    // Mock data connections
    return [
      {
        id: "1",
        name: "Figma Integration",
        type: "figma",
        status: "active",
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        credentials: {
          teamId: "team_xyz",
          projectIds: ["proj1", "proj2"]
        }
      },
      {
        id: "2",
        name: "Jira Tickets",
        type: "jira",
        status: "active",
        lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        credentials: {
          projectKey: "DESIGN"
        }
      }
    ];
  }

  async createDataConnection(connection: any): Promise<any> {
    // In a real application, this would persist the connection to a database
    return {
      id: `conn-${Date.now()}`,
      name: connection.name,
      type: connection.type,
      status: "active",
      lastSync: new Date().toISOString(),
      credentials: connection.credentials
    };
  }

  async syncDataConnection(id: string): Promise<any> {
    // In a real application, this would trigger a sync with the external data source
    return {
      id,
      status: "synced",
      lastSync: new Date().toISOString(),
      metrics: {
        itemsSynced: 128,
        newItems: 42,
        errors: 0
      }
    };
  }

  async getUserAchievements(userId: number): Promise<any[]> {
    // Mock user achievements
    return [
      {
        id: "1",
        name: "Design System Pioneer",
        description: "Created 5 components in the design system",
        iconName: "trophy",
        points: 100,
        earned: true,
        progress: 100
      },
      {
        id: "2",
        name: "Pattern Master",
        description: "Applied design patterns consistently across 10 features",
        iconName: "award",
        points: 150,
        earned: false,
        progress: 60
      }
    ];
  }

  async getLeaderboard(): Promise<any[]> {
    // Mock leaderboard data
    return [
      {
        id: "1",
        username: "alex.designer",
        avatar: "AD",
        level: 12,
        points: 780,
        streak: 15,
        position: 1,
        trend: "up"
      },
      {
        id: "2",
        username: "sarah.smith",
        avatar: "SS",
        level: 8,
        points: 560,
        streak: 8,
        position: 2,
        trend: "up"
      },
      {
        id: "3",
        username: "mike.jackson",
        avatar: "MJ",
        level: 7,
        points: 480,
        streak: 3,
        position: 3,
        trend: "down"
      }
    ];
  }

  async getUserLevel(userId: number): Promise<number> {
    return 8; // Mock level
  }

  async getUserPoints(userId: number): Promise<number> {
    return 560; // Mock points
  }

  async getPointsToNextLevel(userId: number): Promise<number> {
    return 140; // Mock points to next level
  }

  async getDashboardLayout(userId: number): Promise<any> {
    // Mock dashboard layout
    return {
      userId,
      layout: [
        { i: "kpi-cards", x: 0, y: 0, w: 12, h: 1 },
        { i: "time-series", x: 0, y: 1, w: 8, h: 2 },
        { i: "correlation", x: 8, y: 1, w: 4, h: 2 },
        { i: "feature-adoption", x: 0, y: 3, w: 6, h: 2 },
        { i: "feedback", x: 6, y: 3, w: 6, h: 2 },
        { i: "metrics-table", x: 0, y: 5, w: 8, h: 2 },
        { i: "goals", x: 8, y: 5, w: 4, h: 2 }
      ]
    };
  }

  async saveDashboardLayout(userId: number, layout: any): Promise<any> {
    // In a real application, this would save the layout to a database
    return {
      userId,
      layout,
      savedAt: new Date().toISOString()
    };
  }

  private timeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 5) {
      return `${diffInWeeks} weeks ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} months ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSummaryMetric(metricName: string): Promise<SummaryMetric> {
    // Implementation would access database in a real app
    const mockData: Record<string, SummaryMetric> = {
      velocity: {
        value: 32,
        change: 15,
        trend: "up",
        trendData: [25, 27, 28, 30, 32]
      },
      adoption: {
        value: 78,
        change: -5,
        trend: "down",
        trendData: [85, 83, 80, 79, 78]
      },
      usability: {
        value: 92,
        change: 8,
        trend: "up",
        trendData: [84, 86, 88, 90, 92]
      }
    };
    
    return mockData[metricName] || {
      value: 0,
      change: 0,
      trend: "none",
      trendData: [0, 0, 0, 0, 0]
    };
  }

  async getTimeSeriesData(metricName: string): Promise<TimeSeriesData> {
    // Implementation would access database in a real app
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const mockData: Record<string, TimeSeriesData> = {
      velocityTrend: dates.map((date, i) => ({
        date,
        value: 20 + Math.floor(Math.random() * 20) + i * 0.5
      }))
    };

    return mockData[metricName] || dates.map(date => ({ date, value: 0 }));
  }

  async getCorrelationData(metric1: string, metric2: string): Promise<CorrelationData> {
    // Implementation would access database in a real app
    const mockData: Record<string, CorrelationData> = {
      impactRetentionCorrelation: Array.from({ length: 20 }, () => ({
        designQuality: 60 + Math.floor(Math.random() * 30),
        retention: 65 + Math.floor(Math.random() * 25)
      }))
    };

    return mockData[`${metric1}${metric2}Correlation`] || [];
  }

  async getFeatureAdoptionByPersona(): Promise<FeatureAdoptionData> {
    // Implementation would access database in a real app
    const results: FeatureAdoptionData = [
      { feature: "Dashboard", powerUsers: 85, casualUsers: 62, newUsers: 38 },
      { feature: "Analytics Charts", powerUsers: 92, casualUsers: 45, newUsers: 22 },
      { feature: "Payment Flow", powerUsers: 78, casualUsers: 68, newUsers: 52 },
      { feature: "Accounts", powerUsers: 95, casualUsers: 72, newUsers: 60 },
      { feature: "Mobile Nav", powerUsers: 65, casualUsers: 58, newUsers: 42 }
    ];
    
    return results;
  }

  async getFeatureMetrics(): Promise<FeatureMetric[]> {
    // Implementation would access database in a real app
    return [
      {
        id: "1",
        feature: {
          name: "Dashboard Component",
          icon: "dashboard",
          lastUpdated: "2 days ago"
        },
        impactScore: {
          value: 9.2,
          change: 1.8,
          trend: "up"
        },
        adoptionRate: {
          value: 84,
          change: 12,
          trend: "up"
        },
        timeToDesign: {
          value: "3.2 days",
          change: -0.8,
          trend: "down" // down is good for time metrics
        },
        usabilityScore: {
          value: 92,
          change: 8,
          trend: "up"
        }
      },
      {
        id: "2",
        feature: {
          name: "Payment Flow",
          icon: "payments",
          lastUpdated: "5 days ago"
        },
        impactScore: {
          value: 9.5,
          change: 0.5,
          trend: "up"
        },
        adoptionRate: {
          value: 72,
          change: -3,
          trend: "down"
        },
        timeToDesign: {
          value: "5.8 days",
          change: 1.2,
          trend: "up" // up is bad for time metrics
        },
        usabilityScore: {
          value: 84,
          change: -2,
          trend: "down"
        }
      },
      {
        id: "3",
        feature: {
          name: "Account Management",
          icon: "account_balance",
          lastUpdated: "1 week ago"
        },
        impactScore: {
          value: 8.7,
          change: 2.1,
          trend: "up"
        },
        adoptionRate: {
          value: 91,
          change: 15,
          trend: "up"
        },
        timeToDesign: {
          value: "4.5 days",
          change: -1.2,
          trend: "down"
        },
        usabilityScore: {
          value: 88,
          change: 6,
          trend: "up"
        }
      }
    ];
  }

  async getUserFeedback(): Promise<FeedbackItem[]> {
    // Implementation would access database in a real app
    return [
      {
        id: "1",
        user: { initials: "JD", color: "bg-blue-500" },
        content: "Dashboard is intuitive and shows the right metrics",
        description: "User found the dashboard metrics valuable for decision making",
        rating: 5,
        feature: "Dashboard"
      },
      {
        id: "2",
        user: { initials: "AK", color: "bg-green-500" },
        content: "Payment confirmation screen is confusing",
        description: "User experienced issues with understanding the payment confirmation process",
        rating: 2,
        feature: "Payment Flow"
      },
      {
        id: "3",
        user: { initials: "MR", color: "bg-purple-500" },
        content: "Account section is missing quick access to settings",
        description: "User suggested adding a shortcut to frequently used settings",
        rating: 3,
        feature: "Account Management"
      },
      {
        id: "4",
        user: { initials: "LT", color: "bg-amber-500" },
        content: "Love the new analytics visualizations",
        description: "User found the data visualizations much more helpful than before",
        rating: 5,
        feature: "Analytics Charts"
      }
    ];
  }

  async getDesignGoals(): Promise<GoalItem[]> {
    // Implementation would access database in a real app
    return [
      {
        id: "1",
        name: "Improve User Satisfaction",
        current: 78,
        target: 90,
        progress: 78 / 90 * 100,
        color: "primary",
        unit: "%"
      },
      {
        id: "2",
        name: "Design System Adoption",
        current: 65,
        target: 85,
        progress: 65 / 85 * 100,
        color: "secondary",
        unit: "%"
      },
      {
        id: "3",
        name: "Reduce Design Time",
        current: 5.2,
        target: 3,
        progress: (1 - ((5.2 - 3) / 5.2)) * 100,
        color: "amber",
        unit: "days"
      }
    ];
  }

  async getMetricsByFeature(featureId: string): Promise<DesignMetric[]> {
    const metrics = await db.select().from(designMetrics);
    return metrics.filter(m => m.featureId === featureId);
  }

  async getMetricsByTimeRange(startDate: string, endDate: string, metricType?: string): Promise<DesignMetric[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const metrics = await db.select().from(designMetrics);
    return metrics.filter(metric => {
      const recordDate = new Date(metric.recordedAt);
      const matchesTimeRange = recordDate >= start && recordDate <= end;
      const matchesType = metricType ? metric.metricName.includes(metricType) : true;
      return matchesTimeRange && matchesType;
    });
  }

  async getDesignSystemMaturity(): Promise<MaturityDimension[]> {
    // Implementation would access database in a real app
    return [
      { name: "Components", score: 80, fullMark: 100 },
      { name: "Patterns", score: 65, fullMark: 100 },
      { name: "Documentation", score: 90, fullMark: 100 },
      { name: "Processes", score: 70, fullMark: 100 },
      { name: "Governance", score: 55, fullMark: 100 },
      { name: "Adoption", score: 75, fullMark: 100 }
    ];
  }

  async getDesignSystemUsage(): Promise<UsageData[]> {
    // Implementation would access database in a real app
    return [
      { department: "Product", usage: 85, target: 90, color: "#8884d8" },
      { department: "Marketing", usage: 70, target: 80, color: "#83a6ed" },
      { department: "Support", usage: 55, target: 75, color: "#8dd1e1" },
      { department: "Mobile", usage: 90, target: 85, color: "#82ca9d" },
      { department: "Internal Tools", usage: 40, target: 60, color: "#a4de6c" }
    ];
  }

  async getAdoptionTrends(): Promise<AdoptionTrendData[]> {
    // Implementation would access database in a real app
    const today = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(today);
      date.setMonth(date.getMonth() - (5 - i));
      return date.toISOString().split('T')[0].substring(0, 7); // YYYY-MM format
    });

    return months.map((date, i) => ({
      date,
      components: 30 + i * 8 + Math.floor(Math.random() * 5),
      patterns: 15 + i * 5 + Math.floor(Math.random() * 3),
      tokens: 45 + i * 10 + Math.floor(Math.random() * 8)
    }));
  }

  async createFeature(feature: InsertFeature): Promise<Feature> {
    const [newFeature] = await db
      .insert(features)
      .values(feature)
      .returning();
    return newFeature;
  }

  async createMetric(metric: InsertDesignMetric): Promise<DesignMetric> {
    const [newMetric] = await db
      .insert(designMetrics)
      .values(metric)
      .returning();
    return newMetric;
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db
      .insert(goals)
      .values(goal)
      .returning();
    return newGoal;
  }

  async createFeedback(feedbackItem: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db
      .insert(feedback)
      .values(feedbackItem)
      .returning();
    return newFeedback;
  }

  async getDesignInsights(): Promise<any[]> {
    // Implementation would access database in a real app
    return [
      {
        id: "1",
        title: "Adoption trend detected in Dashboard component",
        description: "Dashboard component adoption has increased by 32% over the last month, correlating with improved user retention metrics.",
        type: "trend",
        confidence: 89,
        relatedFeatures: ["Dashboard", "User Analytics"],
        generatedAt: new Date().toISOString(),
        pinned: false,
        seen: true
      },
      {
        id: "2",
        title: "Usability issue in Payment Flow",
        description: "Users are spending 40% more time on the payment confirmation screen compared to industry benchmarks. Consider simplifying this screen.",
        type: "anomaly",
        confidence: 76,
        relatedFeatures: ["Payments"],
        generatedAt: new Date().toISOString(),
        pinned: true,
        seen: true
      },
      {
        id: "3",
        title: "Consider unifying button styles across Accounts section",
        description: "Analysis shows inconsistent button styling in the Accounts section may be impacting user confidence. Standardizing would improve UX metrics.",
        type: "recommendation",
        confidence: 82,
        relatedFeatures: ["Accounts", "Design System"],
        generatedAt: new Date().toISOString(),
        pinned: false,
        seen: false
      }
    ];
  }

  async createDesignInsight(insight: any): Promise<any> {
    // In a real application, this would persist the insight to a database
    return {
      id: `insight-${Date.now()}`,
      title: insight.title,
      description: insight.description,
      type: insight.type,
      confidence: insight.confidence,
      relatedFeatures: insight.relatedFeatures,
      generatedAt: new Date().toISOString(),
      pinned: false,
      seen: false
    };
  }

  async updateDesignInsight(id: string, updates: { pinned?: boolean; seen?: boolean }): Promise<any> {
    // In a real application, this would update the insight in a database
    return {
      id,
      title: "Mock Insight",
      description: "This is a mock response for updating an insight",
      type: "trend",
      confidence: 80,
      relatedFeatures: ["Design System"],
      generatedAt: new Date().toISOString(),
      pinned: updates.pinned ?? false,
      seen: updates.seen ?? false
    };
  }

  async getDataConnections(): Promise<any[]> {
    // Implementation would access database in a real app
    return [
      {
        id: "1",
        name: "Figma Integration",
        type: "figma",
        status: "active",
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        credentials: {
          teamId: "team_xyz",
          projectIds: ["proj1", "proj2"]
        }
      },
      {
        id: "2",
        name: "Jira Tickets",
        type: "jira",
        status: "active",
        lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        credentials: {
          projectKey: "DESIGN"
        }
      }
    ];
  }

  async createDataConnection(connection: any): Promise<any> {
    // In a real application, this would persist the connection to a database
    return {
      id: `conn-${Date.now()}`,
      name: connection.name,
      type: connection.type,
      status: "active",
      lastSync: new Date().toISOString(),
      credentials: connection.credentials
    };
  }

  async syncDataConnection(id: string): Promise<any> {
    // In a real application, this would trigger a sync with the external data source
    return {
      id,
      status: "synced",
      lastSync: new Date().toISOString(),
      metrics: {
        itemsSynced: 128,
        newItems: 42,
        errors: 0
      }
    };
  }

  async getUserAchievements(userId: number): Promise<any[]> {
    // Implementation would access database in a real app
    return [
      {
        id: "1",
        name: "Design System Pioneer",
        description: "Created 5 components in the design system",
        iconName: "trophy",
        points: 100,
        earned: true,
        progress: 100
      },
      {
        id: "2",
        name: "Pattern Master",
        description: "Applied design patterns consistently across 10 features",
        iconName: "award",
        points: 150,
        earned: false,
        progress: 60
      }
    ];
  }

  async getLeaderboard(): Promise<any[]> {
    // Implementation would access database in a real app
    return [
      {
        id: "1",
        username: "alex.designer",
        avatar: "AD",
        level: 12,
        points: 780,
        streak: 15,
        position: 1,
        trend: "up"
      },
      {
        id: "2",
        username: "sarah.smith",
        avatar: "SS",
        level: 8,
        points: 560,
        streak: 8,
        position: 2,
        trend: "up"
      },
      {
        id: "3",
        username: "mike.jackson",
        avatar: "MJ",
        level: 7,
        points: 480,
        streak: 3,
        position: 3,
        trend: "down"
      }
    ];
  }

  async getUserLevel(userId: number): Promise<number> {
    return 8; // Mock level, would fetch from database in real app
  }

  async getUserPoints(userId: number): Promise<number> {
    return 560; // Mock points, would fetch from database in real app
  }

  async getPointsToNextLevel(userId: number): Promise<number> {
    return 140; // Mock points to next level, would calculate in real app
  }

  async getDashboardLayout(userId: number): Promise<any> {
    // Implementation would access database in a real app
    return {
      userId,
      layout: [
        { i: "kpi-cards", x: 0, y: 0, w: 12, h: 1 },
        { i: "time-series", x: 0, y: 1, w: 8, h: 2 },
        { i: "correlation", x: 8, y: 1, w: 4, h: 2 },
        { i: "feature-adoption", x: 0, y: 3, w: 6, h: 2 },
        { i: "feedback", x: 6, y: 3, w: 6, h: 2 },
        { i: "metrics-table", x: 0, y: 5, w: 8, h: 2 },
        { i: "goals", x: 8, y: 5, w: 4, h: 2 }
      ]
    };
  }

  async saveDashboardLayout(userId: number, layout: any): Promise<any> {
    // In a real application, this would save the layout to a database
    return {
      userId,
      layout,
      savedAt: new Date().toISOString()
    };
  }
}

// Use the database storage for production
export const storage = new DatabaseStorage();