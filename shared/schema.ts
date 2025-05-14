import { pgTable, text, serial, integer, timestamp, real, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";

// Users table (keeping the existing one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Design Metrics table
export const designMetrics = pgTable("design_metrics", {
  id: serial("id").primaryKey(),
  metricName: text("metric_name").notNull(),
  metricValue: real("metric_value").notNull(),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
  featureId: text("feature_id").notNull(),
  userSegment: text("user_segment"),
  platformType: text("platform_type"),
});

export const insertDesignMetricSchema = createInsertSchema(designMetrics).omit({
  id: true,
});

// Features table
export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  iconName: text("icon_name"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertFeatureSchema = createInsertSchema(features).omit({
  id: true,
});

// Design Goals table
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  currentValue: real("current_value").notNull(),
  targetValue: real("target_value").notNull(),
  unit: text("unit"),
  color: text("color").default("primary"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
});

// User Feedback table
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userInitials: text("user_initials").notNull(),
  userColorClass: text("user_color_class").default("bg-primary-100 text-primary-700"),
  content: text("content").notNull(),
  description: text("description"),
  rating: integer("rating").notNull(),
  featureId: integer("feature_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDesignMetric = z.infer<typeof insertDesignMetricSchema>;
export type DesignMetric = typeof designMetrics.$inferSelect;

export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type Feature = typeof features.$inferSelect;

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;

// Gamification tables
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
  badgeImageUrl: text("badge_image_url"),
  pointsValue: integer("points_value").notNull().default(10),
  requiredCriteria: jsonb("required_criteria").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  active: boolean("active").notNull().default(true),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  progressData: jsonb("progress_data"),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalPoints: integer("total_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  streakDays: integer("streak_days").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// ETL Integration tables
export const dataConnections = pgTable("data_connections", {
  id: text("id").primaryKey(), // Using string IDs for easier handling
  name: text("name").notNull(),
  type: text("type").notNull(), // figma, jira, azure_analytics, google_analytics, power_bi, csv
  status: text("status").notNull().default("active"), // active, inactive, error
  credentials: jsonb("credentials").notNull(), // API keys, tokens, connection details
  createdAt: timestamp("created_at").defaultNow(),
  lastSyncAt: timestamp("last_sync_at"), // Timestamp of the last successful sync
});

export const dataImportLogs = pgTable("data_import_logs", {
  id: text("id").primaryKey(), // Using string IDs for easier handling
  connectionId: text("connection_id").notNull().references(() => dataConnections.id),
  recordsProcessed: integer("records_processed").default(0),
  success: boolean("success").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  error: text("error"), // Error message if sync failed
});

// AI Insights tables
export const designInsights = pgTable("design_insights", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  insightType: text("insight_type").notNull(), // trend, anomaly, recommendation, prediction
  relevantFeatureIds: jsonb("relevant_feature_ids").notNull(),
  metrics: jsonb("metrics").notNull(),
  confidence: real("confidence").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  seen: boolean("seen").notNull().default(false),
  pinned: boolean("pinned").notNull().default(false),
});

// Dashboard customization
export const dashboardLayouts = pgTable("dashboard_layouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  layoutConfig: jsonb("layout_config").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Create insert schemas for new tables
export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).omit({
  id: true,
});

export const insertDataConnectionSchema = createInsertSchema(dataConnections);

export const insertDataImportLogSchema = createInsertSchema(dataImportLogs);

export const insertDesignInsightSchema = createInsertSchema(designInsights).omit({
  id: true,
});

export const insertDashboardLayoutSchema = createInsertSchema(dashboardLayouts).omit({
  id: true,
});

// Export additional types
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type Leaderboard = typeof leaderboard.$inferSelect;

export type InsertDataConnection = z.infer<typeof insertDataConnectionSchema>;
export type DataConnection = typeof dataConnections.$inferSelect;

export type InsertDataImportLog = z.infer<typeof insertDataImportLogSchema>;
export type DataImportLog = typeof dataImportLogs.$inferSelect;

export type InsertDesignInsight = z.infer<typeof insertDesignInsightSchema>;
export type DesignInsight = typeof designInsights.$inferSelect;

export type InsertDashboardLayout = z.infer<typeof insertDashboardLayoutSchema>;
export type DashboardLayout = typeof dashboardLayouts.$inferSelect;
