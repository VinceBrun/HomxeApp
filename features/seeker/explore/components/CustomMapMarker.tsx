import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

interface CustomMapMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  image?: string;
  isSelected?: boolean;
  onPress?: () => void;
  size?: "small" | "medium" | "large";
  borderColor?: string;
}

export default function CustomMapMarker({
  coordinate,
  image,
  isSelected = false,
  onPress,
  size = "medium",
  borderColor,
}: CustomMapMarkerProps) {
  const sizeValue = size === "small" ? 40 : size === "large" ? 70 : 50;
  const borderWidth = isSelected ? 4 : 3;

  const defaultBorderColor =
    borderColor || (isSelected ? "#2D5F3F" : "#FFFFFF");

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      centerOffset={{ x: 0, y: 0 }}
    >
      <View
        style={[
          styles.markerContainer,
          {
            width: sizeValue + borderWidth * 2,
            height: sizeValue + borderWidth * 2,
          },
        ]}
      >
        <View
          style={[
            styles.markerBorder,
            {
              width: sizeValue + borderWidth * 2,
              height: sizeValue + borderWidth * 2,
              borderRadius: (sizeValue + borderWidth * 2) / 2,
              borderWidth,
              borderColor: defaultBorderColor,
            },
          ]}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={[
                styles.markerImage,
                {
                  width: sizeValue,
                  height: sizeValue,
                  borderRadius: sizeValue / 2,
                },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.placeholderImage,
                {
                  width: sizeValue,
                  height: sizeValue,
                  borderRadius: sizeValue / 2,
                },
              ]}
            />
          )}
        </View>

        {isSelected && <View style={styles.pulseOuter} />}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  markerBorder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerImage: {
    backgroundColor: "#E5E5E5",
  },
  placeholderImage: {
    backgroundColor: "#CBAA58",
  },
  pulseOuter: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(45, 95, 63, 0.2)",
  },
});
