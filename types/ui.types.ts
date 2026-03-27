/**
 * UI TYPES
 * Component prop and UI-related type definitions
 * Used across: All UI components
 */

import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import {
    GestureResponderEvent,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";

// ============================================================
// BUTTON TYPES
// ============================================================

export interface ButtonProps extends TouchableOpacityProps {
  // New unified API
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  onPress?: () => void;
  children?: ReactNode;

  // Legacy API (for backward compatibility)
  title?: string;
  handlePress?: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
  containerStyles?: string;
  textStyles?: string;
}

// ============================================================
// CARD TYPES
// ============================================================

export interface CardProps {
  variant?: "default" | "elevated" | "outlined";
  onPress?: () => void;
  children: ReactNode;
  style?: ViewStyle;
}

// Property Card
export interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    bedrooms?: number | null;
    bathrooms?: number | null;
    type: string;
  };
  onPress: (id: string) => void;
  variant?: "default" | "compact" | "featured";
  showSaveButton?: boolean;
  isSaved?: boolean;
  onSave?: (id: string) => void;
}

// Booking Card
export interface BookingCardProps {
  booking: {
    id: string;
    tour_date: string;
    tour_time: string;
    status: string;
    property: {
      title: string;
      location: string;
      images: string[];
    };
  };
  onPress: (id: string) => void;
  onCancel?: (id: string) => void;
  variant?: "default" | "compact";
}

// Review Card
export interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    reviewer: {
      full_name: string;
      avatar_url: string | null;
    };
  };
  onPress?: (id: string) => void;
  showLandlordResponse?: boolean;
}

// ============================================================
// HEADER TYPES
// ============================================================

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  variant?: "default" | "minimal" | "transparent" | "search";
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  searchProps?: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
  };
}

// ============================================================
// INPUT TYPES
// ============================================================

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  required?: boolean;
}

export interface SelectInputProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// ============================================================
// MODAL TYPES
// ============================================================

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: "center" | "bottom" | "fullscreen";
  showCloseButton?: boolean;
}

// ============================================================
// EMPTY STATE TYPES
// ============================================================

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "compact";
}

// ============================================================
// LOADING TYPES
// ============================================================

export interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

// ============================================================
// LIST TYPES
// ============================================================

export interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  error?: string | null;
}

// ============================================================
// FILTER TYPES
// ============================================================

export interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  filters: any;
  onReset: () => void;
}

// ============================================================
// STATS TYPES
// ============================================================

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

// ============================================================
// AVATAR TYPES
// ============================================================

export interface AvatarProps {
  imageUrl?: string | null;
  name: string;
  size?: "small" | "medium" | "large" | "xlarge";
  variant?: "circle" | "rounded";
  onPress?: () => void;
}

// ============================================================
// BADGE TYPES
// ============================================================

export interface BadgeProps {
  text: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "small" | "medium";
  icon?: keyof typeof Ionicons.glyphMap;
}

// ============================================================
// RATING TYPES
// ============================================================

export interface RatingProps {
  rating: number;
  max?: number;
  size?: "small" | "medium" | "large";
  editable?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
}

// ============================================================
// SEARCH BAR TYPES
// ============================================================

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  showFilterButton?: boolean;
  onFilterPress?: () => void;
  variant?: "default" | "minimal";
}

// ============================================================
// TAB TYPES
// ============================================================

export interface TabItem {
  key: string;
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  variant?: "default" | "pills" | "underline";
}

// ============================================================
// BOTTOM SHEET TYPES
// ============================================================

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  snapPoints?: string[];
  children: ReactNode;
  title?: string;
}

// ============================================================
// IMAGE TYPES
// ============================================================

export interface ImageCarouselProps {
  images: string[];
  height?: number;
  showCounter?: boolean;
  onImagePress?: (index: number) => void;
}

// ============================================================
// MAP TYPES
// ============================================================

export interface MapMarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  price?: number;
}

export interface MapProps {
  markers: MapMarkerData[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMarkerPress: (id: string) => void;
  showUserLocation?: boolean;
}
