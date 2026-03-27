import React, { createContext, useContext, useState, ReactNode } from "react";

export type PropertyCreateData = {
  // Step 1: Essentials
  propertyType: string;
  propertyName: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  size: string;

  // Step 2: Details
  description: string;
  selectedAmenities: string[];
  houseRules: string[];
  availableFrom: string;

  // Step 3: Pricing
  monthlyRent: string;
  securityDeposit: string;
  agentFee: string;
  legalFee: string;
  selectedPaymentTerms: string[];
  leaseDuration: string;

  // Step 4: Photos
  photos: string[];
  coverPhotoIndex: number;

  // Step 5: Review
  visibility: "public" | "private";
  agreeToTerms: boolean;
};

interface PropertyCreateContextType {
  data: PropertyCreateData;
  updateData: (newData: Partial<PropertyCreateData>) => void;
  resetData: () => void;
}

const initialData: PropertyCreateData = {
  propertyType: "",
  propertyName: "",
  address: "",
  bedrooms: 2,
  bathrooms: 2,
  size: "",
  description: "",
  selectedAmenities: [],
  houseRules: ["", "", ""],
  availableFrom: "",
  monthlyRent: "",
  securityDeposit: "",
  agentFee: "",
  legalFee: "",
  selectedPaymentTerms: [],
  leaseDuration: "",
  photos: [],
  coverPhotoIndex: 0,
  visibility: "public",
  agreeToTerms: false,
};

const PropertyCreateContext = createContext<PropertyCreateContextType | undefined>(
  undefined
);

export const PropertyCreateProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PropertyCreateData>(initialData);

  const updateData = (newData: Partial<PropertyCreateData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <PropertyCreateContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </PropertyCreateContext.Provider>
  );
};

export const usePropertyCreate = () => {
  const context = useContext(PropertyCreateContext);
  if (context === undefined) {
    throw new Error(
      "usePropertyCreate must be used within a PropertyCreateProvider"
    );
  }
  return context;
};
