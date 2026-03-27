/**
 * TYPES INDEX
 * Central export point for all type definitions
 * Import from here: import { Property, Booking, etc. } from '@/types'
 */

// ============================================================
// DATABASE TYPES (Auto-generated from Supabase)
// ============================================================

// ============================================================
// LEGACY TYPES (from old types/index.ts - for compatibility)
// These are gradually being replaced by domain types above
// ============================================================

import type TextInput from "@/components/ui/TextInput";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import type { FieldValues, Path } from "react-hook-form";
import { ImageSourcePropType } from "react-native";

// ============================================================
// DOMAIN TYPES
// ============================================================

// Property types
export * from "./domain/property.types";

// Booking types
export * from "./domain/booking.types";

// User types
export * from "./domain/user.types";

// Review types
export * from "./domain/review.types";

// Payment types
export * from "./domain/payment.types";

// Artisan types
export * from "./domain/artisan.types";

// ============================================================
// API TYPES
// ============================================================

export * from "./api.types";

// ============================================================
// UI TYPES
// ============================================================

export * from "./ui.types";

// Navigation (keeping for now)
export type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Chat types (already well-defined, keeping as-is)
export type {
  RealtimePostgresChangesPayload,
  Session
} from "@supabase/supabase-js";
export type { FieldValues } from "react-hook-form";
export type { FlatListProps } from "react-native";

// Utility types
export type SetStateGeneric<T> = React.Dispatch<React.SetStateAction<T>>;
export type ValueOf<T> = T[keyof T];

// Option types (for settings screens)
interface BaseOptionProps {
  title: string;
  titleSuffix?: ReactNode;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface ButtonOptionProps extends BaseOptionProps {
  type: "button";
  onPress: () => void;
}

export interface NavigatorOptionProps extends BaseOptionProps {
  type: "navigator";
  destination: string;
  destinationParams?: Record<string, any>;
}

export interface SwitchOptionProps extends BaseOptionProps {
  type: "switch";
  isSwitchOn: boolean;
  onToggle: () => void;
}

export interface ToggleOptionProps extends BaseOptionProps {
  type: "toggle";
  value: boolean;
  onToggle: () => void;
}

export type OptionProps =
  | ButtonOptionProps
  | SwitchOptionProps
  | NavigatorOptionProps
  | ToggleOptionProps
  | DangerButtonOptionProps;

// Support types
export interface SupportCardProps extends BaseOptionProps {
  contextText: string;
  onPress: () => void;
}

export interface Clause {
  header: string;
  context: string;
}

// Warning Modal types
export interface WarningModalProps {
  warningIcon: BaseOptionProps["icon"];
  warningDescription: string;
  warningActionButtonText: string;
  warningHeader: string;
  onProceed: () => void;
}

export type DangerButtonOptionProps = {
  type: "dangerButton";
} & Omit<WarningModalProps, "warningHeader"> &
  BaseOptionProps;

// Product types (if still needed for examples)
export type Category = {
  id: number;
  name: string;
};

export type Color = {
  id: number;
  code: string;
};

export type Size = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  category: Category;
  description: string;
  image: ImageSourcePropType;
  reviews: number;
  rating: number;
  brand: string;
  colors: Color[];
  sizes: Size[];
};

// Onboarding
export interface OnboardingScreenProps {
  onComplete: () => void;
}

export interface AppIntroSliderRenderItemProps {
  key: string;
  title: string;
  image: any;
  text: string;
  backgroundColor: string;
}

// Tab View
export type TabViewRoute = {
  key: string;
  title: string;
};

// Event types
export type EventType = "INSERT" | "UPDATE" | "DELETE";

// Typing status
export interface TypingStatus {
  user_id: string;
  chat_id: string;
  is_typing: boolean;
  updated_at: string;
}

// ============================================================
// RE-EXPORT COMPATIBILITY ALIASES
// These allow old imports to still work while we migrate
// ============================================================

// Re-export some types with their old names for compatibility
export type { Booking as BookingType } from "./domain/booking.types";
export type { Payment as PaymentType } from "./domain/payment.types";
export type { Property as PropertyType } from "./domain/property.types";
export type { Review as ReviewType } from "./domain/review.types";
export type { Profile as ProfileType } from "./domain/user.types";

// ============================================================
// STATE UTILITY TYPES (Zustand helpers)
// ============================================================
export type ZustandSetStateArg<T> = T | ((prev: T) => T);
export type ZustandSetState<T> = (value: ZustandSetStateArg<T>) => void;

// ============================================================
// CHAT TYPES
// ============================================================
export interface ChatParticipant {
  id: string;
  display_name: string;
  display_image: string | null;
  role?: string | null;
  is_online?: boolean;
}

export interface ChatLastMessage {
  content: string;
  sent_at: string;
  sender_id: string;
}

export interface ChatRoom {
  id: string;
  status: "ACTIVE" | "ARCHIVED" | "BLOCKED" | "DELETED";
  participant: ChatParticipant;
  last_message: ChatLastMessage | null;
  unread_message_count: number;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "image" | "video" | "audio" | "file" | "system";
  media_url?: string | null;
  media_mime_type?: string | null;
  seen?: boolean;
  seen_by?: string[] | null;
  edited_at?: string | null;
  deleted?: boolean;
  reply_to_content?: string | null;
}

// ============================================================
// AUTH & ROUTER PARAM TYPES
// ============================================================
export type ConfirmEmailPageParams = {
  type: "verify-email-login" | "verify-email-signUp";
  email: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  serverActionType?: "verify-email";
  isNewUser?: "true" | "false";
};

export type CompleteAccountPageParams = {
  type: "complete-account-login" | "complete-account-signUp";
  email?: string;
  password?: string;
};

// ============================================================
// FORM TYPES
// ============================================================
export type FormFieldInitialType<T extends FieldValues> = {
  formLabel: string;
  name: Path<T>;
  fieldIndex: number;
  fullName?: string;
} & Omit<
  React.ComponentProps<typeof TextInput>,
  "onSubmitEditing" | "value" | "onChangeText" | "onBlur"
>;
