import { useLocation } from "@/hooks/useLocation";
import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  DashboardStats,
  NearbyProperty,
  UpcomingEvent,
} from "../types/dashboard.types";

export const useDashboardData = () => {
  const { profile } = useProfile();
  const location = useLocation();
  const userId = profile?.id;
  const brandGold = "#CBAA58";

  const [locationText, setLocationText] = useState("Getting location...");
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeInquiries: 0,
    monthlyEarnings: 0,
    serviceRequests: 0,
    occupancyRate: 0,
    rentedProperties: 0,
    vacantProperties: 0,
    maintenanceProperties: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [nearbyProperties, setNearbyProperties] = useState<NearbyProperty[]>(
    [],
  );
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revenueData, setRevenueData] = useState<
    { month: string; amount: number }[]
  >([]);

  /**
   * Calculate distance between two coordinates
   */
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /**
   * Format time ago
   */
  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 2592000)} months ago`;
  };

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;

    try {
      // Fetch user location
      const userLocation = await location.getCurrentLocationWithAddress();
      if (userLocation?.address) {
        const parts = userLocation.address.split(",");
        const city = parts[parts.length - 2]?.trim() || "Port Harcourt";
        setLocationText(`Managing in ${city}`);
      } else {
        setLocationText("Managing in Port Harcourt");
      }

      // Fetch all data in parallel
      const [
        propertiesResult,
        paymentsResult,
        complaintsResult,
        tenanciesResult,
        inquiriesResult,
      ] = await Promise.all([
        // Properties
        supabase.from("properties").select("*").eq("landlord_id", userId),

        // Payments (current month)
        supabase
          .from("payments")
          .select("amount, created_at")
          .gte(
            "created_at",
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1,
            ).toISOString(),
          ),

        // Complaints (service requests)
        supabase.from("complaints").select("*").eq("status", "submitted"),

        // Active tenancies
        supabase
          .from("tenancies")
          .select("*, properties!inner(*)")
          .eq("status", "active"),

        // Inquiries (TODO: Create inquiries table)
        supabase
          .from("saved_properties")
          .select("*, properties!inner(*), profiles!inner(*)")
          .limit(10),
      ]);

      // Calculate stats
      const properties = propertiesResult.data || [];
      const totalProperties = properties.length;

      const monthlyEarnings =
        paymentsResult.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      const serviceRequests = complaintsResult.data?.length || 0;
      const rentedProperties = tenanciesResult.data?.length || 0;
      const activeInquiries = inquiriesResult.data?.length || 0;

      const maintenanceProperties = properties.filter(
        (p) => p.status === "maintenance",
      ).length;

      const vacantProperties = Math.max(
        0,
        totalProperties - rentedProperties - maintenanceProperties,
      );

      const occupancyRate =
        totalProperties > 0
          ? Math.round((rentedProperties / totalProperties) * 100)
          : 0;

      setStats({
        totalProperties,
        activeInquiries,
        monthlyEarnings,
        serviceRequests,
        occupancyRate,
        rentedProperties,
        vacantProperties,
        maintenanceProperties,
      });

      // Revenue trend data (last 6 months)
      const monthlyRevenue = await supabase
        .from("payments")
        .select("amount, created_at")
        .gte(
          "created_at",
          new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        )
        .order("created_at", { ascending: true });

      if (monthlyRevenue.data) {
        const revenueByMonth: Record<string, number> = {};
        monthlyRevenue.data.forEach((payment) => {
          const month = new Date(payment.created_at).toLocaleDateString(
            "en-US",
            { month: "short" },
          );
          revenueByMonth[month] =
            (revenueByMonth[month] || 0) + Number(payment.amount);
        });

        const revenueArray = Object.entries(revenueByMonth).map(
          ([month, amount]) => ({
            month,
            amount,
          }),
        );

        setRevenueData(revenueArray);
      }

      // Recent Activities (real data)
      const recentActivities: Activity[] = [];

      // Add recent inquiries
      if (inquiriesResult.data) {
        inquiriesResult.data.slice(0, 3).forEach((inquiry: any) => {
          recentActivities.push({
            id: inquiry.id,
            type: "inquiry",
            title: "New Inquiry",
            description: `${inquiry.profiles?.full_name || "Someone"} is interested in ${inquiry.properties?.title}`,
            timeAgo: getTimeAgo(new Date(inquiry.created_at)),
            timestamp: new Date(inquiry.created_at),
          });
        });
      }

      // Add recent payments
      if (paymentsResult.data) {
        paymentsResult.data.slice(0, 2).forEach((payment: any) => {
          recentActivities.push({
            id: payment.id,
            type: "payment",
            title: "Payment Received",
            description: `₦${Number(payment.amount).toLocaleString()} received`,
            timeAgo: getTimeAgo(new Date(payment.created_at)),
            timestamp: new Date(payment.created_at),
          });
        });
      }

      // Add recent complaints
      if (complaintsResult.data) {
        complaintsResult.data.slice(0, 2).forEach((complaint: any) => {
          recentActivities.push({
            id: complaint.id,
            type: "maintenance",
            title: "Service Request",
            description:
              complaint.description || "Maintenance request submitted",
            timeAgo: getTimeAgo(new Date(complaint.created_at)),
            timestamp: new Date(complaint.created_at),
          });
        });
      }

      // Sort activities by timestamp
      recentActivities.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      );
      setActivities(recentActivities.slice(0, 5));

      // Nearby Properties (real data with distances)
      if (userLocation && properties.length > 0) {
        const propertiesWithDistance = properties
          .filter((p) => p.latitude && p.longitude)
          .map((p) => {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              p.latitude!,
              p.longitude!,
            );

            let status: "rented" | "vacant" | "maintenance";
            if (p.status === "rented") status = "rented";
            else if (p.status === "maintenance") status = "maintenance";
            else status = "vacant";

            return {
              id: p.id,
              name: p.title,
              location: p.location,
              distance: Math.round(distance * 10) / 10, // Round to 1 decimal
              status,
            };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);

        setNearbyProperties(propertiesWithDistance);
      } else {
        setNearbyProperties([]);
      }

      // Upcoming Events (real data)
      const upcoming: UpcomingEvent[] = [];

      // Add lease renewals (tenancies ending soon)
      if (tenanciesResult.data) {
        const thirtyDaysFromNow = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        );

        tenanciesResult.data.forEach((tenancy: any) => {
          if (tenancy.end_date) {
            const endDate = new Date(tenancy.end_date);
            if (endDate <= thirtyDaysFromNow && endDate > new Date()) {
              const daysUntil = Math.ceil(
                (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
              );
              upcoming.push({
                id: tenancy.id,
                type: "lease",
                title: "Lease Renewal",
                description: `${tenancy.properties?.title} expires in ${daysUntil} days`,
                date: endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                icon: "document-text-outline",
                color: "#F59E0B",
              });
            }
          }
        });
      }

      // Add upcoming payments (due dates)
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(5); // Assuming rent due on 5th

      upcoming.push({
        id: "payment-1",
        type: "payment",
        title: "Rent Payment Due",
        description: `Expected payments on ${nextMonth.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        date: nextMonth.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        icon: "card-outline",
        color: brandGold,
      });

      // Sort upcoming events by date
      upcoming.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLocationText("Managing in Port Harcourt");
    } finally {
      setLoading(false);
    }
  }, [userId, location]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [fetchDashboardData]);

  return {
    locationText,
    stats,
    activities,
    nearbyProperties,
    upcomingEvents,
    revenueData, // For revenue chart
    loading,
    refreshing,
    onRefresh,
    ownerName: profile?.full_name?.split(" ")[0] || "Owner",
  };
};
