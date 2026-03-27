/**
 * REVIEW DOMAIN TYPES
 * Review and rating type definitions
 * Used across: Seeker, Owner screens
 */

import { Database } from "../database.types";

// ============================================================
// DATABASE TYPES (from Supabase)
// ============================================================

export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
export type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];

// ============================================================
// CORE REVIEW TYPES
// ============================================================

/**
 * Complete Review
 */
export interface Review {
  id: string;
  property_id: string;
  tenant_id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;

  // Enhanced fields (from migration)
  landlord_response: string | null;
  landlord_response_at: string | null;
  helpful_count: number;
  reported: boolean;
}

/**
 * Review with reviewer info
 * Use for review lists/cards
 */
export interface ReviewWithReviewer extends Review {
  reviewer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

/**
 * Review with full relations
 * Use for review details
 */
export interface ReviewWithRelations extends Review {
  property: {
    id: string;
    title: string;
    images: string[];
    location: string;
  };
  reviewer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    city: string | null;
  };
}

// ============================================================
// REVIEW CREATION
// ============================================================

export interface ReviewSubmission {
  property_id: string;
  rating: number;
  comment: string;
}

export interface LandlordResponse {
  review_id: string;
  response: string;
}

// ============================================================
// REVIEW STATISTICS
// ============================================================

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recent_reviews: ReviewWithReviewer[];
}

export interface PropertyReviewStats extends ReviewStats {
  property_id: string;
  property_title: string;
}

// ============================================================
// REVIEW FILTERS & QUERIES
// ============================================================

export interface ReviewFilters {
  property_id?: string;
  tenant_id?: string;
  rating?: number[];
  has_landlord_response?: boolean;
  reported?: boolean;
  date_from?: string;
  date_to?: string;
}

export interface ReviewSortOptions {
  field: "created_at" | "rating" | "helpful_count";
  direction: "asc" | "desc";
}

export interface ReviewQuery {
  filters?: ReviewFilters;
  sort?: ReviewSortOptions;
  limit?: number;
  offset?: number;
  include?: ("reviewer" | "property")[];
}

// ============================================================
// REVIEW ACTIONS
// ============================================================

export interface ReviewAction {
  type: "helpful" | "report" | "respond" | "edit" | "delete";
  review_id: string;
  response?: string;
  reason?: string;
}

// ============================================================
// REVIEW HELPERS
// ============================================================

/**
 * Calculate rating breakdown percentage
 */
export interface RatingBreakdown {
  rating: 1 | 2 | 3 | 4 | 5;
  count: number;
  percentage: number;
}

/**
 * Review summary for property cards
 */
export interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
  recent_ratings: number[];
}
