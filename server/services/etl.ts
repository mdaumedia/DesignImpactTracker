/**
 * ETL (Extract, Transform, Load) Service
 * 
 * This service handles the connection, data extraction, transformation,
 * and loading from external data sources like Figma, Jira, and analytics platforms.
 */

import { db } from "../db";
import { dataConnections, dataImportLogs, designMetrics, type DataConnection } from "@shared/schema";
import { eq } from "drizzle-orm";
import { generateId } from "../utils";

// Define interfaces for the different data source connectors
interface DataSourceConnector {
  connect(config: any): Promise<boolean>;
  extract(config: any): Promise<any[]>;
  transform(data: any[]): Promise<any[]>;
  load(data: any[]): Promise<{ count: number; success: boolean }>;
  getLastSyncStatus(connectionId: string): Promise<{ lastSync: Date | null; status: string }>;
}

// Figma Connector Implementation
class FigmaConnector implements DataSourceConnector {
  async connect(config: any): Promise<boolean> {
    // Here we would use the Figma API to validate connection
    try {
      // In a real implementation, we'd use the Figma REST API with the provided token
      // Example: const response = await fetch(`https://api.figma.com/v1/teams/${config.teamId}`, {
      //   headers: { 'X-Figma-Token': config.apiKey }
      // });
      
      // For now, just validate that we have the required config
      if (!config.apiKey || !config.teamId) {
        throw new Error("Missing required Figma configuration");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to connect to Figma:", error);
      return false;
    }
  }

  async extract(config: any): Promise<any[]> {
    // In a real implementation, we would fetch design data from Figma
    try {
      // Example API calls to get components, styles, and usage data
      // const files = await fetch(`https://api.figma.com/v1/team/${config.teamId}/projects/${config.projectId}/files`);
      // const components = await fetch(`https://api.figma.com/v1/files/${fileKey}/components`);
      
      // For demonstration, return sample data
      return [
        { type: "component", name: "Button", variants: 4, usage: 86, lastUpdated: new Date() },
        { type: "component", name: "Card", variants: 3, usage: 52, lastUpdated: new Date() },
        { type: "style", name: "Colors", usage: 124, lastUpdated: new Date() },
        { type: "style", name: "Typography", usage: 98, lastUpdated: new Date() }
      ];
    } catch (error) {
      console.error("Failed to extract data from Figma:", error);
      return [];
    }
  }

  async transform(data: any[]): Promise<any[]> {
    // Transform Figma data into our metrics format
    return data.map(item => {
      // Map design system components and styles to our metrics
      const transformedData: any = {
        metricName: item.type === "component" ? "component_usage" : "style_usage",
        metricValue: item.usage,
        recordedAt: new Date(),
        featureId: item.type === "component" ? `component_${item.name.toLowerCase()}` : `style_${item.name.toLowerCase()}`,
        userSegment: "designers",
        platformType: "figma"
      };
      
      return transformedData;
    });
  }

  async load(data: any[]): Promise<{ count: number; success: boolean }> {
    // Load the transformed data into our database
    try {
      if (data.length === 0) {
        return { count: 0, success: true };
      }
      
      await db.insert(designMetrics).values(data);
      return { count: data.length, success: true };
    } catch (error) {
      console.error("Failed to load Figma data:", error);
      return { count: 0, success: false };
    }
  }

  async getLastSyncStatus(connectionId: string): Promise<{ lastSync: Date | null; status: string }> {
    // Get the last sync status for this connection
    try {
      const [latestLog] = await db
        .select()
        .from(dataImportLogs)
        .where(eq(dataImportLogs.connectionId, connectionId))
        .orderBy(dataImportLogs.createdAt, "desc")
        .limit(1);
      
      if (!latestLog) {
        return { lastSync: null, status: "never_synced" };
      }
      
      return { 
        lastSync: latestLog.createdAt, 
        status: latestLog.success ? "success" : "failed" 
      };
    } catch (error) {
      console.error("Failed to get last sync status:", error);
      return { lastSync: null, status: "unknown" };
    }
  }
}

// Jira Connector Implementation
class JiraConnector implements DataSourceConnector {
  async connect(config: any): Promise<boolean> {
    try {
      // In a real implementation, we'd connect to the Jira API
      // Example: const response = await fetch(`https://${config.domain}.atlassian.net/rest/api/3/project/${config.projectKey}`, {
      //   headers: { 
      //     'Authorization': `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')}`,
      //     'Accept': 'application/json'
      //   }
      // });
      
      // For now, just validate that we have the required config
      if (!config.domain || !config.apiToken || !config.email || !config.projectKey) {
        throw new Error("Missing required Jira configuration");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to connect to Jira:", error);
      return false;
    }
  }

  async extract(config: any): Promise<any[]> {
    try {
      // In a real implementation, we would fetch issue data from Jira
      // Example: const response = await fetch(`https://${config.domain}.atlassian.net/rest/api/3/search?jql=project=${config.projectKey} AND labels=design-impact`);
      
      // For demonstration, return sample data
      return [
        { key: "FIN-123", summary: "Update payment flow design", status: "Done", labels: ["design-impact", "ux-improvement"], created: new Date(), resolved: new Date() },
        { key: "FIN-145", summary: "Dashboard component inconsistency", status: "In Progress", labels: ["design-impact", "bug"], created: new Date(), resolved: null },
        { key: "FIN-167", summary: "Improve account section navigation", status: "Done", labels: ["design-impact", "enhancement"], created: new Date(), resolved: new Date() }
      ];
    } catch (error) {
      console.error("Failed to extract data from Jira:", error);
      return [];
    }
  }

  async transform(data: any[]): Promise<any[]> {
    // Transform Jira data into our metrics format
    return data.flatMap(item => {
      const metrics = [];
      
      // Extract feature from issue summary (in reality, we would have a more robust mapping)
      const featureMatch = item.summary.match(/(dashboard|payment|account)/i);
      const feature = featureMatch ? featureMatch[0].toLowerCase() : "other";
      
      // Calculate time to resolution for completed issues
      if (item.status === "Done" && item.resolved) {
        const timeToResolution = Math.round((new Date(item.resolved).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24));
        
        metrics.push({
          metricName: "design_time_to_resolution",
          metricValue: timeToResolution,
          recordedAt: new Date(),
          featureId: feature,
          userSegment: "all",
          platformType: "jira"
        });
      }
      
      // Count design impact issues by feature
      metrics.push({
        metricName: "design_issue_count",
        metricValue: 1,
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "jira"
      });
      
      return metrics;
    });
  }

  async load(data: any[]): Promise<{ count: number; success: boolean }> {
    // Load the transformed data into our database
    try {
      if (data.length === 0) {
        return { count: 0, success: true };
      }
      
      await db.insert(designMetrics).values(data);
      return { count: data.length, success: true };
    } catch (error) {
      console.error("Failed to load Jira data:", error);
      return { count: 0, success: false };
    }
  }

  async getLastSyncStatus(connectionId: string): Promise<{ lastSync: Date | null; status: string }> {
    // Get the last sync status for this connection
    try {
      const [latestLog] = await db
        .select()
        .from(dataImportLogs)
        .where(eq(dataImportLogs.connectionId, connectionId))
        .orderBy(dataImportLogs.createdAt, "desc")
        .limit(1);
      
      if (!latestLog) {
        return { lastSync: null, status: "never_synced" };
      }
      
      return { 
        lastSync: latestLog.createdAt, 
        status: latestLog.success ? "success" : "failed" 
      };
    } catch (error) {
      console.error("Failed to get last sync status:", error);
      return { lastSync: null, status: "unknown" };
    }
  }
}

// Google Analytics Connector Implementation
class GoogleAnalyticsConnector implements DataSourceConnector {
  async connect(config: any): Promise<boolean> {
    try {
      // In a real implementation, we'd connect to the Google Analytics API
      // Example: const auth = new google.auth.JWT(config.clientEmail, null, config.privateKey, ['https://www.googleapis.com/auth/analytics.readonly']);
      
      // For now, just validate that we have the required config
      if (!config.viewId || !config.clientEmail || !config.privateKey) {
        throw new Error("Missing required Google Analytics configuration");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to connect to Google Analytics:", error);
      return false;
    }
  }

  async extract(config: any): Promise<any[]> {
    try {
      // In a real implementation, we would fetch analytics data
      // Example: const response = await analytics.reports.batchGet({
      //   requestBody: {
      //     reportRequests: [{
      //       viewId: config.viewId,
      //       dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      //       metrics: [{ expression: 'ga:pageviews' }],
      //       dimensions: [{ name: 'ga:pagePath' }]
      //     }]
      //   }
      // });
      
      // For demonstration, return sample data
      return [
        { path: "/dashboard", pageviews: 1250, avgTimeOnPage: 120, bounceRate: 0.25 },
        { path: "/accounts", pageviews: 980, avgTimeOnPage: 95, bounceRate: 0.32 },
        { path: "/payments", pageviews: 1450, avgTimeOnPage: 145, bounceRate: 0.18 },
        { path: "/profile", pageviews: 720, avgTimeOnPage: 85, bounceRate: 0.40 }
      ];
    } catch (error) {
      console.error("Failed to extract data from Google Analytics:", error);
      return [];
    }
  }

  async transform(data: any[]): Promise<any[]> {
    // Transform Google Analytics data into our metrics format
    return data.flatMap(item => {
      const metrics = [];
      
      // Extract feature from page path (in reality, we would have a more robust mapping)
      const pathParts = item.path.split('/').filter(Boolean);
      const feature = pathParts.length > 0 ? pathParts[0].toLowerCase() : "other";
      
      // Page views metric
      metrics.push({
        metricName: "page_views",
        metricValue: item.pageviews,
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "google_analytics"
      });
      
      // Time on page metric
      metrics.push({
        metricName: "avg_time_on_page",
        metricValue: item.avgTimeOnPage,
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "google_analytics"
      });
      
      // Bounce rate metric
      metrics.push({
        metricName: "bounce_rate",
        metricValue: item.bounceRate * 100, // Convert to percentage
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "google_analytics"
      });
      
      return metrics;
    });
  }

  async load(data: any[]): Promise<{ count: number; success: boolean }> {
    // Load the transformed data into our database
    try {
      if (data.length === 0) {
        return { count: 0, success: true };
      }
      
      await db.insert(designMetrics).values(data);
      return { count: data.length, success: true };
    } catch (error) {
      console.error("Failed to load Google Analytics data:", error);
      return { count: 0, success: false };
    }
  }

  async getLastSyncStatus(connectionId: string): Promise<{ lastSync: Date | null; status: string }> {
    // Get the last sync status for this connection
    try {
      const [latestLog] = await db
        .select()
        .from(dataImportLogs)
        .where(eq(dataImportLogs.connectionId, connectionId))
        .orderBy(dataImportLogs.createdAt, "desc")
        .limit(1);
      
      if (!latestLog) {
        return { lastSync: null, status: "never_synced" };
      }
      
      return { 
        lastSync: latestLog.createdAt, 
        status: latestLog.success ? "success" : "failed" 
      };
    } catch (error) {
      console.error("Failed to get last sync status:", error);
      return { lastSync: null, status: "unknown" };
    }
  }
}

// Azure Analytics Connector Implementation
class AzureAnalyticsConnector implements DataSourceConnector {
  async connect(config: any): Promise<boolean> {
    try {
      // In a real implementation, we'd connect to Azure Application Insights API
      // Example: const response = await fetch(`https://api.applicationinsights.io/v1/apps/${config.appId}/metrics/requests/count`, {
      //   headers: { 'X-Api-Key': config.apiKey }
      // });
      
      // For now, just validate that we have the required config
      if (!config.appId || !config.apiKey) {
        throw new Error("Missing required Azure Application Insights configuration");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to connect to Azure Analytics:", error);
      return false;
    }
  }

  async extract(config: any): Promise<any[]> {
    try {
      // In a real implementation, we would fetch analytics data from Azure
      // Example: const response = await fetch(`https://api.applicationinsights.io/v1/apps/${config.appId}/metrics/...`);
      
      // For demonstration, return sample data
      return [
        { path: "/api/dashboard", requests: 2300, duration: 185, failureRate: 0.02 },
        { path: "/api/accounts", requests: 1850, duration: 210, failureRate: 0.03 },
        { path: "/api/payments", requests: 3200, duration: 230, failureRate: 0.01 },
        { path: "/api/profile", requests: 1450, duration: 190, failureRate: 0.04 }
      ];
    } catch (error) {
      console.error("Failed to extract data from Azure Analytics:", error);
      return [];
    }
  }

  async transform(data: any[]): Promise<any[]> {
    // Transform Azure Analytics data into our metrics format
    return data.flatMap(item => {
      const metrics = [];
      
      // Extract feature from API path (in reality, we would have a more robust mapping)
      const pathParts = item.path.split('/').filter(Boolean);
      const feature = pathParts.length > 1 ? pathParts[1].toLowerCase() : "other";
      
      // Request count metric
      metrics.push({
        metricName: "api_requests",
        metricValue: item.requests,
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "azure_analytics"
      });
      
      // Average duration metric
      metrics.push({
        metricName: "api_response_time",
        metricValue: item.duration,
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "azure_analytics"
      });
      
      // Failure rate metric
      metrics.push({
        metricName: "api_failure_rate",
        metricValue: item.failureRate * 100, // Convert to percentage
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "azure_analytics"
      });
      
      return metrics;
    });
  }

  async load(data: any[]): Promise<{ count: number; success: boolean }> {
    // Load the transformed data into our database
    try {
      if (data.length === 0) {
        return { count: 0, success: true };
      }
      
      await db.insert(designMetrics).values(data);
      return { count: data.length, success: true };
    } catch (error) {
      console.error("Failed to load Azure Analytics data:", error);
      return { count: 0, success: false };
    }
  }

  async getLastSyncStatus(connectionId: string): Promise<{ lastSync: Date | null; status: string }> {
    // Get the last sync status for this connection
    try {
      const [latestLog] = await db
        .select()
        .from(dataImportLogs)
        .where(eq(dataImportLogs.connectionId, connectionId))
        .orderBy(dataImportLogs.createdAt, "desc")
        .limit(1);
      
      if (!latestLog) {
        return { lastSync: null, status: "never_synced" };
      }
      
      return { 
        lastSync: latestLog.createdAt, 
        status: latestLog.success ? "success" : "failed" 
      };
    } catch (error) {
      console.error("Failed to get last sync status:", error);
      return { lastSync: null, status: "unknown" };
    }
  }
}

// Power BI Connector Implementation
class PowerBIConnector implements DataSourceConnector {
  async connect(config: any): Promise<boolean> {
    try {
      // In a real implementation, we'd connect to the Power BI API
      // Example: const tokenResponse = await fetch('https://login.microsoftonline.com/{tenantId}/oauth2/token', {
      //   method: 'POST',
      //   body: new URLSearchParams({
      //     grant_type: 'password',
      //     resource: 'https://analysis.windows.net/powerbi/api',
      //     client_id: config.clientId,
      //     username: config.username,
      //     password: config.password
      //   })
      // });
      
      // For now, just validate that we have the required config
      if (!config.clientId || !config.username || !config.password || !config.workspaceId) {
        throw new Error("Missing required Power BI configuration");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to connect to Power BI:", error);
      return false;
    }
  }

  async extract(config: any): Promise<any[]> {
    try {
      // In a real implementation, we would fetch data from Power BI datasets
      // Example: const response = await fetch(`https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/datasets/${config.datasetId}/executeQueries`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${accessToken}` },
      //   body: JSON.stringify({ queries: [{ query: 'EVALUATE TOP(10, DesignMetrics)' }] })
      // });
      
      // For demonstration, return sample data
      return [
        { feature: "Dashboard", designTime: 12.5, implementationTime: 24.3, usabilityScore: 87 },
        { feature: "Accounts", designTime: 18.2, implementationTime: 32.1, usabilityScore: 82 },
        { feature: "Payments", designTime: 15.7, implementationTime: 28.4, usabilityScore: 90 },
        { feature: "Profile", designTime: 10.3, implementationTime: 20.6, usabilityScore: 85 }
      ];
    } catch (error) {
      console.error("Failed to extract data from Power BI:", error);
      return [];
    }
  }

  async transform(data: any[]): Promise<any[]> {
    // Transform Power BI data into our metrics format
    return data.flatMap(item => {
      const metrics = [];
      const feature = item.feature.toLowerCase();
      
      // Design time metric
      metrics.push({
        metricName: "design_time",
        metricValue: item.designTime,
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "power_bi"
      });
      
      // Implementation time metric
      metrics.push({
        metricName: "implementation_time",
        metricValue: item.implementationTime,
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "power_bi"
      });
      
      // Usability score metric
      metrics.push({
        metricName: "usability_score",
        metricValue: item.usabilityScore,
        recordedAt: new Date(),
        featureId: feature,
        userSegment: "all",
        platformType: "power_bi"
      });
      
      return metrics;
    });
  }

  async load(data: any[]): Promise<{ count: number; success: boolean }> {
    // Load the transformed data into our database
    try {
      if (data.length === 0) {
        return { count: 0, success: true };
      }
      
      await db.insert(designMetrics).values(data);
      return { count: data.length, success: true };
    } catch (error) {
      console.error("Failed to load Power BI data:", error);
      return { count: 0, success: false };
    }
  }

  async getLastSyncStatus(connectionId: string): Promise<{ lastSync: Date | null; status: string }> {
    // Get the last sync status for this connection
    try {
      const [latestLog] = await db
        .select()
        .from(dataImportLogs)
        .where(eq(dataImportLogs.connectionId, connectionId))
        .orderBy(dataImportLogs.createdAt, "desc")
        .limit(1);
      
      if (!latestLog) {
        return { lastSync: null, status: "never_synced" };
      }
      
      return { 
        lastSync: latestLog.createdAt, 
        status: latestLog.success ? "success" : "failed" 
      };
    } catch (error) {
      console.error("Failed to get last sync status:", error);
      return { lastSync: null, status: "unknown" };
    }
  }
}

// CSV Connector Implementation
class CSVConnector implements DataSourceConnector {
  async connect(config: any): Promise<boolean> {
    try {
      // For CSV, we just check if the format configuration is valid
      if (!config.mappings || !Array.isArray(config.mappings) || config.mappings.length === 0) {
        throw new Error("Missing required CSV mappings configuration");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to configure CSV connector:", error);
      return false;
    }
  }

  async extract(config: any): Promise<any[]> {
    try {
      // In a real implementation, we would parse the uploaded CSV file
      // For demonstration, return sample data that mimics parsed CSV data
      // This data would normally come from the uploaded file and is already in array format
      return [
        ["Dashboard", "DesignTime", "Score", "2023-05-01"],
        ["Payments", "ImplementationTime", "87", "2023-05-02"],
        ["Accounts", "UsabilityScore", "92", "2023-05-03"],
        ["Dashboard", "UsabilityScore", "85", "2023-05-04"]
      ];
    } catch (error) {
      console.error("Failed to extract data from CSV:", error);
      return [];
    }
  }

  async transform(data: any[]): Promise<any[]> {
    // Transform CSV data into our metrics format based on the configured mappings
    return data.map(row => {
      // In a real implementation, we would use the mappings configuration
      // to determine which columns map to which fields
      // Here's a simplified example:
      
      // Example mapping: { featureIndex: 0, metricNameIndex: 1, metricValueIndex: 2, dateIndex: 3 }
      const feature = row[0].toLowerCase();
      const metricName = row[1].toLowerCase();
      const metricValue = parseFloat(row[2]);
      const date = new Date(row[3]);
      
      return {
        metricName,
        metricValue,
        recordedAt: date,
        featureId: feature,
        userSegment: "all",
        platformType: "csv"
      };
    });
  }

  async load(data: any[]): Promise<{ count: number; success: boolean }> {
    // Load the transformed data into our database
    try {
      if (data.length === 0) {
        return { count: 0, success: true };
      }
      
      await db.insert(designMetrics).values(data);
      return { count: data.length, success: true };
    } catch (error) {
      console.error("Failed to load CSV data:", error);
      return { count: 0, success: false };
    }
  }

  async getLastSyncStatus(connectionId: string): Promise<{ lastSync: Date | null; status: string }> {
    // Get the last sync status for this connection
    try {
      const [latestLog] = await db
        .select()
        .from(dataImportLogs)
        .where(eq(dataImportLogs.connectionId, connectionId))
        .orderBy(dataImportLogs.createdAt, "desc")
        .limit(1);
      
      if (!latestLog) {
        return { lastSync: null, status: "never_synced" };
      }
      
      return { 
        lastSync: latestLog.createdAt, 
        status: latestLog.success ? "success" : "failed" 
      };
    } catch (error) {
      console.error("Failed to get last sync status:", error);
      return { lastSync: null, status: "unknown" };
    }
  }
}

// Factory for creating the appropriate connector based on the connection type
class ConnectorFactory {
  static getConnector(type: string): DataSourceConnector {
    switch (type) {
      case "figma":
        return new FigmaConnector();
      case "jira":
        return new JiraConnector();
      case "google_analytics":
        return new GoogleAnalyticsConnector();
      case "azure_analytics":
        return new AzureAnalyticsConnector();
      case "power_bi":
        return new PowerBIConnector();
      case "csv":
        return new CSVConnector();
      default:
        throw new Error(`Unsupported data source type: ${type}`);
    }
  }
}

// Main ETL Service
export class ETLService {
  // Get all data connections
  async getDataConnections(): Promise<DataConnection[]> {
    return db.select().from(dataConnections);
  }

