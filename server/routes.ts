import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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
        goals
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

  const httpServer = createServer(app);
  return httpServer;
}
