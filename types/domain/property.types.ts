import { Database } from "../database.types";

// ============================================================
// DATABASE TYPES (from Supabase)
// ============================================================

export type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyInsert =
  Database["public"]["Tables"]["properties"]["Insert"];
export type PropertyUpdate =
  Database["public"]["Tables"]["properties"]["Update"];

export type PropertyAmenityRow =
  Database["public"]["Tables"]["property_amenities"]["Row"];
export type SavedPropertyRow =
  Database["public"]["Tables"]["saved_properties"]["Row"];
export type PropertyViewRow =
  Database["public"]["Tables"]["property_views"]["Row"];

// ============================================================
// CORE PROPERTY TYPES
// ============================================================

/**
 * Complete Property with all fields
 * Use this for property details screens
 */
export interface Property {
  id: string;
  landlord_id: string;
  title: string;
  description: string | null;
  type: string;
  location: string;
  price: number;
  images: string[] | null;
  videos: string[] | null;
  facilities: PropertyFacilities | null;
  is_available: boolean;
  created_at: string;
  updated_at: string | null;
  category: string | null;
  status: PropertyStatus;
  latitude: number | null;
  longitude: number | null;

  // Enhanced fields (from migration)
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  building_age: string | null;
  floor_number: number | null;
  total_floors: number | null;
  parking_spaces: number | null;
  furnishing_status: FurnishingStatus | null;
  views_count: number;

  // ✅ NEW FIELDS: Property creation additional data
  house_rules?: string[] | null;
  security_deposit?: number | string | null;
  agent_fee?: number | string | null;
  legal_fee?: number | string | null;
  payment_terms?: string[] | null;
  lease_duration?: string | null;
  available_from?: string | null;
}

/**
 * Property with landlord info
 * Use for property cards/lists
 */
export interface PropertyWithLandlord extends Property {
  landlord: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone_number: string | null;
  };
}

/**
 * Property with statistics
 * Use for landlord dashboard
 */
export interface PropertyWithStats extends Property {
  total_views: number;
  total_saves: number;
  total_bookings: number;
  completed_tours: number;
  average_rating: number | null;
  total_reviews: number;
}

/**
 * Lightweight property for lists
 * Use for search results, map markers
 */
export interface PropertyListItem {
  id: string;
  name: string;
  address: string;
  type: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  images: string[] | null;
  is_available: boolean;
  latitude: number | null;
  longitude: number | null;
  views: number;
  inquiries: number;
  listedDaysAgo: number;
  status: PropertyStatus;
}

// ============================================================
// PROPERTY ENUMS & CONSTANTS
// ============================================================

export type PropertyStatus =
  | "draft"
  | "listed"
  | "rented"
  | "maintenance"
  | "delisted";

export type PropertyType =
  | "apartment"
  | "house"
  | "duplex"
  | "villa"
  | "penthouse"
  | "studio"
  | "condo"
  | "townhouse"
  | "cottage"
  | "bungalow"
  | "mansion"
  | "loft"
  | "terraced"
  | "semi_detached"
  | "flat"
  | "maisonette";

export type FurnishingStatus = "furnished" | "semi-furnished" | "unfurnished";

export type BuildingAge = "new" | "1-5" | "6-10" | "10+";

// ============================================================
// PROPERTY FACILITIES
// ============================================================

export interface PropertyFacilities {
  // Utilities
  parking?: boolean;
  wifi?: boolean;
  ac?: boolean;
  heating?: boolean;

  // Security
  security?: boolean;
  cctv?: boolean;
  gated?: boolean;

  // Amenities
  generator?: boolean;
  pool?: boolean;
  gym?: boolean;
  garden?: boolean;
  balcony?: boolean;
  elevator?: boolean;

  // Appliances
  furnished?: boolean;
  kitchen?: boolean;
  laundry?: boolean;

  // Other
  pets?: boolean;
  storage?: boolean;
  playground?: boolean;
  fireplace?: boolean;
}

export type AmenityKey = keyof PropertyFacilities;

// Map amenity keys to display info
export interface AmenityInfo {
  key: AmenityKey;
  label: string;
  icon: string; // Ionicons name
  category: "utilities" | "security" | "amenities" | "appliances" | "other";
}

