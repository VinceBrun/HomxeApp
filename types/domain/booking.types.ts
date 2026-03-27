/**
 * BOOKING DOMAIN TYPES
 * Property tour and booking type definitions
 * Used across: Seeker, Owner screens
 */

import { Database } from "../database.types";
import { Property } from "./property.types";

// ============================================================
// DATABASE TYPES (from Supabase)
// ============================================================

export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

// ============================================================
// CORE BOOKING TYPES
// ============================================================

/**
 * Complete Booking/Tour
 */
export interface Booking {
  id: string;
  property_id: string;
  seeker_id: string;
  landlord_id: string;

  // Tour details
  tour_date: string; // ISO date
  tour_time: string; // HH:MM format
  status: BookingStatus;
  booking_type: BookingType;

  // Communication
  seeker_notes: string | null;
  landlord_notes: string | null;
  cancellation_reason: string | null;
  cancelled_by: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
}

/**
 * Booking with property details
 * Use for booking lists/cards
 */
export interface BookingWithProperty extends Booking {
  property: {
    id: string;
    title: string;
    location: string;
    images: string[];
    type: string;
    price: number;
  };
}

/**
 * Booking with full relations
 * Use for booking details screen
 */
export interface BookingWithRelations extends Booking {
  property: Property;
  seeker: {
    id: string;
    full_name: string;
    phone_number: string | null;
    avatar_url: string | null;
  };
  landlord: {
    id: string;
    full_name: string;
    phone_number: string | null;
    avatar_url: string | null;
  };
}

// ============================================================
// BOOKING ENUMS
// ============================================================

export type BookingStatus =
  | "pending" // Awaiting landlord confirmation
  | "confirmed" // Landlord confirmed
  | "completed" // Tour completed
  | "cancelled" // Cancelled by either party
  | "no-show"; // Seeker didn't show up

export type BookingType =
  | "in-person" // Physical property tour
  | "virtual"; // Virtual tour (video call)

// ============================================================
// BOOKING CREATION
// ============================================================

export interface BookingRequest {
  property_id: string;
  landlord_id: string;
  tour_date: string;
  tour_time: string;
  booking_type: BookingType;
  seeker_notes?: string;
}

export interface BookingConfirmation {
  booking_id: string;
  landlord_notes?: string;
}

export interface BookingCancellation {
  booking_id: string;
  cancellation_reason: string;
}

// ============================================================
// BOOKING FILTERS & QUERIES
// ============================================================

export interface BookingFilters {
  status?: BookingStatus[];
  booking_type?: BookingType[];
  date_from?: string;
  date_to?: string;
  property_id?: string;
}

export interface BookingSortOptions {
  field: "tour_date" | "created_at" | "status";
  direction: "asc" | "desc";
}

export interface BookingQuery {
  filters?: BookingFilters;
  sort?: BookingSortOptions;
  limit?: number;
  offset?: number;
  include?: ("property" | "seeker" | "landlord")[];
}

// ============================================================
// BOOKING STATISTICS
// ============================================================

export interface BookingStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  no_show_bookings: number;
  completion_rate: number; // percentage
  cancellation_rate: number; // percentage
}

export interface BookingsByMonth {
  month: string; // YYYY-MM
  total: number;
  completed: number;
  cancelled: number;
}

// ============================================================
// BOOKING CALENDAR
// ============================================================

export interface BookingSlot {
  date: string;
  time: string;
  available: boolean;
  booking_id?: string;
}

export interface AvailabilityCalendar {
  property_id: string;
  dates: Record<string, BookingSlot[]>; // date -> slots
}

// ============================================================
// BOOKING ACTIONS
// ============================================================

export interface BookingAction {
  type: "confirm" | "cancel" | "complete" | "reschedule";
  booking_id: string;
  notes?: string;
  new_date?: string;
  new_time?: string;
}

// ============================================================
// BOOKING NOTIFICATIONS
// ============================================================

export interface BookingNotification {
  booking_id: string;
  type:
    | "booking_requested"
    | "booking_confirmed"
    | "booking_cancelled"
    | "booking_reminder"
    | "booking_completed";
  recipient_id: string;
  message: string;
}
