import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";

const dataConnectionFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["figma", "jira", "google_analytics", "azure_analytics", "power_bi", "csv"]),
  credentials: z.any(),
});

type DataConnectionFormValues = z.infer<typeof dataConnectionFormSchema>;

export default function DataConnectionForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [step, setStep] = useState<"type" | "credentials" | "confirm">("type");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<DataConnectionFormValues>({
    resolver: zodResolver(dataConnectionFormSchema),
    defaultValues: {
      name: "",
      type: undefined,
      credentials: {},
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: DataConnectionFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("/api/data-connections", "POST", JSON.stringify(data));
      
      // Reset form and show success message
      form.reset();
      setStep("type");
      
      // Invalidate data connections cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/data-connections"] });
      
      toast({
        title: "Connection created",
        description: "Your data source was successfully connected",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to create data connection:", error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to create connection",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get the next button text based on current step
  const getNextButtonText = () => {
    switch (step) {
      case "type":
        return "Configure Connection";
      case "credentials":
        return "Review Connection";
      case "confirm":
        return "Create Connection";
      default:
        return "Next";
    }
  };
  
  // Get the credentials form fields based on selected connection type
  const getCredentialsFields = () => {
    const connectionType = form.watch("type");
    
    switch (connectionType) {
      case "figma":
        return (
          <>
            <FormField
              control={form.control}
              name="credentials.apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Figma API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Figma personal access token" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Figma team ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case "jira":
        return (
          <>
            <FormField
              control={form.control}
              name="credentials.domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="your-domain.atlassian.net" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.apiToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Token</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Jira API Token" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.projectKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Key</FormLabel>
                  <FormControl>
                    <Input placeholder="PRJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case "google_analytics":
        return (
          <>
            <FormField
              control={form.control}
              name="credentials.viewId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>View ID</FormLabel>
                  <FormControl>
                    <Input placeholder="GA View ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Email</FormLabel>
                  <FormControl>
                    <Input placeholder="service-account@project.iam.gserviceaccount.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.privateKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private Key</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="-----BEGIN PRIVATE KEY-----\n..."
                      {...field}
                      style={{ minHeight: "100px" }}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case "azure_analytics":
        return (
          <>
            <FormField
              control={form.control}
              name="credentials.appId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Azure Application Insights App ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Azure API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case "power_bi":
        return (
          <>
            <FormField
              control={form.control}
              name="credentials.clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Power BI Client ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Power BI Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Power BI Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.workspaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Power BI Workspace ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      case "csv":
        return (
          <>
            <FormField
              control={form.control}
              name="credentials.mappings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CSV Mapping Configuration</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder='[{"column": 0, "field": "feature"}, {"column": 1, "field": "metricName"}]'
                      value={typeof field.value === 'string' ? field.value : JSON.stringify(field.value || [])}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          field.onChange(parsed);
                        } catch {
                          field.onChange(e.target.value);
                        }
                      }}
                      style={{ minHeight: "100px" }}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        
      default:
        return <p className="text-sm text-muted-foreground">Please select a connection type first.</p>;
    }
  };
  
  // Handle next step action
  const handleNext = () => {
    if (step === "type") {
      // Validate the connection type before proceeding
      const connectionType = form.watch("type");
      if (!connectionType) {
        form.setError("type", {
          type: "manual",
          message: "Please select a connection type",
        });
        return;
      }
      setStep("credentials");
    } else if (step === "credentials") {
      setStep("confirm");
    } else if (step === "confirm") {
      form.handleSubmit(onSubmit)();
    }
  };
  
  // Handle back action
  const handleBack = () => {
    if (step === "credentials") {
      setStep("type");
    } else if (step === "confirm") {
      setStep("credentials");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connect Data Source</CardTitle>
        <CardDescription>
          Connect to external data sources to import design metrics and analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === "type" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Figma Connection" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a data source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="figma">Figma</SelectItem>
                          <SelectItem value="jira">Jira</SelectItem>
                          <SelectItem value="google_analytics">Google Analytics</SelectItem>
                          <SelectItem value="azure_analytics">Azure Analytics</SelectItem>
                          <SelectItem value="power_bi">Power BI</SelectItem>
                          <SelectItem value="csv">CSV Upload</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {step === "credentials" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Configure {form.watch("type")} Connection
                </h3>
                {getCredentialsFields()}
              </div>
            )}
            
            {step === "confirm" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Confirm Connection Details</h3>
                <div className="rounded-md border p-4 bg-muted/50">
                  <dl className="divide-y">
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="font-medium">Name</dt>
                      <dd className="col-span-2">{form.watch("name")}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="font-medium">Type</dt>
                      <dd className="col-span-2 capitalize">{form.watch("type")?.replace('_', ' ')}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="font-medium">Credentials</dt>
                      <dd className="col-span-2">
                        <p className="text-sm text-muted-foreground">
                          <AlertCircle className="inline-block mr-1 h-4 w-4" />
                          Credentials are securely stored and never exposed
                        </p>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step !== "type" ? (
          <Button variant="outline" onClick={handleBack} type="button">
            Back
          </Button>
        ) : (
          <div></div>
        )}
        <Button 
          onClick={handleNext} 
          type="button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              {getNextButtonText()}
              {step !== "confirm" && <ArrowRight className="ml-2 h-4 w-4" />}
              {step === "confirm" && <Check className="ml-2 h-4 w-4" />}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}