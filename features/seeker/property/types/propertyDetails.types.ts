import { Property, Review } from "@/types";

export type Landlord = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone_number: string | null;
};

export type ReviewWithTenant = Review & {
  tenant: {
    full_name: string;
    avatar_url: string | null;
  };
};

export interface PropertyDetailsState {
  property: Property | null;
  landlord: Landlord | null;
  reviews: ReviewWithTenant[];
  similarProperties: Property[];
  loading: boolean;
  isSaved: boolean;
}