  // Create a new data connection
  async createDataConnection(connectionData: any): Promise<DataConnection> {
    const connectionId = generateId();
    
    // Check if we can connect to this data source
    const connector = ConnectorFactory.getConnector(connectionData.type);
    const canConnect = await connector.connect(connectionData.credentials);
    
    if (!canConnect) {
      throw new Error(`Cannot connect to ${connectionData.type} with the provided credentials`);
    }
    
    // Create the connection in the database
    const [connection] = await db
      .insert(dataConnections)
      .values({
        id: connectionId,
        name: connectionData.name,
        type: connectionData.type,
        status: "active",
        credentials: connectionData.credentials,
        createdAt: new Date(),
        lastSyncAt: null
      })
      .returning();
    
    return connection;
  }

  // Sync data from a connection
  async syncDataConnection(connectionId: string): Promise<any> {
    // Get the connection details
    const [connection] = await db
      .select()
      .from(dataConnections)
      .where(eq(dataConnections.id, connectionId));
    
    if (!connection) {
      throw new Error(`Connection not found with ID: ${connectionId}`);
    }
    
    try {
      // Get the appropriate connector
      const connector = ConnectorFactory.getConnector(connection.type);
      
      // Extract data from the source
      const extractedData = await connector.extract(connection.credentials);
      
      // Transform the data
      const transformedData = await connector.transform(extractedData);
      
      // Load the data
      const loadResult = await connector.load(transformedData);
      
      // Update the connection's last sync time
      await db
        .update(dataConnections)
        .set({ lastSyncAt: new Date() })
        .where(eq(dataConnections.id, connectionId));
      
      // Create a log entry
      await db
        .insert(dataImportLogs)
        .values({
          id: generateId(),
          connectionId,
          recordsProcessed: loadResult.count,
          success: loadResult.success,
          createdAt: new Date(),
          error: loadResult.success ? null : "Error during data load"
        });
      
      return {
        connectionId,
        syncedAt: new Date(),
        recordsProcessed: loadResult.count,
        success: loadResult.success
      };
    } catch (error) {
      console.error(`Error syncing data from connection ${connectionId}:`, error);
      
      // Create an error log entry
      await db
        .insert(dataImportLogs)
        .values({
          id: generateId(),
          connectionId,
          recordsProcessed: 0,
          success: false,
          createdAt: new Date(),
          error: error.message || "Unknown error during sync"
        });
      
      throw error;
    }
  }

