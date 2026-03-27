/**
 * USER DOMAIN TYPES
 * User, Profile, and Persona type definitions
 * Used across: All personas, Auth flow
 *
 * BACKWARDS COMPATIBILITY: Supports both snake_case (database) and camelCase (legacy)
 */

import { Database } from "../database.types";

// ============================================================
// DATABASE TYPES (from Supabase)
// ============================================================

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type UserPersonaRow =
  Database["public"]["Tables"]["user_personas"]["Row"];
export type UserPersonaInsert =
  Database["public"]["Tables"]["user_personas"]["Insert"];
export type UserPersonaUpdate =
  Database["public"]["Tables"]["user_personas"]["Update"];

// ============================================================
// PERSONA SYSTEM
// ============================================================

export type PersonaType = "seeker" | "owner" | "artisan";

// Legacy Role type (for backwards compatibility)
export type Role = "seeker" | "owner" | "artisan";

export interface UserPersona {
  id: string;
  user_id: string;
  type: PersonaType;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  kyc_status: KYCStatus;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type KYCStatus = "unverified" | "pending" | "verified" | "rejected";

// ============================================================
// PROFILE TYPES
// ============================================================

/**
 * Complete User Profile
 * Supports both snake_case (database) and camelCase (legacy) for compatibility
 */
export interface Profile {
  id: string;

  // Name - both formats supported
  full_name: string;
  fullName?: string; // Legacy alias

  // Phone - both formats supported
  phone_number: string;
  phoneNumber?: string; // Legacy alias

  // Email
  email: string | null;

  // Avatar - both formats supported
  avatar_url: string | null;
  avatar?: string | null; // Legacy alias (without _url suffix)

  // Bio
  bio: string | null;

  // Address
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postal_code: string | null;

  // Personal
  date_of_birth: string | null;

  // Persona
  current_persona_id: string | null;

  // Role (legacy support)
  role?: string[]; // Legacy field for backwards compatibility

  // Onboarding & Auth
  onboarding_completed: boolean;
  email_verified: boolean;
  biometrics_enabled: boolean;
  location_enabled: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Profile with active persona
 */
export interface ProfileWithPersona extends Profile {
  active_persona: UserPersona | null;
  all_personas: UserPersona[];
}

/**
 * Lightweight profile for cards/lists
 */
export interface ProfileListItem {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone_number: string;
  city: string | null;
}

// ============================================================
// USER WITH PERSONAS (from types/index.ts)
// ============================================================

export interface UserWithPersonas {
  profile: Profile;
  personas: UserPersona[];
  activePersona: UserPersona | null;
}

// Legacy User type for backwards compatibility with useUser hook
export interface User extends Profile {
  user?: Profile; // Some hooks return nested user object
  userProfile?: Profile; // Some hooks return userProfile
  data?: Profile; // Some hooks return data object
}

// ============================================================
// PROFILE UPDATE TYPES
// ============================================================

export interface ProfileUpdateData {
  full_name?: string;
  fullName?: string; // Legacy alias
  phone_number?: string;
  phoneNumber?: string; // Legacy alias
  email?: string;
  avatar_url?: string;
  avatar?: string; // Legacy alias
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  date_of_birth?: string;
}

export interface PersonaUpdateData {
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  metadata?: Record<string, any>;
}

// ============================================================
// ONBOARDING
// ============================================================

export interface OnboardingProgress {
  email_verified: boolean;
  phone_verified: boolean;
  profile_completed: boolean;
  persona_selected: boolean;
  kyc_completed: boolean;
  location_enabled: boolean;
  biometrics_enabled: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

// ============================================================
// KYC VERIFICATION
// ============================================================

export interface KYCVerification {
  id: string;
  user_id: string;
  id_type: IDType;
  id_image_url: string;
  selfie_image_url: string;
  status: KYCStatus;
  admin_comment: string | null;
  submitted_at: string;
  verified_at: string | null;
}

export type IDType =
  | "national_id"
  | "drivers_license"
  | "passport"
  | "voters_card";

export interface KYCSubmission {
  id_type: IDType;
  id_image_url: string;
  selfie_image_url: string;
}

// ============================================================
// USER SETTINGS
// ============================================================

export interface UserSettings {
  // Notifications
  push_notifications: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;

  // Notification types
  booking_notifications: boolean;
  payment_notifications: boolean;
  message_notifications: boolean;
  marketing_notifications: boolean;

  // Privacy
  profile_visibility: "public" | "private";
  show_phone_number: boolean;
  show_email: boolean;

  // Security
  biometrics_enabled: boolean;
  two_factor_enabled: boolean;

  // Preferences
  language: string;
  currency: string;
  theme: "light" | "dark" | "auto";
}

// ============================================================
// USER STATISTICS
// ============================================================

export interface UserStats {
  // For Seeker
  properties_viewed?: number;
  properties_saved?: number;
  bookings_made?: number;
  tours_completed?: number;

  // For Owner
  properties_listed?: number;
  properties_rented?: number;
  total_bookings?: number;
  total_revenue?: number;

  // For Artisan
  services_offered?: number;
  jobs_completed?: number;
  total_earnings?: number;
  average_rating?: number;

  // General
  account_age_days: number;
  last_active: string;
}

// ============================================================
// DEVICE TOKENS (for push notifications)
// ============================================================

export interface DeviceToken {
  id: string;
  user_id: string;
  token: string;
  platform: "ios" | "android" | "web";
  created_at: string;
}

// ============================================================
// USER QUERIES
// ============================================================

export interface UserQuery {
  search?: string;
  persona_type?: PersonaType;
  kyc_status?: KYCStatus;
  city?: string;
  limit?: number;
  offset?: number;
}

// ============================================================
// AUTH TYPES (from types/index.ts - keeping for compatibility)
// ============================================================

export type PasscodeCreationMode = "create" | "update" | "reset";

export interface OTPPayload {
  "verify-email-login": { email: string; password: string };
  "verify-email-signUp": { email: string; password: string };
  "reset-password": { newPassword: string };
  "change-password": object;
  "change-passcode": object;
}
