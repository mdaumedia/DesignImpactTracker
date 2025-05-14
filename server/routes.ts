import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { etlService } from "./services/etl";
import { insertDataConnectionSchema, insertDesignInsightSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard API endpoint
  app.get("/api/dashboard", async (req, res) => {
    try {
      // Get metrics summary data
      const impactScore = await storage.getSummaryMetric("impact_score");
      const velocity = await storage.getSummaryMetric("design_velocity");
      const adoption = await storage.getSummaryMetric("adoption_rate");
      const usability = await storage.getSummaryMetric("usability_score");
      
      // Get time series data for charts
      const velocityTrend = await storage.getTimeSeriesData("design_velocity");
      const impactRetentionCorrelation = await storage.getCorrelationData("design_impact", "user_retention");
      const featureAdoption = await storage.getFeatureAdoptionByPersona();
      
      // Get feature metrics table data
      const featureMetrics = await storage.getFeatureMetrics();
      
      // Get user feedback and goals data
      const feedback = await storage.getUserFeedback();
      const goals = await storage.getDesignGoals();
      
      // Get design system maturity, usage, and adoption data
      const maturityDimensions = await storage.getDesignSystemMaturity();
      const usageByDepartment = await storage.getDesignSystemUsage();
      const adoptionTrends = await storage.getAdoptionTrends();
      
      // Return compiled dashboard data
      res.json({
        impactScore,
        velocity,
        adoption,
        usability,
        velocityTrend,
        impactRetentionCorrelation,
        featureAdoption,
        featureMetrics,
        feedback,
        goals,
        maturityDimensions,
        usageByDepartment,
        adoptionTrends
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to load dashboard data" });
    }
  });

  // Get metrics by feature
  app.get("/api/metrics/features/:featureId", async (req, res) => {
    try {
      const featureId = req.params.featureId;
      const metrics = await storage.getMetricsByFeature(featureId);
      res.json(metrics);
    } catch (error) {
      console.error(`Error fetching metrics for feature ${req.params.featureId}:`, error);
      res.status(500).json({ message: "Failed to load feature metrics" });
    }
  });

  // Get metrics by time range
  app.get("/api/metrics/timerange", async (req, res) => {
    try {
      const { start, end, metricType } = req.query;
      if (!start || !end) {
        return res.status(400).json({ message: "Start and end dates are required" });
      }
      
      const metrics = await storage.getMetricsByTimeRange(
        start as string,
        end as string,
        metricType as string
      );
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics by time range:", error);
      res.status(500).json({ message: "Failed to load metrics for time range" });
    }
  });

  // Get user feedback
  app.get("/api/feedback", async (req, res) => {
    try {
      const feedback = await storage.getUserFeedback();
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching user feedback:", error);
      res.status(500).json({ message: "Failed to load user feedback" });
    }
  });

  // Get design goals
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getDesignGoals();
      res.json(goals);
    } catch (error) {
      console.error("Error fetching design goals:", error);
      res.status(500).json({ message: "Failed to load design goals" });
    }
  });
  
  // Get design system maturity data
  app.get("/api/design-system/maturity", async (req, res) => {
    try {
      const maturityData = await storage.getDesignSystemMaturity();
      res.json(maturityData);
    } catch (error) {
      console.error("Error fetching design system maturity data:", error);
      res.status(500).json({ message: "Failed to load design system maturity data" });
    }
  });
  
  // Get design system usage by department
  app.get("/api/design-system/usage", async (req, res) => {
    try {
      const usageData = await storage.getDesignSystemUsage();
      res.json(usageData);
    } catch (error) {
      console.error("Error fetching design system usage data:", error);
      res.status(500).json({ message: "Failed to load design system usage data" });
    }
  });
  
  // Get design system adoption trends
  app.get("/api/design-system/adoption-trends", async (req, res) => {
    try {
      const trendData = await storage.getAdoptionTrends();
      res.json(trendData);
    } catch (error) {
      console.error("Error fetching design system adoption trends:", error);
      res.status(500).json({ message: "Failed to load design system adoption trends" });
    }
  });

  // ============= ADVANCED FEATURE ROUTES =============

  // Data Connections API routes
  app.get("/api/data-connections", async (req, res) => {
    try {
      const connections = await storage.getDataConnections();
      res.json(connections);
    } catch (error) {
      console.error("Error fetching data connections:", error);
      res.status(500).json({ message: "Failed to fetch data connections" });
    }
  });

  app.post("/api/data-connections", async (req, res) => {
    try {
      const data = insertDataConnectionSchema.parse(req.body);
      const connection = await storage.createDataConnection(data);
      res.json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating data connection:", error);
      res.status(500).json({ message: "Failed to create data connection" });
    }
  });

  app.post("/api/data-connections/:id/sync", async (req, res) => {
    try {
      const id = req.params.id;
      const result = await storage.syncDataConnection(id);
      res.json(result);
    } catch (error) {
      console.error(`Error syncing data connection ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to sync data connection" });
    }
  });

  // Design Insights API routes
  app.get("/api/design-insights", async (req, res) => {
    try {
      const insights = await storage.getDesignInsights();
      res.json(insights);
    } catch (error) {
      console.error("Error fetching design insights:", error);
      res.status(500).json({ message: "Failed to fetch design insights" });
    }
  });

  app.post("/api/design-insights", async (req, res) => {
    try {
      const data = insertDesignInsightSchema.parse(req.body);
      const insight = await storage.createDesignInsight(data);
      res.json(insight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating design insight:", error);
      res.status(500).json({ message: "Failed to create design insight" });
    }
  });

  app.patch("/api/design-insights/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { pinned, seen } = req.body;
      
      const updatedInsight = await storage.updateDesignInsight(id, { pinned, seen });
      res.json(updatedInsight);
    } catch (error) {
      console.error(`Error updating design insight ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update insight" });
    }
  });

  // Gamification API routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const userId = 1; // For demo purposes; in a real app this would use authenticated user ID
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/user-gamification-stats", async (req, res) => {
    try {
      const userId = 1; // For demo purposes; in a real app this would use authenticated user ID
      const userLevel = await storage.getUserLevel(userId);
      const userPoints = await storage.getUserPoints(userId);
      const pointsToNextLevel = await storage.getPointsToNextLevel(userId);
      
      res.json({
        userLevel,
        userPoints,
        pointsToNextLevel
      });
    } catch (error) {
      console.error("Error fetching user gamification stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Dashboard layout customization
  app.get("/api/dashboard-layout", async (req, res) => {
    try {
      const userId = 1; // For demo purposes; in a real app this would use authenticated user ID
      const layout = await storage.getDashboardLayout(userId);
      res.json(layout);
    } catch (error) {
      console.error("Error fetching dashboard layout:", error);
      res.status(500).json({ message: "Failed to fetch dashboard layout" });
    }
  });

  app.post("/api/dashboard-layout", async (req, res) => {
    try {
      const userId = 1; // For demo purposes; in a real app this would use authenticated user ID
      const { layout } = req.body;
      const savedLayout = await storage.saveDashboardLayout(userId, layout);
      res.json(savedLayout);
    } catch (error) {
      console.error("Error saving dashboard layout:", error);
      res.status(500).json({ message: "Failed to save dashboard layout" });
    }
  });

  // AI integration endpoint
  app.post("/api/analyze-design-data", async (req, res) => {
    try {
      // This would connect to OpenAI or another AI service in the future
      res.json({
        success: true,
        message: "Analysis request received. AI integration will be implemented when API key is provided."
      });
    } catch (error) {
      console.error("Error analyzing design data:", error);
      res.status(500).json({ message: "Failed to analyze design data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
