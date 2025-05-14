import React from "react";
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  FileText, 
  Github, 
  BarChart4, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";

type DataSourceType = 
  | "figma" 
  | "jira" 
  | "azure_analytics" 
  | "google_analytics" 
  | "power_bi" 
  | "csv";

type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "password" | "select" | "checkbox" | "switch";
  placeholder?: string;
  required?: boolean;
  options?: {value: string, label: string}[];
  helpText?: string;
};

type DataSourceConfig = {
  type: DataSourceType;
  name: string;
  icon: React.ElementType;
  description: string;
  fields: FieldConfig[];
};

type DataSourceWizardProps = {
  onClose: () => void;
  onSave: (sourceType: DataSourceType, connectionData: Record<string, any>) => Promise<void>;
};

const sourceConfigs: Record<DataSourceType, DataSourceConfig> = {
  figma: {
    type: "figma",
    name: "Figma",
    icon: Github, // Using Github as placeholder for Figma
    description: "Connect to Figma to automatically import design components, usage patterns, and feedback.",
    fields: [
      { name: "name", label: "Connection Name", type: "text", placeholder: "My Figma Connection", required: true },
      { name: "apiKey", label: "Personal Access Token", type: "password", required: true, helpText: "Generate a personal access token in your Figma account settings" },
      { name: "fileIds", label: "File IDs", type: "text", placeholder: "Comma-separated list of file IDs", required: true },
      { name: "teamId", label: "Team ID", type: "text", required: false },
      { name: "importComponents", label: "Import Components", type: "switch", helpText: "Import component usage and properties" },
      { name: "importComments", label: "Import Comments", type: "switch", helpText: "Import comments as feedback" },
    ]
  },
  jira: {
    type: "jira",
    name: "Jira",
    icon: Github, // Using Github as placeholder for Jira
    description: "Connect to Jira to track design-related tickets, velocity, and feedback from engineering teams.",
    fields: [
      { name: "name", label: "Connection Name", type: "text", placeholder: "My Jira Connection", required: true },
      { name: "domain", label: "Jira Domain", type: "text", placeholder: "your-company.atlassian.net", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "apiToken", label: "API Token", type: "password", required: true, helpText: "Generate an API token in your Atlassian account" },
      { name: "projects", label: "Project Keys", type: "text", placeholder: "Comma-separated list of project keys", required: true },
      { name: "designLabel", label: "Design Label", type: "text", placeholder: "design", required: false, helpText: "Label used to identify design-related issues" },
    ]
  },
  azure_analytics: {
    type: "azure_analytics",
    name: "Azure Analytics",
    icon: BarChart4,
    description: "Connect to Azure Analytics to import user behavior data related to your design components.",
    fields: [
      { name: "name", label: "Connection Name", type: "text", placeholder: "My Azure Analytics Connection", required: true },
      { name: "appId", label: "Application ID", type: "text", required: true },
      { name: "apiKey", label: "API Key", type: "password", required: true },
      { name: "endpoint", label: "API Endpoint", type: "text", required: true },
      { name: "importEvents", label: "Import Events", type: "switch", helpText: "Import user interaction events" },
      { name: "importMetrics", label: "Import Metrics", type: "switch", helpText: "Import performance metrics" }
    ]
  },
  google_analytics: {
    type: "google_analytics",
    name: "Google Analytics",
    icon: BarChart4,
    description: "Connect to Google Analytics to track user engagement with your design components.",
    fields: [
      { name: "name", label: "Connection Name", type: "text", placeholder: "My Google Analytics Connection", required: true },
      { name: "propertyId", label: "Property ID", type: "text", required: true },
      { name: "clientEmail", label: "Service Account Email", type: "text", required: true },
      { name: "privateKey", label: "Private Key", type: "password", required: true, helpText: "The private key from your service account JSON file" },
      { name: "viewId", label: "View ID", type: "text", required: true },
      { name: "customDimensions", label: "Custom Dimensions", type: "text", placeholder: "design_feature,component_id", required: false }
    ]
  },
  power_bi: {
    type: "power_bi",
    name: "Power BI",
    icon: BarChart4,
    description: "Connect to Power BI to import and visualize design metrics from your existing dashboards.",
    fields: [
      { name: "name", label: "Connection Name", type: "text", placeholder: "My Power BI Connection", required: true },
      { name: "clientId", label: "Client ID", type: "text", required: true },
      { name: "clientSecret", label: "Client Secret", type: "password", required: true },
      { name: "tenantId", label: "Tenant ID", type: "text", required: true },
      { name: "workspaceId", label: "Workspace ID", type: "text", required: true },
      { name: "reportId", label: "Report ID", type: "text", required: false },
      { name: "datasetId", label: "Dataset ID", type: "text", required: false }
    ]
  },
  csv: {
    type: "csv",
    name: "CSV Import",
    icon: FileText,
    description: "Import design metrics from CSV files. Useful for one-time imports or when data is not available via API.",
    fields: [
      { name: "name", label: "Import Name", type: "text", placeholder: "My CSV Import", required: true },
      { name: "delimiter", label: "Delimiter", type: "select", options: [
        { value: ",", label: "Comma (,)" },
        { value: ";", label: "Semicolon (;)" },
        { value: "\\t", label: "Tab (\\t)" }
      ], required: true },
      { name: "hasHeader", label: "Has Header Row", type: "switch", helpText: "First row contains column names" },
      { name: "dateFormat", label: "Date Format", type: "select", options: [
        { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
        { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
        { value: "DD/MM/YYYY", label: "DD/MM/YYYY" }
      ], required: true },
      { name: "mapping", label: "Column Mapping", type: "text", placeholder: "Design a mapping UI here", required: false, helpText: "Map CSV columns to design metrics" }
    ]
  }
};

export function DataSourceWizard({ onClose, onSave }: DataSourceWizardProps) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [selectedType, setSelectedType] = React.useState<DataSourceType | null>(null);
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<"idle" | "testing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const handleTypeSelect = (type: DataSourceType) => {
    setSelectedType(type);
    setFormData({});
    setStep(2);
  };

  const handleInputChange = (field: FieldConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field.name]: value
    }));
  };

  const validateForm = () => {
    if (!selectedType) return false;
    
    const config = sourceConfigs[selectedType];
    const requiredFields = config.fields.filter(f => f.required);
    
    return requiredFields.every(field => {
      const value = formData[field.name];
      return value !== undefined && value !== "";
    });
  };

  const handleTestConnection = async () => {
    if (!selectedType) return;
    
    setTestStatus("testing");
    setErrorMessage("");
    
    // Simulate testing a connection
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll randomly succeed or fail
      if (Math.random() > 0.2) {
        setTestStatus("success");
      } else {
        setTestStatus("error");
        setErrorMessage("Could not connect to the service. Please check your credentials and try again.");
      }
    } catch (error) {
      setTestStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  const handleSave = async () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    try {
      await onSave(selectedType, formData);
      toast({
        title: "Connection created",
        description: "Your data source has been successfully connected.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error creating connection",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSourceCard = (config: DataSourceConfig) => {
    const Icon = config.icon;
    
    return (
      <Card 
        key={config.type}
        className={`cursor-pointer transition-all hover:shadow-md ${
          selectedType === config.type ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => handleTypeSelect(config.type)}
      >
        <CardContent className="p-6">
          <div className="flex items-start">
            <div className={`mr-4 p-2 rounded-full ${
              selectedType === config.type 
                ? "bg-primary text-white" 
                : "bg-slate-100"
            }`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className="font-medium text-lg">{config.name}</h3>
              <p className="text-slate-500 text-sm">{config.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case "text":
      case "password":
        return (
          <div className="grid gap-2" key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
            {field.helpText && (
              <p className="text-sm text-slate-500">{field.helpText}</p>
            )}
          </div>
        );
        
      case "select":
        return (
          <div className="grid gap-2" key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => handleInputChange(field, value)}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-sm text-slate-500">{field.helpText}</p>
            )}
          </div>
        );
        
      case "switch":
        return (
          <div className="flex items-center justify-between" key={field.name}>
            <div>
              <Label htmlFor={field.name} className="cursor-pointer">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {field.helpText && (
                <p className="text-sm text-slate-500">{field.helpText}</p>
              )}
            </div>
            <Switch
              id={field.name}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleInputChange(field, checked)}
            />
          </div>
        );
        
      case "checkbox":
        return (
          <div className="flex items-center space-x-2" key={field.name}>
            <Checkbox
              id={field.name}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleInputChange(field, checked)}
            />
            <Label htmlFor={field.name} className="cursor-pointer">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-sm text-slate-500 ml-6">{field.helpText}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <DialogHeader>
        <DialogTitle>Connect Data Source</DialogTitle>
        <DialogDescription>
          Import design metrics from external sources to enhance your dashboard analytics.
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium">Select Data Source Type</h2>
                <p className="text-slate-500">Choose the type of data source you want to connect:</p>
              </div>
              
              <Tabs defaultValue="design" className="mb-6">
                <TabsList>
                  <TabsTrigger value="design">Design Tools</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="import">Import</TabsTrigger>
                </TabsList>
                <TabsContent value="design" className="space-y-4 mt-4">
                  {renderSourceCard(sourceConfigs.figma)}
                  {renderSourceCard(sourceConfigs.jira)}
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4 mt-4">
                  {renderSourceCard(sourceConfigs.azure_analytics)}
                  {renderSourceCard(sourceConfigs.google_analytics)}
                  {renderSourceCard(sourceConfigs.power_bi)}
                </TabsContent>
                <TabsContent value="import" className="space-y-4 mt-4">
                  {renderSourceCard(sourceConfigs.csv)}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
          
          {step === 2 && selectedType && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="mr-2"
                >
                  Back
                </Button>
                <h2 className="text-lg font-medium">
                  Configure {sourceConfigs[selectedType].name} Connection
                </h2>
              </div>
              
              <div className="space-y-6">
                {sourceConfigs[selectedType].fields.map(renderField)}
              </div>
              
              {testStatus === "error" && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>
                    {errorMessage || "Failed to connect to the data source. Please check your settings and try again."}
                  </AlertDescription>
                </Alert>
              )}
              
              {testStatus === "success" && (
                <Alert className="mt-6 border-green-200 text-green-800 bg-green-50">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Connection Successful</AlertTitle>
                  <AlertDescription>
                    Successfully connected to the data source. You can now save this connection.
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        
        {step === 2 && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={!validateForm() || isSubmitting || testStatus === "testing"}
            >
              {testStatus === "testing" ? "Testing..." : "Test Connection"}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!validateForm() || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Connection"}
            </Button>
          </div>
        )}
      </DialogFooter>
    </div>
  );
}