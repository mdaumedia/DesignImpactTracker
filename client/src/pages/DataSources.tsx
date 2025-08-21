import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Database, Activity, RefreshCw } from "lucide-react";
import DataConnectionForm from "../components/dashboard/DataConnectionForm";
import DataConnectionList from "../components/dashboard/DataConnectionList";
import { useToast } from "../hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

export default function DataSources() {
  const [activeTab, setActiveTab] = useState<string>("connections");
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle running the full ETL pipeline
  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    
    try {
      const result = await apiRequest("/api/etl/run-pipeline", "POST");
      
      // Invalidate data connections to refresh status
      queryClient.invalidateQueries({ queryKey: ["/api/data-connections"] });
      
      // Invalidate dashboard data to show new metrics
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      
      // Check if result is an array and count successes
      let successCount = 0;
      let totalCount = 0;
      
      if (Array.isArray(result)) {
        totalCount = result.length;
        successCount = result.filter((r: any) => r.success).length;
      }
      
      toast({
        title: "ETL Pipeline Completed",
        description: `Successfully processed ${successCount} out of ${totalCount} data sources`,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to run ETL pipeline:", error);
      toast({
        title: "ETL Pipeline Failed",
        description: error instanceof Error ? error.message : "Failed to run ETL pipeline",
        variant: "destructive",
      });
    } finally {
      setIsRunningPipeline(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Sources</h1>
          <p className="text-muted-foreground">
            Manage external data source connections and import metrics
          </p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => handleRunPipeline()}
            disabled={isRunningPipeline}
          >
            {isRunningPipeline ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Run ETL Pipeline
              </>
            )}
          </Button>
          <Button 
            onClick={() => setActiveTab("add-connection")}
            disabled={activeTab === "add-connection"}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Data Source
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="connections">
            <Database className="mr-2 h-4 w-4" />
            Data Connections
          </TabsTrigger>
          <TabsTrigger value="add-connection">
            <Plus className="mr-2 h-4 w-4" />
            Add Connection
          </TabsTrigger>
        </TabsList>
        <TabsContent value="connections" className="mt-6">
          <DataConnectionList />
        </TabsContent>
        <TabsContent value="add-connection" className="mt-6">
          <DataConnectionForm />
        </TabsContent>
      </Tabs>
      
      <div className="text-sm text-muted-foreground mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">About Data Connections</h3>
        <p className="mb-2">
          Connect to external data sources like Figma, Jira, and analytics platforms to automatically import design metrics.
          Metrics will be imported during synchronization and the ETL pipeline will transform the data to match our dashboard format.
        </p>
        <p>
          To get the most accurate insights, we recommend synchronizing your data sources regularly.
          You can manually trigger synchronization on each connection or run the full ETL pipeline to update all data sources at once.
        </p>
      </div>
    </div>
  );
}