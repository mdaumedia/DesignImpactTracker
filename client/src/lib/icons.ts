// This file re-exports Material Icons as React components
import React from "react";

// Helper to create icon components
const createIcon = (iconName: string) => (props: React.SVGProps<SVGSVGElement> & { className?: string }) => {
  const className = `material-icons ${props.className || ""}`;
  return React.createElement(
    'span', 
    { 
      className: className.trim(),
      style: props.style 
    },
    iconName
  );
};

// Dashboard & Navigation Icons
export const Dashboard = createIcon("dashboard");
export const Assessment = createIcon("assessment");
export const InsertChart = createIcon("insert_chart");
export const Settings = createIcon("settings");
export const Insights = createIcon("insights");
export const Menu = createIcon("menu");
export const Logout = createIcon("logout");

// Chart & Data Icons
export const QueryStats = createIcon("query_stats");
export const Speed = createIcon("speed");
export const TrendingUp = createIcon("trending_up");
export const ThumbsUp = createIcon("thumb_up");

// UI Action Icons
export const MoreVertical = createIcon("more_vert");
export const ArrowForward = createIcon("arrow_forward");
export const ArrowUpward = createIcon("arrow_upward");
export const ArrowDownward = createIcon("arrow_downward");
export const Search = createIcon("search");
export const Notifications = createIcon("notifications");
export const HelpOutline = createIcon("help_outline");
export const FileDownload = createIcon("file_download");
export const Refresh = createIcon("refresh");
export const Star = createIcon("star");

// Payments & Finance Icons
export const Payments = createIcon("payments");
export const AccountBalance = createIcon("account_balance");

// Data & System Icons
export const Database = createIcon("storage");
