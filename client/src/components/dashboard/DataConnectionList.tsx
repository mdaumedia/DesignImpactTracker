import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@hooks/use-toast";

// UI Components
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import {
  CheckCircle2,
  Database,
  MoreVertical,
  RefreshCw,
  Trash2,
  XCircle,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";

// Type definitions for data connections
type DataConnection = {
  id: string;
  name: string;
  type: string;
  status: string;
  lastSync: Date | null;
  syncStatus: string;
};

export default function DataConnectionList() {
  const queryClient = useQueryClient();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Fetch data connections
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/data-connections"],
    select: (data: any) => data as DataConnection[]
  });
  
  // Handle sync action
  const handleSync = async (id: string) => {
    setSyncingId(id);
    
    try {
      await apiRequest(`/api/data-connections/${id}/sync`, {
        method: "POST",
      });
      
      // Invalidate connections to refresh with new sync status
      queryClient.invalidateQueries({ queryKey: ["/api/data-connections"] });
      
      toast({
        title: "Sync completed",
        description: "Data source has been successfully synchronized",
        variant: "default",
      });
    } catch (error) {
      console.error("Sync failed:", error);
      toast({
        title: "Sync failed",
        description: error instanceof Error ? error.message : "Failed to sync data source",
        variant: "destructive",
      });
    } finally {
      setSyncingId(null);
    }
  };
  
  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/api/data-connections/${id}`, {
        method: "DELETE",
      });
      
      // Invalidate connections to remove the deleted one
      queryClient.invalidateQueries({ queryKey: ["/api/data-connections"] });
      
      toast({
        title: "Connection deleted",
        description: "Data source connection has been removed",
        variant: "default",
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete data source",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };
  
  // Get status badge for a connection
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get sync status icon
  const getSyncStatusIcon = (syncStatus: string) => {
    switch (syncStatus) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "never_synced":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // Get connection type icon/label
  const getConnectionTypeInfo = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      figma: <Badge className="bg-purple-500">Figma</Badge>,
      jira: <Badge className="bg-blue-500">Jira</Badge>,
      google_analytics: <Badge className="bg-yellow-500">Google Analytics</Badge>,
      azure_analytics: <Badge className="bg-blue-400">Azure Analytics</Badge>,
      power_bi: <Badge className="bg-yellow-600">Power BI</Badge>,
      csv: <Badge className="bg-green-500">CSV</Badge>,
    };
    
    return icons[type] || <Badge>{type}</Badge>;
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Connections</CardTitle>
          <CardDescription>Manage your external data source connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Connections</CardTitle>
          <CardDescription>Manage your external data source connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md bg-red-50 text-red-700">
            <p>Failed to load data connections. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Data Connections</CardTitle>
          <CardDescription>Manage your external data source connections</CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/data-connections"] })}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {data?.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-lg">
            <Database className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No data connections</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first data source to start importing metrics
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Sync Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((connection) => (
                <TableRow key={connection.id}>
                  <TableCell className="font-medium">{connection.name}</TableCell>
                  <TableCell>{getConnectionTypeInfo(connection.type)}</TableCell>
                  <TableCell>{getStatusBadge(connection.status)}</TableCell>
                  <TableCell>
                    {connection.lastSync
                      ? formatDistanceToNow(new Date(connection.lastSync), { addSuffix: true })
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {syncingId === connection.id ? (
                        <LoaderCircle className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                      ) : (
                        getSyncStatusIcon(connection.syncStatus)
                      )}
                      <span className="ml-2 capitalize">
                        {syncingId === connection.id
                          ? "Syncing..."
                          : connection.syncStatus.replace("_", " ")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleSync(connection.id)}
                          disabled={syncingId === connection.id}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingId(connection.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this connection? This action cannot be undone and all
              sync history will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}