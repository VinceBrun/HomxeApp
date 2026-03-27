import { useRef, useEffect } from "react";
import { Alert, Animated, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { usePropertyCreate } from "../context/PropertyCreateContext";

export const useCreatePropertyAmenities = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { data, updateData } = usePropertyCreate();

  const {
    description,
    selectedAmenities,
    houseRules,
    availableFrom,
  } = data;

  const setDescription = (val: string) => updateData({ description: val });
  const setSelectedAmenities = (val: string[]) => updateData({ selectedAmenities: val });
  const setHouseRules = (val: string[]) => updateData({ houseRules: val });
  const setAvailableFrom = (val: string) => updateData({ availableFrom: val });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(
      selectedAmenities.includes(amenityId)
        ? selectedAmenities.filter((id) => id !== amenityId)
        : [...selectedAmenities, amenityId]
    );
  };

  const updateHouseRule = (index: number, value: string) => {
    const newRules = [...houseRules];
    newRules[index] = value;
    setHouseRules(newRules);
  };

  const handleNext = () => {
    if (!description.trim() || description.length < 50) {
      Alert.alert(
        "Description Required",
        "Please write at least 50 characters describing your property"
      );
      return;
    }
    if (selectedAmenities.length === 0) {
      Alert.alert("Amenities Required", "Please select at least one amenity");
      return;
    }

    router.push("/(owner)/property/create/step3");
  };

  const isComplete = description.length >= 50 && selectedAmenities.length > 0;

  return {
    description,
    setDescription,
    selectedAmenities,
    toggleAmenity,
    houseRules,
    updateHouseRule,
    availableFrom,
    setAvailableFrom,
    handleNext,
    scrollViewRef,
    fadeAnim,
    isComplete,
  };
};
