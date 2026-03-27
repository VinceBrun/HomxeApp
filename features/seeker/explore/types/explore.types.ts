import { Property } from "@/types";

export interface ExploreProperty extends Property {
  distance?: number;
  size?: number | null; // UI compatibility
  isFavorite: boolean;
  rating: number; // Keep for now as it's used in sorting
  reviewCount: number; // Keep for now
  image: string | null; // Keep for convenience
}

export type ViewMode = "map" | "list";
export type SortOption =
  | "distance"
  | "price_low"
  | "price_high"
  | "rating"
  | "newest";

export interface UserLocation {
  latitude: number;
  longitude: number;
}