  // Get the connection status
  async getConnectionStatus(connectionId: string): Promise<any> {
    // Get the connection details
    const [connection] = await db
      .select()
      .from(dataConnections)
      .where(eq(dataConnections.id, connectionId));
    
    if (!connection) {
      throw new Error(`Connection not found with ID: ${connectionId}`);
    }
    
    // Get the connector
    const connector = ConnectorFactory.getConnector(connection.type);
    
    // Get the last sync status
    const syncStatus = await connector.getLastSyncStatus(connectionId);
    
    return {
      id: connection.id,
      name: connection.name,
      type: connection.type,
      status: connection.status,
      lastSync: connection.lastSyncAt || syncStatus.lastSync,
      syncStatus: syncStatus.status
    };
  }

  // Delete a connection
  async deleteConnection(connectionId: string): Promise<boolean> {
    // Delete the connection
    await db
      .delete(dataConnections)
      .where(eq(dataConnections.id, connectionId));
    
    return true;
  }

  // Run a full ETL pipeline for all active connections
  async runFullETLPipeline(): Promise<any[]> {
    // Get all active connections
    const connections = await db
      .select()
      .from(dataConnections)
      .where(eq(dataConnections.status, "active"));
    
    // Sync each connection
    const results = await Promise.all(
      connections.map(async (connection) => {
        try {
          return await this.syncDataConnection(connection.id);
        } catch (error) {
          return {
            connectionId: connection.id,
            success: false,
            error: error.message || "Unknown error"
          };
        }
      })
    );
    
    return results;
  }

  // Schedule regular ETL runs
  scheduleETLJobs(intervalMinutes: number = 60): NodeJS.Timeout {
    console.log(`Scheduling ETL jobs to run every ${intervalMinutes} minutes`);
    
    // Run the ETL pipeline immediately
    this.runFullETLPipeline().catch(error => {
      console.error("Error running scheduled ETL pipeline:", error);
    });
    
    // Schedule regular runs
    return setInterval(() => {
      this.runFullETLPipeline().catch(error => {
        console.error("Error running scheduled ETL pipeline:", error);
      });
    }, intervalMinutes * 60 * 1000);
  }
}

// Create and export a singleton instance of the ETL service
export const etlService = new ETLService();