export const AMENITY_MAP: Record<AmenityKey, Omit<AmenityInfo, "key">> = {
  // Utilities
  parking: { label: "Parking", icon: "car-outline", category: "utilities" },
  wifi: { label: "WiFi", icon: "wifi-outline", category: "utilities" },
  ac: {
    label: "Air Conditioning",
    icon: "snow-outline",
    category: "utilities",
  },
  heating: { label: "Heating", icon: "flame-outline", category: "utilities" },

  // Security
  security: {
    label: "24/7 Security",
    icon: "shield-checkmark-outline",
    category: "security",
  },
  cctv: { label: "CCTV", icon: "videocam-outline", category: "security" },
  gated: {
    label: "Gated Community",
    icon: "lock-closed-outline",
    category: "security",
  },

  // Amenities
  generator: {
    label: "Generator",
    icon: "flash-outline",
    category: "amenities",
  },
  pool: {
    label: "Swimming Pool",
    icon: "water-outline",
    category: "amenities",
  },
  gym: { label: "Gym", icon: "barbell-outline", category: "amenities" },
  garden: { label: "Garden", icon: "leaf-outline", category: "amenities" },
  balcony: { label: "Balcony", icon: "home-outline", category: "amenities" },
  elevator: {
    label: "Elevator",
    icon: "arrow-up-circle-outline",
    category: "amenities",
  },

  // Appliances
  furnished: {
    label: "Furnished",
    icon: "bed-outline",
    category: "appliances",
  },
  kitchen: {
    label: "Modern Kitchen",
    icon: "restaurant-outline",
    category: "appliances",
  },
  laundry: { label: "Laundry", icon: "shirt-outline", category: "appliances" },

  // Other
  pets: { label: "Pet Friendly", icon: "paw-outline", category: "other" },
  storage: { label: "Storage", icon: "cube-outline", category: "other" },
  playground: {
    label: "Playground",
    icon: "football-outline",
    category: "other",
  },
  fireplace: { label: "Fireplace", icon: "bonfire-outline", category: "other" },
};

// ============================================================
// PROPERTY FILTERS
// ============================================================

export interface PropertyFilters {
  type?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  amenities?: AmenityKey[];
  furnishingStatus?: FurnishingStatus[];
  status?: PropertyStatus[];
  searchQuery?: string;
}

export interface PropertySortOptions {
  field: "price" | "created_at" | "views_count" | "title";
  direction: "asc" | "desc";
}

// ============================================================
// PROPERTY CREATION (Multi-step form)
// ============================================================

export interface PropertyDraft {
  // Step 1: Basic Info
  title?: string;
  description?: string;
  type?: PropertyType;
  category?: string;

  // Step 2: Location
  location?: string;
  latitude?: number;
  longitude?: number;

  // Step 3: Details
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  floor_number?: number;
  total_floors?: number;
  parking_spaces?: number;
  building_age?: BuildingAge;
  furnishing_status?: FurnishingStatus;

  // Step 4: Amenities
  facilities?: PropertyFacilities;

  // Step 5: Media & Pricing
  images?: string[];
  videos?: string[];
  price?: number;
}

export interface PropertyCreationStep {
  step: number;
  title: string;
  isComplete: boolean;
  data: Partial<PropertyDraft>;
}

// ============================================================
// PROPERTY VIEWS/ANALYTICS
// ============================================================

export interface PropertyView {
  id: string;
  property_id: string;
  viewer_id: string | null;
  view_source: "search" | "map" | "similar" | "saved" | "direct";
  device_type: "mobile" | "tablet" | "desktop";
  viewer_city: string | null;
  viewer_country: string | null;
  viewed_at: string;
}

export interface PropertyAnalytics {
  property_id: string;
  views_by_source: Record<PropertyView["view_source"], number>;
  views_by_device: Record<PropertyView["device_type"], number>;
  views_over_time: {
    date: string;
    count: number;
  }[];
  total_views: number;
  unique_viewers: number;
}

// ============================================================
// SAVED PROPERTIES
// ============================================================

export interface SavedProperty {
  id: string;
  property_id: string;
  tenant_id: string;
  created_at: string;
  property?: Property;
}

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * Property with specific relations loaded
 */
export type PropertyWith<T extends "landlord" | "stats" | "reviews"> =
  T extends "landlord"
    ? PropertyWithLandlord
    : T extends "stats"
      ? PropertyWithStats
      : Property;

/**
 * Use for type-safe property queries
 */
export interface PropertyQuery {
  filters?: PropertyFilters;
  sort?: PropertySortOptions;
  limit?: number;
  offset?: number;
  include?: ("landlord" | "stats" | "reviews")[];
}
