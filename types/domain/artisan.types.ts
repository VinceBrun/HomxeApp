/**
 * ARTISAN DOMAIN TYPES
 * Artisan services and jobs type definitions
 * Used across: Artisan persona, Service requests
 */

import { Database } from "../database.types";

// ============================================================
// DATABASE TYPES (from Supabase)
// ============================================================

export type ArtisanServiceRow =
  Database["public"]["Tables"]["artisan_services"]["Row"];
export type ArtisanServiceInsert =
  Database["public"]["Tables"]["artisan_services"]["Insert"];
export type ArtisanServiceUpdate =
  Database["public"]["Tables"]["artisan_services"]["Update"];

export type ArtisanJobRow = Database["public"]["Tables"]["artisan_jobs"]["Row"];
export type ArtisanJobInsert =
  Database["public"]["Tables"]["artisan_jobs"]["Insert"];
export type ArtisanJobUpdate =
  Database["public"]["Tables"]["artisan_jobs"]["Update"];

// ============================================================
// ARTISAN SERVICE TYPES
// ============================================================

/**
 * Complete Artisan Service
 */
export interface ArtisanService {
  id: string;
  artisan_id: string;
  service_name: string;
  service_category: ServiceCategory;
  description: string;
  base_price: number;
  pricing_type: PricingType;
  available: boolean;
  service_areas: string[];
  service_images: string[];
  jobs_completed: number;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

/**
 * Service with artisan info
 */
export interface ArtisanServiceWithArtisan extends ArtisanService {
  artisan: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone_number: string | null;
    city: string | null;
  };
}

// ============================================================
// SERVICE ENUMS
// ============================================================

export type ServiceCategory =
  | "plumbing"
  | "electrical"
  | "carpentry"
  | "painting"
  | "hvac"
  | "roofing"
  | "landscaping"
  | "cleaning"
  | "pest_control"
  | "security"
  | "appliance_repair"
  | "general_maintenance";

export type PricingType = "fixed" | "hourly" | "per_sqft" | "negotiable";

// Service category info
export interface ServiceCategoryInfo {
  key: ServiceCategory;
  label: string;
  icon: string; // Ionicons name
  description: string;
}

export const SERVICE_CATEGORIES: Record<
  ServiceCategory,
  Omit<ServiceCategoryInfo, "key">
> = {
  plumbing: {
    label: "Plumbing",
    icon: "water-outline",
    description: "Pipe repairs, installations, drain cleaning",
  },
  electrical: {
    label: "Electrical",
    icon: "flash-outline",
    description: "Wiring, lighting, electrical repairs",
  },
  carpentry: {
    label: "Carpentry",
    icon: "hammer-outline",
    description: "Furniture, woodwork, installations",
  },
  painting: {
    label: "Painting",
    icon: "brush-outline",
    description: "Interior/exterior painting, finishing",
  },
  hvac: {
    label: "HVAC",
    icon: "snow-outline",
    description: "AC installation, repair, maintenance",
  },
  roofing: {
    label: "Roofing",
    icon: "home-outline",
    description: "Roof repairs, installations, waterproofing",
  },
  landscaping: {
    label: "Landscaping",
    icon: "leaf-outline",
    description: "Garden design, lawn care, tree services",
  },
  cleaning: {
    label: "Cleaning",
    icon: "sparkles-outline",
    description: "Deep cleaning, move-in/out cleaning",
  },
  pest_control: {
    label: "Pest Control",
    icon: "bug-outline",
    description: "Fumigation, pest removal, prevention",
  },
  security: {
    label: "Security",
    icon: "shield-checkmark-outline",
    description: "CCTV, alarm systems, access control",
  },
  appliance_repair: {
    label: "Appliance Repair",
    icon: "construct-outline",
    description: "Fix fridges, washers, ovens, etc.",
  },
  general_maintenance: {
    label: "General Maintenance",
    icon: "build-outline",
    description: "Various handyman services",
  },
};

// ============================================================
// ARTISAN JOB TYPES
// ============================================================

