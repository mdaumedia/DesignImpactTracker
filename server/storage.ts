import {
  users, features, designMetrics, goals, feedback,
  type User, type Feature, type DesignMetric, type Goal, type Feedback,
  type InsertUser, type InsertFeature, type InsertDesignMetric, type InsertGoal, type InsertFeedback
} from "@shared/schema";

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
}

// For backward compatibility and development purposes
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
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Create sample features
    const featuresData: InsertFeature[] = [
      { name: "Payments", description: "Payment processing and management", iconName: "payments" },
      { name: "Accounts", description: "Account management and settings", iconName: "account_balance" },
      { name: "Investments", description: "Investment portfolios and tracking", iconName: "trending_up" },
      { name: "Dashboard", description: "User dashboard and analytics", iconName: "dashboard" },
    ];
    
    featuresData.forEach(feature => this.createFeature(feature));
    
    // Create sample metrics for each feature
    const metricTypes = ["impact_score", "design_velocity", "adoption_rate", "usability_score"];
    const userSegments = ["power", "casual", "new"];
    const platforms = ["web", "ios", "android"];
    
    // Generate metrics for the last 6 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    // Generate sample metrics
    for (let feature = 1; feature <= 4; feature++) {
      for (let i = 0; i < 6; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        
        for (const metricType of metricTypes) {
          // Base value that improves over time
          let baseValue = 0;
          switch (metricType) {
            case "impact_score":
              baseValue = 75 + i * 2 + Math.random() * 5;
              break;
            case "design_velocity":
              baseValue = 6 - i * 0.4 + Math.random() * 1; // Lower is better
              break;
            case "adoption_rate":
              baseValue = 60 + i * 3 + Math.random() * 5;
              break;
            case "usability_score":
              baseValue = 82 + i * 2 + Math.random() * 3;
              break;
          }
          
          // Add metrics for different segments and platforms
          for (const segment of userSegments) {
            for (const platform of platforms) {
              const segmentFactor = segment === "power" ? 1.1 : segment === "casual" ? 1.0 : 0.9;
              const platformFactor = platform === "web" ? 1.05 : platform === "ios" ? 1.0 : 0.95;
              
              const adjustedValue = baseValue * segmentFactor * platformFactor;
              
              this.createMetric({
                metricName: metricType,
                metricValue: adjustedValue,
                recordedAt: date,
                featureId: feature.toString(),
                userSegment: segment,
                platformType: platform
              });
            }
          }
        }
      }
    }
    
    // Create sample goals
    const goalsData: InsertGoal[] = [
      { name: "Design System Adoption", currentValue: 76, targetValue: 80, unit: "%", color: "primary" },
      { name: "Design Velocity", currentValue: 3.8, targetValue: 3.0, unit: "days", color: "amber" },
      { name: "Usability Score", currentValue: 92.7, targetValue: 90, unit: "", color: "secondary" },
      { name: "Component Reuse", currentValue: 68, targetValue: 75, unit: "%", color: "primary" },
      { name: "Design Consistency", currentValue: 89, targetValue: 95, unit: "%", color: "amber" },
    ];
    
    goalsData.forEach(goal => this.createGoal(goal));
    
    // Create sample feedback
    const feedbackData: InsertFeedback[] = [
      {
        userInitials: "MS", 
        userColorClass: "bg-amber-100 text-amber-700",
        content: "New dashboard is much cleaner!",
        description: "The layout makes it easier to find what I need quickly.",
        rating: 5,
        featureId: 1,
      },
      {
        userInitials: "AK", 
        userColorClass: "bg-primary-100 text-primary-700",
        content: "Transaction list is more readable",
        description: "The new typography makes scanning much faster.",
        rating: 4,
        featureId: 2,
      },
      {
        userInitials: "DP", 
        userColorClass: "bg-secondary-100 text-secondary-700",
        content: "Investment charts are intuitive",
        description: "I can understand my portfolio performance at a glance now.",
        rating: 5,
        featureId: 3,
      },
    ];
    
    feedbackData.forEach(item => this.createFeedback(item));
  }
  
  // User management methods (from existing storage)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Design dashboard specific methods
  async getSummaryMetric(metricName: string): Promise<SummaryMetric> {
    // Derive the latest metric value and change
    const metrics = Array.from(this.designMetrics.values())
      .filter(m => m.metricName === metricName)
      .sort((a, b) => {
        return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
      });
    
    // Calculate average for latest month
    const latestMonth = new Date(metrics[0].recordedAt).getMonth();
    const latestMetrics = metrics.filter(m => new Date(m.recordedAt).getMonth() === latestMonth);
    const latestAvg = latestMetrics.reduce((sum, m) => sum + m.metricValue, 0) / latestMetrics.length;
    
    // Calculate average for previous month
    const previousMonth = latestMonth === 0 ? 11 : latestMonth - 1;
    const previousMetrics = metrics.filter(m => new Date(m.recordedAt).getMonth() === previousMonth);
    const previousAvg = previousMetrics.length > 0 
      ? previousMetrics.reduce((sum, m) => sum + m.metricValue, 0) / previousMetrics.length
      : latestAvg * 0.9; // fallback
    
    // Calculate change percentage
    let change = ((latestAvg - previousAvg) / previousAvg) * 100;
    // For design_velocity, lower is better, so invert the change
    if (metricName === "design_velocity") {
      change = -change;
    }
    
    // Get trend direction
    const trend = change > 0 ? "up" : change < 0 ? "down" : "none";
    
    // Prepare trend data for charts if needed
    const trendData = metricName === "design_velocity" || metricName === "usability_score"
      ? metrics.slice(0, 6).map(m => m.metricValue).reverse()
      : undefined;
    
    return {
      value: parseFloat(latestAvg.toFixed(1)),
      change: parseFloat(Math.abs(change).toFixed(1)),
      trend,
      trendData,
    };
  }

  async getTimeSeriesData(metricName: string): Promise<TimeSeriesData> {
    const metrics = Array.from(this.designMetrics.values())
      .filter(m => m.metricName === metricName)
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
    
    // Group by month and average
    const monthlyData = new Map<string, number[]>();
    
    metrics.forEach(metric => {
      const date = new Date(metric.recordedAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, []);
      }
      
      monthlyData.get(monthKey)!.push(metric.metricValue);
    });
    
    // Convert to array of {date, value} objects
    return Array.from(monthlyData.entries())
      .map(([monthKey, values]) => {
        const [year, month] = monthKey.split('-').map(Number);
        const date = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
        const value = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        return {
          date,
          value: parseFloat(value.toFixed(1))
        };
      })
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.date) - months.indexOf(b.date);
      });
  }

  async getCorrelationData(metric1: string, metric2: string): Promise<CorrelationData> {
    // Group metrics by feature and month to correlate them
    const metricPairs = new Map<string, { m1: number[], m2: number[] }>();
    
    const metric1Data = Array.from(this.designMetrics.values())
      .filter(m => m.metricName === metric1);
    
    const metric2Data = Array.from(this.designMetrics.values())
      .filter(m => m.metricName === metric2);
    
    // For this example, we'll create synthetic data since we don't have user_retention
    // This would typically come from another data source
    return [
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
  }

  async getFeatureAdoptionByPersona(): Promise<FeatureAdoptionData> {
    const results: FeatureAdoptionData = [];
    
    // Get all features
    const allFeatures = Array.from(this.features.values());
    
    // Get adoption metrics
    const adoptionMetrics = Array.from(this.designMetrics.values())
      .filter(m => m.metricName === "adoption_rate");
    
    // Group by feature and persona
    allFeatures.forEach(feature => {
      const featureMetrics = adoptionMetrics.filter(m => m.featureId === feature.id.toString());
      
      // Get latest metrics for each persona
      const latest = new Map<string, DesignMetric[]>();
      
      featureMetrics.forEach(metric => {
        const segment = metric.userSegment || "unknown";
        
        if (!latest.has(segment)) {
          latest.set(segment, []);
        }
        
        latest.get(segment)!.push(metric);
      });
      
      // Calculate average for each persona
      const powerUsers = latest.has("power") 
        ? latest.get("power")!.reduce((sum, m) => sum + m.metricValue, 0) / latest.get("power")!.length
        : 0;
        
      const casualUsers = latest.has("casual") 
        ? latest.get("casual")!.reduce((sum, m) => sum + m.metricValue, 0) / latest.get("casual")!.length
        : 0;
        
      const newUsers = latest.has("new") 
        ? latest.get("new")!.reduce((sum, m) => sum + m.metricValue, 0) / latest.get("new")!.length
        : 0;
      
      results.push({
        feature: feature.name,
        powerUsers: Math.round(powerUsers),
        casualUsers: Math.round(casualUsers),
        newUsers: Math.round(newUsers)
      });
    });
    
    return results;
  }

  async getFeatureMetrics(): Promise<FeatureMetric[]> {
    const results: FeatureMetric[] = [];
    
    // Get all features
    const allFeatures = Array.from(this.features.values());
    
    for (const feature of allFeatures) {
      // Get metrics for this feature
      const featureMetrics = Array.from(this.designMetrics.values())
        .filter(m => m.featureId === feature.id.toString());
      
      // Group metrics by type and get latest values
      const metricsByType = new Map<string, DesignMetric[]>();
      
      featureMetrics.forEach(metric => {
        if (!metricsByType.has(metric.metricName)) {
          metricsByType.set(metric.metricName, []);
        }
        
        metricsByType.get(metric.metricName)!.push(metric);
      });
      
      // Calculate latest values and changes
      const getLatestAndChange = (metricName: string): { value: number; change: number; trend: "up" | "down" | "none" } => {
        if (!metricsByType.has(metricName)) {
          return { value: 0, change: 0, trend: "none" };
        }
        
        const metrics = metricsByType.get(metricName)!
          .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
        
        // Calculate average for latest month
        const latestMonth = new Date(metrics[0].recordedAt).getMonth();
        const latestMetrics = metrics.filter(m => new Date(m.recordedAt).getMonth() === latestMonth);
        const latestAvg = latestMetrics.reduce((sum, m) => sum + m.metricValue, 0) / latestMetrics.length;
        
        // Calculate average for previous month
        const previousMonth = latestMonth === 0 ? 11 : latestMonth - 1;
        const previousMetrics = metrics.filter(m => new Date(m.recordedAt).getMonth() === previousMonth);
        const previousAvg = previousMetrics.length > 0 
          ? previousMetrics.reduce((sum, m) => sum + m.metricValue, 0) / previousMetrics.length
          : latestAvg * 0.9; // fallback
        
        // Calculate change percentage
        let change = ((latestAvg - previousAvg) / previousAvg) * 100;
        
        // For design_velocity, lower is better, so invert the trend
        let trend: "up" | "down" | "none";
        if (metricName === "design_velocity") {
          trend = change < 0 ? "up" : change > 0 ? "down" : "none";
        } else {
          trend = change > 0 ? "up" : change < 0 ? "down" : "none";
        }
        
        return { 
          value: parseFloat(latestAvg.toFixed(1)), 
          change: parseFloat(Math.abs(change).toFixed(1)), 
          trend 
        };
      };
      
      const impactScore = getLatestAndChange("impact_score");
      const adoptionRate = getLatestAndChange("adoption_rate");
      const designVelocity = getLatestAndChange("design_velocity");
      const usabilityScore = getLatestAndChange("usability_score");
      
      results.push({
        id: feature.id.toString(),
        feature: {
          name: feature.name,
          icon: feature.iconName || "extension",
          lastUpdated: this.timeAgo(new Date(feature.lastUpdated!))
        },
        impactScore,
        adoptionRate,
        timeToDesign: {
          value: `${designVelocity.value} days`,
          change: designVelocity.change,
          trend: designVelocity.trend
        },
        usabilityScore
      });
    }
    
    return results;
  }

  async getUserFeedback(): Promise<FeedbackItem[]> {
    const results: FeedbackItem[] = [];
    
    // Get all feedback items
    const allFeedback = Array.from(this.userFeedback.values());
    
    // Sort by most recent
    allFeedback.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    // Map to the required format
    for (const item of allFeedback) {
      const feature = await this.getFeature(item.featureId);
      
      results.push({
        id: item.id.toString(),
        user: {
          initials: item.userInitials,
          color: item.userColorClass
        },
        content: item.content,
        description: item.description || "",
        rating: item.rating,
        feature: feature ? `${feature.name} Feature` : "Unknown Feature"
      });
    }
    
    return results;
  }

  async getDesignGoals(): Promise<GoalItem[]> {
    const results: GoalItem[] = [];
    
    // Get all goals
    const allGoals = Array.from(this.designGoals.values());
    
    // Map to the required format
    for (const goal of allGoals) {
      const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
      
      results.push({
        id: goal.id.toString(),
        name: goal.name,
        current: goal.currentValue,
        target: goal.targetValue,
        progress,
        color: goal.color as "primary" | "secondary" | "amber",
        unit: goal.unit
      });
    }
    
    return results;
  }

  // Filtered queries
  async getMetricsByFeature(featureId: string): Promise<DesignMetric[]> {
    return Array.from(this.designMetrics.values())
      .filter(m => m.featureId === featureId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  }

  async getMetricsByTimeRange(startDate: string, endDate: string, metricType?: string): Promise<DesignMetric[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return Array.from(this.designMetrics.values())
      .filter(m => {
        const recordDate = new Date(m.recordedAt);
        return recordDate >= start && recordDate <= end && 
          (!metricType || m.metricName === metricType);
      })
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
  }
  
  // Data creation methods
  async getFeature(id: number): Promise<Feature | undefined> {
    return this.features.get(id);
  }
  
  async createFeature(feature: InsertFeature): Promise<Feature> {
    const id = this.currentFeatureId++;
    const newFeature: Feature = {
      ...feature,
      id,
      lastUpdated: new Date()
    };
    
    this.features.set(id, newFeature);
    return newFeature;
  }
  
  async createMetric(metric: InsertDesignMetric): Promise<DesignMetric> {
    const id = this.currentMetricId++;
    const newMetric: DesignMetric = {
      ...metric,
      id
    };
    
    this.designMetrics.set(id, newMetric);
    return newMetric;
  }
  
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = this.currentGoalId++;
    const newGoal: Goal = {
      ...goal,
      id,
      createdAt: new Date()
    };
    
    this.designGoals.set(id, newGoal);
    return newGoal;
  }
  
  async createFeedback(feedbackItem: InsertFeedback): Promise<Feedback> {
    const id = this.currentFeedbackId++;
    const newFeedback: Feedback = {
      ...feedbackItem,
      id,
      createdAt: new Date()
    };
    
    this.userFeedback.set(id, newFeedback);
    return newFeedback;
  }
  
  // Design system maturity, usage and adoption methods
  async getDesignSystemMaturity(): Promise<MaturityDimension[]> {
    // In a real implementation, this data would come from a database or API
    return [
      { name: "Component Coverage", score: 78, fullMark: 100 },
      { name: "Documentation", score: 65, fullMark: 100 },
      { name: "Governance", score: 82, fullMark: 100 },
      { name: "Team Adoption", score: 75, fullMark: 100 },
      { name: "Versioning", score: 87, fullMark: 100 },
      { name: "Accessibility", score: 70, fullMark: 100 },
    ];
  }

  async getDesignSystemUsage(): Promise<UsageData[]> {
    // In a real implementation, this data would come from a database or API
    return [
      { department: "UX Team", usage: 92, target: 90, color: "#6366f1" },
      { department: "Frontend", usage: 85, target: 80, color: "#22c55e" },
      { department: "Mobile", usage: 68, target: 75, color: "#f59e0b" },
      { department: "Marketing", usage: 45, target: 60, color: "#ef4444" },
      { department: "Internal Tools", usage: 78, target: 70, color: "#8b5cf6" },
    ];
  }

  async getAdoptionTrends(): Promise<AdoptionTrendData[]> {
    // In a real implementation, this data would be derived from metrics or come from a database
    return [
      { date: "Q1 2023", components: 45, patterns: 30, tokens: 65 },
      { date: "Q2 2023", components: 58, patterns: 42, tokens: 78 },
      { date: "Q3 2023", components: 67, patterns: 55, tokens: 85 },
      { date: "Q4 2023", components: 73, patterns: 65, tokens: 92 },
      { date: "Q1 2024", components: 79, patterns: 72, tokens: 95 },
      { date: "Q2 2024", components: 85, patterns: 78, tokens: 98 },
    ];
  }
  
  // Helper function to format time ago
  private timeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} months ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  }
}

