import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PropertyLocationProps {
  latitude: number | null;
  longitude: number | null;
  location: string;
}

export default function PropertyLocation({ latitude, longitude, location }: PropertyLocationProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const tertiary = useThemeColor({}, "tertiary");

  if (!latitude || !longitude) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Location
      </Text>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
          >
            <View
              style={[
                styles.customMarker,
                { backgroundColor: primary },
              ]}
            >
              <Ionicons name="home" size={20} color="#fff" />
            </View>
          </Marker>
        </MapView>

        <TouchableOpacity
          style={styles.mapOverlay}
          onPress={() => {
            // Open in maps app
          }}
        >
          <View
            style={[
              styles.mapOverlayContent,
              { backgroundColor: `${cardBg}F0` },
            ]}
          >
            <Ionicons name="navigate" size={20} color={primary} />
            <Text style={[styles.mapOverlayText, { color: textColor }]}>
              Open in Maps
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.addressCard}>
        <Ionicons name="location-outline" size={20} color={tertiary} />
        <Text style={[styles.addressText, { color: textColor }]}>
          {location}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.sm,
  },
  mapContainer: {
    height: 200,
    borderRadius: Radius.md,
    overflow: "hidden",
    marginBottom: Spacing.xs,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  mapOverlayContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  mapOverlayText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  addressText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
});