/**
 * Complete Artisan Job
 */
export interface ArtisanJob {
  id: string;
  service_id: string;
  artisan_id: string;
  client_id: string;
  property_id: string | null;

  // Job details
  job_title: string;
  job_description: string;
  job_status: JobStatus;

  // Pricing
  quoted_price: number | null;
  final_price: number | null;
  deposit_amount: number | null;
  deposit_paid: boolean;

  // Scheduling
  scheduled_date: string | null;
  scheduled_time: string | null;
  estimated_duration: number | null;

  // Location
  job_address: string;
  job_city: string;
  job_latitude: number | null;
  job_longitude: number | null;

  // Communication
  client_notes: string | null;
  artisan_notes: string | null;
  completion_notes: string | null;
  cancellation_reason: string | null;

  // Media
  before_images: string[];
  after_images: string[];

  // Timestamps
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
}

/**
 * Job with relations
 */
export interface ArtisanJobWithRelations extends ArtisanJob {
  service: ArtisanService;
  artisan: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone_number: string | null;
  };
  client: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone_number: string | null;
  };
  property?: {
    id: string;
    title: string;
    location: string;
  };
}

// ============================================================
// JOB ENUMS
// ============================================================

export type JobStatus =
  | "requested" // Client requested
  | "quote_sent" // Artisan sent quote
  | "accepted" // Client accepted quote
  | "in_progress" // Job in progress
  | "completed" // Job completed
  | "cancelled" // Job cancelled
  | "disputed"; // Dispute raised

// ============================================================
// JOB CREATION & MANAGEMENT
// ============================================================

export interface JobRequest {
  service_id: string;
  artisan_id: string;
  property_id?: string;
  job_title: string;
  job_description: string;
  job_address: string;
  job_city: string;
  job_latitude?: number;
  job_longitude?: number;
  client_notes?: string;
  preferred_date?: string;
  preferred_time?: string;
}

export interface JobQuote {
  job_id: string;
  quoted_price: number;
  estimated_duration: number;
  artisan_notes?: string;
}

export interface JobAcceptance {
  job_id: string;
  deposit_amount?: number;
}

export interface JobCompletion {
  job_id: string;
  final_price: number;
  completion_notes: string;
  after_images: string[];
}

// ============================================================
// ARTISAN FILTERS & QUERIES
// ============================================================

export interface ServiceFilters {
  category?: ServiceCategory[];
  pricing_type?: PricingType[];
  service_area?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  available_only?: boolean;
}

export interface JobFilters {
  status?: JobStatus[];
  category?: ServiceCategory[];
  date_from?: string;
  date_to?: string;
  city?: string;
}

export interface ServiceQuery {
  filters?: ServiceFilters;
  sort?: {
    field: "average_rating" | "jobs_completed" | "base_price" | "created_at";
    direction: "asc" | "desc";
  };
  limit?: number;
  offset?: number;
}

export interface JobQuery {
  filters?: JobFilters;
  sort?: {
    field: "created_at" | "scheduled_date" | "final_price";
    direction: "asc" | "desc";
  };
  limit?: number;
  offset?: number;
}

// ============================================================
// ARTISAN STATISTICS
// ============================================================

export interface ArtisanStats {
  total_services: number;
  total_jobs: number;
  completed_jobs: number;
  in_progress_jobs: number;
  average_rating: number;
  total_earnings: number;
  completion_rate: number;
}

export interface ArtisanEarnings {
  total_earned: number;
  current_month: number;
  last_month: number;
  by_month: {
    month: string;
    earnings: number;
  }[];
  by_service: {
    service_name: string;
    earnings: number;
  }[];
}

// ============================================================
// ARTISAN REVIEWS
// ============================================================

export interface ArtisanReview {
  id: string;
  job_id: string;
  artisan_id: string;
  client_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ArtisanReviewWithClient extends ArtisanReview {
  client: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  job: {
    id: string;
    job_title: string;
    completed_at: string;
  };
}