// DatabaseStorage implementation
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { db } from "./db";

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
    // Fetch metrics of the specified type
    const metrics = await db.select()
      .from(designMetrics)
      .where(eq(designMetrics.metricName, metricName))
      .orderBy(desc(designMetrics.recordedAt));

    if (metrics.length === 0) {
      return {
        value: 0,
        change: 0,
        trend: "none"
      };
    }
    
    // Group by month for latest data
    const latestDate = new Date(metrics[0].recordedAt);
    const latestMonth = latestDate.getMonth();
    const latestYear = latestDate.getFullYear();
    
    const latestMetrics = metrics.filter(m => {
      const date = new Date(m.recordedAt);
      return date.getMonth() === latestMonth && date.getFullYear() === latestYear;
    });
    
    const latestAvg = latestMetrics.reduce((sum, m) => sum + m.metricValue, 0) / latestMetrics.length;
    
    // Get previous month data
    const previousMonth = latestMonth === 0 ? 11 : latestMonth - 1;
    const previousYear = latestMonth === 0 ? latestYear - 1 : latestYear;
    
    const previousMetrics = metrics.filter(m => {
      const date = new Date(m.recordedAt);
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
    });
    
    // If no previous month data, assume 10% less than current
    const previousAvg = previousMetrics.length > 0
      ? previousMetrics.reduce((sum, m) => sum + m.metricValue, 0) / previousMetrics.length
      : latestAvg * 0.9;
    
    // Calculate change percentage
    let change = ((latestAvg - previousAvg) / previousAvg) * 100;
    // For design_velocity, lower is better, so invert the change
    if (metricName === "design_velocity") {
      change = -change;
    }
    
    // Get trend direction
    const trend = change > 0 ? "up" : change < 0 ? "down" : "none";
    
    // Prepare trend data for sparkline charts
    const trendData = metricName === "design_velocity" || metricName === "usability_score"
      ? metrics.slice(0, 6).map(m => m.metricValue).reverse()
      : undefined;
    
    return {
      value: parseFloat(latestAvg.toFixed(1)),
      change: parseFloat(Math.abs(change).toFixed(1)),
      trend,
      trendData,
    };
  }
  
  async getTimeSeriesData(metricName: string): Promise<TimeSeriesData> {
    const metrics = await db.select()
      .from(designMetrics)
      .where(eq(designMetrics.metricName, metricName))
      .orderBy(designMetrics.recordedAt);
    
    // Group by month
    const monthlyData = new Map<string, number[]>();
    
    metrics.forEach(metric => {
      const date = new Date(metric.recordedAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, []);
      }
      
      monthlyData.get(monthKey)!.push(metric.metricValue);
    });
    
    // Calculate average for each month
    return Array.from(monthlyData.entries())
      .map(([monthKey, values]) => {
        const [year, month] = monthKey.split('-').map(Number);
        const date = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
        const value = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        return {
          date,
          value: parseFloat(value.toFixed(1))
        };
      })
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.date) - months.indexOf(b.date);
      });
  }
  
  async getCorrelationData(metric1: string, metric2: string): Promise<CorrelationData> {
    // This would ideally compare two metrics from the database
    // For simplicity with the current schema, returning sample data
    return [
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
  }
  
  async getFeatureAdoptionByPersona(): Promise<FeatureAdoptionData> {
    // Get all features
    const allFeatures = await db.select().from(features);
    
    // Get adoption metrics
    const adoptionMetrics = await db.select()
      .from(designMetrics)
      .where(eq(designMetrics.metricName, "adoption_rate"));
    
    const results: FeatureAdoptionData = [];
    
    // Calculate adoption rates for each feature by persona
    for (const feature of allFeatures) {
      const featureMetrics = adoptionMetrics.filter(m => m.featureId === feature.id.toString());
      
      // Group by user segment
      const segmentMetrics = new Map<string, DesignMetric[]>();
      
      featureMetrics.forEach(metric => {
        const segment = metric.userSegment || "unknown";
        
        if (!segmentMetrics.has(segment)) {
          segmentMetrics.set(segment, []);
        }
        
        segmentMetrics.get(segment)!.push(metric);
      });
      
      // Calculate average for each persona
      const powerUsers = segmentMetrics.has("power") 
        ? segmentMetrics.get("power")!.reduce((sum, m) => sum + m.metricValue, 0) / segmentMetrics.get("power")!.length
        : 0;
        
      const casualUsers = segmentMetrics.has("casual") 
        ? segmentMetrics.get("casual")!.reduce((sum, m) => sum + m.metricValue, 0) / segmentMetrics.get("casual")!.length
        : 0;
        
      const newUsers = segmentMetrics.has("new") 
        ? segmentMetrics.get("new")!.reduce((sum, m) => sum + m.metricValue, 0) / segmentMetrics.get("new")!.length
        : 0;
      
      results.push({
        feature: feature.name,
        powerUsers: Math.round(powerUsers),
        casualUsers: Math.round(casualUsers),
        newUsers: Math.round(newUsers)
      });
    }
    
    return results;
  }
  
  async getFeatureMetrics(): Promise<FeatureMetric[]> {
    // Get all features
    const allFeatures = await db.select().from(features);
    const results: FeatureMetric[] = [];
    
    for (const feature of allFeatures) {
      // Get metrics for this feature
      const featureMetrics = await db.select()
        .from(designMetrics)
        .where(eq(designMetrics.featureId, feature.id.toString()));
      
      // Group metrics by type
      const metricsByType = new Map<string, DesignMetric[]>();
      
      featureMetrics.forEach(metric => {
        if (!metricsByType.has(metric.metricName)) {
          metricsByType.set(metric.metricName, []);
        }
        
        metricsByType.get(metric.metricName)!.push(metric);
      });
      
      // Calculate latest values and changes
      const getLatestAndChange = (metricName: string): { value: number; change: number; trend: "up" | "down" | "none" } => {
        if (!metricsByType.has(metricName)) {
          return { value: 0, change: 0, trend: "none" };
        }
        
        const metrics = metricsByType.get(metricName)!
          .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
        
        // Latest month metrics
        const latestDate = new Date(metrics[0].recordedAt);
        const latestMonth = latestDate.getMonth();
        const latestYear = latestDate.getFullYear();
        
        const latestMetrics = metrics.filter(m => {
          const date = new Date(m.recordedAt);
          return date.getMonth() === latestMonth && date.getFullYear() === latestYear;
        });
        
        const latestAvg = latestMetrics.reduce((sum, m) => sum + m.metricValue, 0) / latestMetrics.length;
        
        // Previous month metrics
        const previousMonth = latestMonth === 0 ? 11 : latestMonth - 1;
        const previousYear = latestMonth === 0 ? latestYear - 1 : latestYear;
        
        const previousMetrics = metrics.filter(m => {
          const date = new Date(m.recordedAt);
          return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
        });
        
        // If no previous data, assume 10% improvement
        const previousAvg = previousMetrics.length > 0
          ? previousMetrics.reduce((sum, m) => sum + m.metricValue, 0) / previousMetrics.length
          : latestAvg * 0.9;
        
        // Calculate change percentage
        let change = ((latestAvg - previousAvg) / previousAvg) * 100;
        
        // For design_velocity, lower is better
        let trend: "up" | "down" | "none";
        if (metricName === "design_velocity") {
          trend = change < 0 ? "up" : change > 0 ? "down" : "none";
        } else {
          trend = change > 0 ? "up" : change < 0 ? "down" : "none";
        }
        
        return { 
          value: parseFloat(latestAvg.toFixed(1)), 
          change: parseFloat(Math.abs(change).toFixed(1)), 
          trend 
        };
      };
      
      const impactScore = getLatestAndChange("impact_score");
      const adoptionRate = getLatestAndChange("adoption_rate");
      const designVelocity = getLatestAndChange("design_velocity");
      const usabilityScore = getLatestAndChange("usability_score");
      
      results.push({
        id: feature.id.toString(),
        feature: {
          name: feature.name,
          icon: feature.iconName || "extension",
          lastUpdated: this.timeAgo(new Date(feature.lastUpdated!))
        },
        impactScore,
        adoptionRate,
        timeToDesign: {
          value: `${designVelocity.value} days`,
          change: designVelocity.change,
          trend: designVelocity.trend
        },
        usabilityScore
      });
    }
    
    return results;
  }
  
  async getUserFeedback(): Promise<FeedbackItem[]> {
    const results: FeedbackItem[] = [];
    
    // Get all feedback items
    const allFeedback = await db.select().from(feedback);
    
    // Order by creation time
    allFeedback.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    // Format feedback items
    for (const item of allFeedback) {
      const [featureData] = await db.select()
        .from(features)
        .where(eq(features.id, Number(item.featureId)));
      
      results.push({
        id: item.id.toString(),
        user: {
          initials: item.userInitials,
          color: item.userColorClass || "bg-primary-100 text-primary-700"
        },
        content: item.content,
        description: item.description || "",
        rating: item.rating,
        feature: featureData ? `${featureData.name} Feature` : "Unknown Feature"
      });
    }
    
    return results;
  }
  
  async getDesignGoals(): Promise<GoalItem[]> {
    const allGoals = await db.select().from(goals);
    
    return allGoals.map(goal => {
      const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
      
      return {
        id: goal.id.toString(),
        name: goal.name,
        current: goal.currentValue,
        target: goal.targetValue,
        progress,
        color: (goal.color as "primary" | "secondary" | "amber") || "primary",
        unit: goal.unit || undefined
      };
    });
  }
  
  async getDesignSystemMaturity(): Promise<MaturityDimension[]> {
    // In a real implementation, this would come from the database
    // For now, returning static data until we add a dedicated table
    return [
      { name: "Component Coverage", score: 78, fullMark: 100 },
      { name: "Documentation", score: 65, fullMark: 100 },
      { name: "Governance", score: 82, fullMark: 100 },
      { name: "Team Adoption", score: 75, fullMark: 100 },
      { name: "Versioning", score: 87, fullMark: 100 },
      { name: "Accessibility", score: 70, fullMark: 100 },
    ];
  }

  async getDesignSystemUsage(): Promise<UsageData[]> {
    // In a real implementation, this would come from the database
    // For now, returning static data until we add a dedicated table
    return [
      { department: "UX Team", usage: 92, target: 90, color: "#6366f1" },
      { department: "Frontend", usage: 85, target: 80, color: "#22c55e" },
      { department: "Mobile", usage: 68, target: 75, color: "#f59e0b" },
      { department: "Marketing", usage: 45, target: 60, color: "#ef4444" },
      { department: "Internal Tools", usage: 78, target: 70, color: "#8b5cf6" },
    ];
  }

  async getAdoptionTrends(): Promise<AdoptionTrendData[]> {
    // In a real implementation, this would come from the database
    // For now, returning static data until we add a dedicated table
    return [
      { date: "Q1 2023", components: 45, patterns: 30, tokens: 65 },
      { date: "Q2 2023", components: 58, patterns: 42, tokens: 78 },
      { date: "Q3 2023", components: 67, patterns: 55, tokens: 85 },
      { date: "Q4 2023", components: 73, patterns: 65, tokens: 92 },
      { date: "Q1 2024", components: 79, patterns: 72, tokens: 95 },
      { date: "Q2 2024", components: 85, patterns: 78, tokens: 98 },
    ];
  }
  
  async getMetricsByFeature(featureId: string): Promise<DesignMetric[]> {
    return db.select()
      .from(designMetrics)
      .where(eq(designMetrics.featureId, featureId))
      .orderBy(desc(designMetrics.recordedAt));
  }
  
  async getMetricsByTimeRange(startDate: string, endDate: string, metricType?: string): Promise<DesignMetric[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let query = db.select()
      .from(designMetrics)
      .where(
        and(
          gte(designMetrics.recordedAt, start),
          lte(designMetrics.recordedAt, end)
        )
      );
    
    if (metricType) {
      query = query.where(eq(designMetrics.metricName, metricType));
    }
    
    return query.orderBy(designMetrics.recordedAt);
  }
  
  async createFeature(feature: InsertFeature): Promise<Feature> {
    const [newFeature] = await db
      .insert(features)
      .values({
        ...feature,
        lastUpdated: new Date()
      })
      .returning();
    
    return newFeature;
  }
  
  async createMetric(metric: InsertDesignMetric): Promise<DesignMetric> {
    const [newMetric] = await db
      .insert(designMetrics)
      .values({
        ...metric,
        recordedAt: metric.recordedAt || new Date()
      })
      .returning();
    
    return newMetric;
  }
  
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db
      .insert(goals)
      .values({
        ...goal,
        createdAt: new Date()
      })
      .returning();
    
    return newGoal;
  }
  
  async createFeedback(feedbackItem: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db
      .insert(feedback)
      .values({
        ...feedbackItem,
        createdAt: new Date()
      })
      .returning();
    
    return newFeedback;
  }
  
  // Helper function
  private timeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} months ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  }
}

// Use the database storage for production
export const storage = new DatabaseStorage();
