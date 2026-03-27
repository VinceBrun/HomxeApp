import { Ionicons } from "@expo/vector-icons";
import { ActivityType } from "../components/ActivityItem";

export type DashboardStats = {
  totalProperties: number;
  activeInquiries: number;
  monthlyEarnings: number;
  serviceRequests: number;
  occupancyRate: number;
  rentedProperties: number;
  vacantProperties: number;
  maintenanceProperties: number;
};

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: Date;
};

export type NearbyProperty = {
  id: string;
  name: string;
  location: string;
  distance: number;
  status: "rented" | "vacant" | "maintenance";
};

export type UpcomingEvent = {
  id: string;
  type: "inspection" | "payment" | "lease" | "maintenance";
  title: string;
  description: string;
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};
