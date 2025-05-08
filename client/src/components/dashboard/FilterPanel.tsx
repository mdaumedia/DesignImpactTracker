import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Refresh } from "@/lib/icons";

type FilterPanelProps = {
  filters: {
    feature: string;
    persona: string;
    platform: string;
    metricType: string;
  };
  onChange: (name: string, value: string) => void;
  onApply: () => void;
  onReset: () => void;
};

export function FilterPanel({ filters, onChange, onApply, onReset }: FilterPanelProps) {
  return (
    <Card className="p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="feature-filter" className="text-sm font-medium text-slate-700 mb-1">
            Feature
          </Label>
          <Select
            value={filters.feature}
            onValueChange={(value) => onChange("feature", value)}
          >
            <SelectTrigger id="feature-filter" className="mt-1 w-full">
              <SelectValue placeholder="Select feature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Features</SelectItem>
              <SelectItem value="payments">Payments</SelectItem>
              <SelectItem value="accounts">Accounts</SelectItem>
              <SelectItem value="investments">Investments</SelectItem>
              <SelectItem value="dashboard">Dashboard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="persona-filter" className="text-sm font-medium text-slate-700 mb-1">
            User Persona
          </Label>
          <Select
            value={filters.persona}
            onValueChange={(value) => onChange("persona", value)}
          >
            <SelectTrigger id="persona-filter" className="mt-1 w-full">
              <SelectValue placeholder="Select persona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Personas</SelectItem>
              <SelectItem value="power">Power Users</SelectItem>
              <SelectItem value="casual">Casual Users</SelectItem>
              <SelectItem value="new">New Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="platform-filter" className="text-sm font-medium text-slate-700 mb-1">
            Platform
          </Label>
          <Select
            value={filters.platform}
            onValueChange={(value) => onChange("platform", value)}
          >
            <SelectTrigger id="platform-filter" className="mt-1 w-full">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="ios">iOS</SelectItem>
              <SelectItem value="android">Android</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="metric-filter" className="text-sm font-medium text-slate-700 mb-1">
            Metric Type
          </Label>
          <Select
            value={filters.metricType}
            onValueChange={(value) => onChange("metricType", value)}
          >
            <SelectTrigger id="metric-filter" className="mt-1 w-full">
              <SelectValue placeholder="Select metric type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="velocity">Velocity</SelectItem>
              <SelectItem value="adoption">Adoption</SelectItem>
              <SelectItem value="usability">Usability</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-slate-700"
        >
          <Refresh className="text-slate-400 mr-1 text-base" />
          Reset Filters
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onApply}
          className="ml-3"
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}
