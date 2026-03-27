import PropertyCard from "@/components/ui/cards/PropertyCard";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { ExploreProperty, UserLocation } from "../types/explore.types";
import CustomMapMarker from "./CustomMapMarker";

interface MapViewSectionProps {
  mapRef: React.RefObject<MapView>;
  bottomSheetRef: React.RefObject<BottomSheet>;
  userLocation: UserLocation | null;
  properties: ExploreProperty[];
  selectedProperty: ExploreProperty | null;
  onMarkerPress: (property: ExploreProperty) => void;
  onPropertyPress: (id: string) => void;
  onFavorite: (id: string) => void;
  onCenterUser: () => void;
  onViewList: () => void;
  onSort: () => void;
}

export default function MapViewSection({
  mapRef,
  bottomSheetRef,
  userLocation,
  properties,
  selectedProperty,
  onMarkerPress,
  onPropertyPress,
  onFavorite,
  onCenterUser,
  onViewList,
  onSort,
}: MapViewSectionProps) {
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation?.latitude || 4.8156,
          longitude: userLocation?.longitude || 7.0498,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {userLocation && (
          <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationInner} />
            </View>
          </Marker>
        )}

        {properties.map((property) => (
          <CustomMapMarker
            key={property.id}
            coordinate={{
              latitude: property.latitude || 4.8156,
              longitude: property.longitude || 7.0498,
            }}
            image={property.image || undefined}
            isSelected={selectedProperty?.id === property.id}
            onPress={() => onMarkerPress(property)}
            borderColor={primary}
          />
        ))}
      </MapView>

      <View style={styles.mapControls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: cardBg }]}
          onPress={onCenterUser}
        >
          <Ionicons name="locate" size={24} color={primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: cardBg }]}
          onPress={onViewList}
        >
          <Ionicons name="list" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        backgroundStyle={{ backgroundColor: cardBg }}
        handleIndicatorStyle={{ backgroundColor: mutedColor }}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}
        >
          <View style={styles.bottomSheetHeader}>
            <Text style={[styles.resultsText, { color: mutedColor }]}>
              {properties.length} properties nearby
            </Text>
            <TouchableOpacity style={styles.sortButton} onPress={onSort}>
              <Text style={[styles.sortText, { color: primary }]}>Sort</Text>
              <Ionicons name="chevron-down" size={16} color={primary} />
            </TouchableOpacity>
          </View>

          {selectedProperty && (
            <PropertyCard
              property={{
                id: selectedProperty.id,
                image: selectedProperty.image,
                name: selectedProperty.title,
                address: selectedProperty.location,
                price: selectedProperty.price,
                bedrooms: selectedProperty.bedrooms || undefined,
                bathrooms: selectedProperty.bathrooms || undefined,
                size: selectedProperty.size || undefined,
                type: selectedProperty.type,
              }}
              onPress={() => onPropertyPress(selectedProperty.id)}
              onFavorite={() => onFavorite(selectedProperty.id)}
              variant="list"
              isFavorited={selectedProperty.isFavorite}
              style={{ marginBottom: Spacing.md }}
            />
          )}

          <View style={styles.propertiesList}>
            {properties
              .filter((p) => p.id !== selectedProperty?.id)
              .map((property) => (
                <PropertyCard
                  key={property.id}
                  property={{
                    id: property.id,
                    image: property.image,
                    name: property.title,
                    address: property.location,
                    price: property.price,
                    bedrooms: property.bedrooms || undefined,
                    bathrooms: property.bathrooms || undefined,
                    size: property.size || undefined,
                    type: property.type,
                  }}
                  onPress={() => onPropertyPress(property.id)}
                  onFavorite={() => onFavorite(property.id)}
                  variant="list"
                  isFavorited={property.isFavorite}
                  style={{ marginBottom: Spacing.md }}
                />
              ))}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  userLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(45, 95, 63, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  userLocationInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2D5F3F",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  mapControls: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    gap: Spacing.sm,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSheetContent: { padding: Spacing.md },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
  propertiesList: { marginTop: Spacing.xs },
});
