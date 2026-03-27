import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Alert, Animated } from "react-native";
import { usePropertyCreate } from "../context/PropertyCreateContext";

export const useCreatePropertyPhotos = () => {
  const router = useRouter();
  const { data, updateData } = usePropertyCreate();

  const { photos, coverPhotoIndex } = data;

  const setPhotos = (val: string[]) => updateData({ photos: val });
  const setCoverPhotoIndex = (val: number) =>
    updateData({ coverPhotoIndex: val });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need camera roll permissions to upload photos",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 20 - photos.length,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    if (coverPhotoIndex === index) {
      setCoverPhotoIndex(0);
    } else if (coverPhotoIndex > index) {
      setCoverPhotoIndex(coverPhotoIndex - 1);
    }
  };

  const handleNext = () => {
    if (photos.length < 3) {
      Alert.alert(
        "More Photos Required",
        "Please upload at least 3 photos of your property",
      );
      return;
    }

    router.push("/(owner)/property/create/step5");
  };

  const isComplete = photos.length >= 3;
  const remainingPhotos = 20 - photos.length;

  return {
    photos,
    coverPhotoIndex,
    setCoverPhotoIndex,
    pickImages,
    removePhoto,
    handleNext,
    fadeAnim,
    isComplete,
    remainingPhotos,
  };
};
