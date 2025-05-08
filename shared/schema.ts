import { pgTable, text, serial, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
