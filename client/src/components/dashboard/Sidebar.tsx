import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Dashboard, 
  Assessment, 
  InsertChart, 
  Settings, 
  Logout,
  Insights
} from "@/lib/icons";

const NavItem = ({ 
  href, 
  icon, 
  children, 
  active = false 
}: { 
  href: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  active?: boolean;
}) => {
  return (
    <Link href={href}>
      <a className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md",
        active 
          ? "bg-primary-50 text-primary-700" 
          : "text-slate-600 hover:bg-slate-100"
      )}>
        <span className="mr-3">{icon}</span>
        {children}
      </a>
    </Link>
  );
};

const TeamItem = ({ 
  href, 
  color, 
  children, 
  active = false 
}: { 
  href: string; 
  color: string; 
  children: React.ReactNode; 
  active?: boolean;
}) => {
  return (
    <Link href={href}>
      <a className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md",
        active 
          ? "bg-slate-100 text-slate-900" 
          : "text-slate-600 hover:bg-slate-100"
      )}>
        <span className={`w-2 h-2 mr-3 ${color} rounded-full`}></span>
        {children}
      </a>
    </Link>
  );
};

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex md:w-64 bg-white border-r border-slate-200 flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
            <Insights className="text-white text-lg" />
          </div>
          <h1 className="font-display font-semibold text-lg text-slate-800">Design Impact</h1>
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-3">
        <div className="space-y-1">
          <NavItem 
            href="/" 
            icon={<Dashboard className="text-primary-500" />} 
            active={location === "/"}>
            Dashboard
          </NavItem>
          
          <NavItem 
            href="/metrics" 
            icon={<Assessment className="text-slate-400" />} 
            active={location === "/metrics"}>
            Metrics
          </NavItem>
          
          <NavItem 
            href="/reports" 
            icon={<InsertChart className="text-slate-400" />} 
            active={location === "/reports"}>
            Reports
          </NavItem>
          
          <NavItem 
            href="/settings" 
            icon={<Settings className="text-slate-400" />} 
            active={location === "/settings"}>
            Settings
          </NavItem>
        </div>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Teams
          </h3>
          <div className="mt-2 space-y-1">
            <TeamItem 
              href="/teams/design" 
              color="bg-secondary-500" 
              active={location === "/teams/design"}>
              Design
            </TeamItem>
            
            <TeamItem 
              href="/teams/product" 
              color="bg-amber-500" 
              active={location === "/teams/product"}>
              Product
            </TeamItem>
            
            <TeamItem 
              href="/teams/engineering" 
              color="bg-primary-500" 
              active={location === "/teams/engineering"}>
              Engineering
            </TeamItem>
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">JD</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">Jane Doe</p>
            <p className="text-xs text-slate-500 truncate">Head of Design</p>
          </div>
          <div>
            <button className="p-1 rounded-full text-slate-400 hover:text-slate-600">
              <Logout className="text-base" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
