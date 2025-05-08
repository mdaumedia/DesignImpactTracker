import { db } from './db';
import { 
  users, features, designMetrics, goals, feedback,
  type InsertUser, type InsertFeature, type InsertDesignMetric, 
  type InsertGoal, type InsertFeedback
} from '../shared/schema';

async function seed() {
  console.log('🌱 Seeding database...');
  
  try {
    // Clear existing data
    await db.delete(feedback);
    await db.delete(goals);
    await db.delete(designMetrics);
    await db.delete(features);
    await db.delete(users);
    
    console.log('✓ Deleted existing data');
    
    // Create sample features
    const featuresData: InsertFeature[] = [
      { name: "Payments", description: "Payment processing and management", iconName: "payments" },
      { name: "Accounts", description: "Account management and settings", iconName: "account_balance" },
      { name: "Investments", description: "Investment portfolios and tracking", iconName: "trending_up" },
      { name: "Dashboard", description: "User dashboard and analytics", iconName: "dashboard" },
    ];
    
    const createdFeatures = await db.insert(features).values(
      featuresData.map(f => ({ ...f, lastUpdated: new Date() }))
    ).returning();
    
    console.log(`✓ Created ${createdFeatures.length} features`);
    
    // Create sample metrics for each feature
    const metricTypes = ["impact_score", "design_velocity", "adoption_rate", "usability_score"];
    const userSegments = ["power", "casual", "new"];
    const platforms = ["web", "ios", "android"];
    
    // Generate metrics for the last 6 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    const metricsToInsert: InsertDesignMetric[] = [];
    
    // Generate sample metrics
    for (let featureIndex = 0; featureIndex < createdFeatures.length; featureIndex++) {
      const feature = createdFeatures[featureIndex];
      
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
              
              metricsToInsert.push({
                metricName: metricType,
                metricValue: adjustedValue,
                recordedAt: date,
                featureId: feature.id.toString(),
                userSegment: segment,
                platformType: platform
              });
            }
          }
        }
      }
    }
    
    // Insert metrics in chunks to avoid exceeding query limits
    const chunkSize = 100;
    for (let i = 0; i < metricsToInsert.length; i += chunkSize) {
      const chunk = metricsToInsert.slice(i, i + chunkSize);
      await db.insert(designMetrics).values(chunk);
    }
    
    console.log(`✓ Created ${metricsToInsert.length} metrics`);
    
    // Create sample goals
    const goalsData: InsertGoal[] = [
      { name: "Design System Adoption", currentValue: 76, targetValue: 80, unit: "%", color: "primary" },
      { name: "Design Velocity", currentValue: 3.8, targetValue: 3.0, unit: "days", color: "amber" },
      { name: "Usability Score", currentValue: 92.7, targetValue: 90, unit: "", color: "secondary" },
      { name: "Component Reuse", currentValue: 68, targetValue: 75, unit: "%", color: "primary" },
      { name: "Design Consistency", currentValue: 89, targetValue: 95, unit: "%", color: "amber" },
    ];
    
    const createdGoals = await db.insert(goals).values(
      goalsData.map(g => ({ ...g, createdAt: new Date() }))
    ).returning();
    
    console.log(`✓ Created ${createdGoals.length} goals`);
    
    // Create sample feedback
    const feedbackData: InsertFeedback[] = [
      {
        userInitials: "MS", 
        userColorClass: "bg-amber-100 text-amber-700",
        content: "New dashboard is much cleaner!",
        description: "The layout makes it easier to find what I need quickly.",
        rating: 5,
        featureId: createdFeatures[0].id,
      },
      {
        userInitials: "AK", 
        userColorClass: "bg-primary-100 text-primary-700",
        content: "Transaction list is more readable",
        description: "The new typography makes scanning much faster.",
        rating: 4,
        featureId: createdFeatures[1].id,
      },
      {
        userInitials: "DP", 
        userColorClass: "bg-secondary-100 text-secondary-700",
        content: "Investment charts are intuitive",
        description: "I can understand my portfolio performance at a glance now.",
        rating: 5,
        featureId: createdFeatures[2].id,
      },
    ];
    
    const createdFeedback = await db.insert(feedback).values(
      feedbackData.map(f => ({ ...f, createdAt: new Date() }))
    ).returning();
    
    console.log(`✓ Created ${createdFeedback.length} feedback items`);
    
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed().catch(console.error);