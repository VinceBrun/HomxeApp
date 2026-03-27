import PropertyCard from "@/components/ui/cards/PropertyCard";
import EmptyState from "@/components/ui/EmptyState";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Property } from "@/types";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface NearbyPropertiesProps {
  properties: Property[];
  onPropertyPress: (id: string) => void;
  onSeeMore: () => void;
}

export default function NearbyProperties({
  properties,
  onPropertyPress,
  onSeeMore,
}: NearbyPropertiesProps) {
  const textColor = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Near You
        </Text>
        <TouchableOpacity onPress={onSeeMore}>
          <Text style={[styles.seeMore, { color: primary }]}>See more</Text>
        </TouchableOpacity>
      </View>

      {properties.length > 0 ? (
        <FlatList
          data={properties}
          renderItem={({ item }) => (
            <View style={styles.nearbyCardContainer}>
              <PropertyCard
                property={{
                  id: item.id,
                  image: item.images?.[0] || null,
                  name: item.title,
                  title: item.title,
                  location: item.location,
                  price: item.price,
                  bedrooms: item.bedrooms,
                  bathrooms: item.bathrooms,
                }}
                variant="compact"
                onPress={() => onPropertyPress(item.id)}
                style={styles.nearbyCard}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      ) : (
        <EmptyState
          icon="location-outline"
          title="No Nearby Properties"
          message="No properties found within 20km of your location. Try exploring other areas."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
  },
  seeMore: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
  },
  horizontalList: {
    paddingLeft: Spacing.lg,
    gap: Spacing.md,
  },
  nearbyCardContainer: {
    width: width * 0.65,
  },
  nearbyCard: {
    marginBottom: 0,
  },
});
