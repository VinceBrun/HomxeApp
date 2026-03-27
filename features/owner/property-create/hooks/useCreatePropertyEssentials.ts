import { useRef, useEffect } from "react";
import { Alert, Animated, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { usePropertyCreate } from "../context/PropertyCreateContext";

export const useCreatePropertyEssentials = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { data, updateData } = usePropertyCreate();

  const {
    propertyType,
    propertyName,
    address,
    bedrooms,
    bathrooms,
    size,
  } = data;

  const setPropertyType = (val: string) => updateData({ propertyType: val });
  const setPropertyName = (val: string) => updateData({ propertyName: val });
  const setAddress = (val: string) => updateData({ address: val });
  const setBedrooms = (val: number) => updateData({ bedrooms: val });
  const setBathrooms = (val: number) => updateData({ bathrooms: val });
  const setSize = (val: string) => updateData({ size: val });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handlePropertyTypeSelect = (typeId: string) => {
    setPropertyType(typeId);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 350, animated: true });
    }, 300);
  };

  const handleNext = () => {
    if (!propertyType || !propertyName.trim() || !address.trim() || !size) {
      Alert.alert("Required Fields", "Please fill in all required fields");
      return;
    }
    router.push("/(owner)/property/create/step2");
  };

  const isComplete = !!propertyType && !!propertyName && !!address && !!size;

  return {
    propertyType,
    setPropertyType,
    propertyName,
    setPropertyName,
    address,
    setAddress,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    size,
    setSize,
    handleNext,
    handlePropertyTypeSelect,
    scrollViewRef,
    fadeAnim,
    isComplete,
  };
};
