/**
 * Seeker Dashboard
 * Primary discovery interface for tenants to browse properties and categories.
 */

import ActionCard from "@/components/ui/cards/ActionCard";
import PropertyCard from "@/components/ui/cards/PropertyCard";
import CircleImageCard from "@/components/ui/CircleImages";
import FilterButton from "@/components/ui/FilterButton";
import Header from "@/components/ui/Header";
import SearchBar from "@/components/ui/SearchBar";
import { Colors } from "@/constants/COLORS";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/providers/session";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");
  const onBackground = useThemeColor({}, "text");
  const brandGold = Colors.light.tertiary;
  const user = useUser();
  const userName = user?.user_metadata?.full_name || "Noha";
  const [location, setLocation] = useState("Main City-Napgur");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [topLandlords, setTopLandlords] = useState<any[]>([]);
  const [bestForYouProperties, setBestForYouProperties] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [greetingAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const initData = async () => {
      await Promise.all([fetchCategories(), fetchTopLandlords()]);
    };
    initData();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      fetchPropertiesByCategory(firstCategory);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    fetchBestForYouProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topLandlords]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("category")
        .eq("status", "listed")
        .neq("category", null);

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      // Merge existing categories with our default ones from constants to ensure UI is full
      const defaultCategories = [
        "house",
        "apartment",
        "villa",
        "duplex",
        "studio",
        "penthouse",
      ];
      const dbCategories = data.map((item) => item.category.toLowerCase());
      const uniqueCategories = Array.from(
        new Set([...defaultCategories, ...dbCategories]),
      );
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("fetchCategories catch:", err);
    }
  };

  const fetchTopLandlords = async () => {
    const { data, error } = await supabase
      .from("top_landlords_view")
      .select("*")
      .order("score", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching top landlords:", error);
      return;
    }

    setTopLandlords(data);
  };

  const fetchBestForYouProperties = async () => {
    if (topLandlords.length === 0) return;

    const top5LandlordIds = topLandlords
      .slice(0, 5)
      .map((landlord) => landlord.landlord_id);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .in("landlord_id", top5LandlordIds)
      .eq("status", "listed");

    if (error) {
      console.error("Error fetching best for you properties:", error);
      return;
    }

    setBestForYouProperties(data);
  };

  const fetchPropertiesByCategory = async (category: string) => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("category", category)
      .eq("status", "listed");

    if (error) {
      console.error("Filtered Properties error:", error.message);
    } else {
      console.log("Filtered Properties fetched for category:", category);
      console.log(data);
    }

    setFilteredProperties(data || []);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchCategories(), fetchTopLandlords()]);
    setRefreshing(false);
  };

  const animateGreeting = () => {
    Animated.sequence([
      Animated.timing(greetingAnim, {
        toValue: 1.15,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(greetingAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChangeLocation = () => {
    setLocation((prev) =>
      prev === "Main City-Napgur" ? "Lagos, Nigeria" : "Main City-Napgur",
    );
  };

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
    fetchPropertiesByCategory(category);
  };

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/properties-details?id=${propertyId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.stickyHeader, { backgroundColor: background }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Animated.View style={{ transform: [{ scale: greetingAnim }] }}>
              <Pressable onPress={animateGreeting}>
                <Text style={[styles.greetingText, { color: text }]}>
                  Hi,{" "}
                  <Text style={[styles.userNameText, { color: text }]}>
                    {userName.split(" ")[0]}
                  </Text>
                  !
                </Text>
              </Pressable>
            </Animated.View>
            <Pressable
              style={styles.locationRow}
              onPress={handleChangeLocation}
            >
              <Feather
                name="map-pin"
                size={16}
                color={brandGold}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[styles.locationText, { color: brandGold }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Location, {location}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={brandGold}
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          </View>

          <View style={styles.headerButtonRow}>
            <TouchableOpacity
              style={styles.bookingBtn}
              onPress={() => router.push("/bookings")}
              activeOpacity={0.85}
            >
              <Text style={styles.bookingBtnText}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={onBackground}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder="Search here..."
              renderIcon={() => (
                <FontAwesome name="search" size={18} color={secondary} />
              )}
            />
          </View>
          <FilterButton onPress={() => console.log("Filter Button Pressed")} />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.light.primary]}
          />
        }
      >
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((category) => (
              <ActionCard
                key={category}
                variant="category"
                title={category}
                selected={activeCategory === category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.propertyRow}
          >
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={{
                    id: property.id,
                    image: property.images?.[0] || null,
                    name: property.title,
                    rating: 4.5,
                    location: property.location,
                  }}
                  variant="default"
                  onPress={() => handlePropertyPress(property.id)}
                />
              ))
            ) : (
              <View style={{ width: width - Spacing.lg * 2 }}>
                <Text style={[styles.emptyCategoryText, { color: secondary }]}>
                  Please select a category above to see our listings
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <Header
          variant="sub"
          title="Near You"
          actionText="See More"
          onActionPress={() => console.log("Show all pressed")}
        />
        <View style={styles.nearYouRow}>
          {[
            {
              id: 1,
              image: require("@/assets/images/Estate1.png"),
              name: "Colosseum",
              location: "Rome, Italy",
            },
            {
              id: 2,
              image: require("@/assets/images/Estate2.png"),
              name: "Mount Bromo",
              location: "Indonesia",
            },
          ].map((property) => (
            <TouchableOpacity
              key={property.id}
              onPress={() => router.push(`/properties-details`)}
              activeOpacity={0.8}
              style={styles.nearYouCard}
            >
              <PropertyCard
                property={{
                  id: property.id.toString(),
                  image: property.image,
                  name: property.name,
                  location: property.location,
                }}
                variant="compact"
                onPress={() => router.push(`/properties-details`)}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Header
          variant="sub"
          title="Top Landlords"
          actionText="See More"
          onActionPress={() => router.push("/top-landlords-details")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topLandlordRow}
        >
          {topLandlords.length > 0 ? (
            topLandlords.map((landlord) => (
              <TouchableOpacity
                key={landlord.landlord_id}
                onPress={() =>
                  router.push(
                    `/landlord-details?landlord_id=${landlord.landlord_id}`,
                  )
                }
                activeOpacity={0.8}
              >
                <CircleImageCard
                  image={
                    landlord.avatar_url
                      ? { uri: landlord.avatar_url }
                      : require("@/assets/images/Andrew.png")
                  }
                  label={landlord.full_name}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ width: width - Spacing.lg * 2 }}>
              <Text style={styles.emptyLandlordText}>
                No top landlords found yet.
              </Text>
            </View>
          )}
        </ScrollView>

        <Header
          variant="sub"
          title="Best for you"
          actionText="See More"
          onActionPress={() => console.log("Show all pressed")}
        />
        <View style={styles.bestForYouWrap}>
          {bestForYouProperties.length > 0 ? (
            bestForYouProperties.map((property) => (
              <TouchableOpacity
                key={property.id}
                onPress={() => router.push(`/properties-details`)}
                style={styles.bestForYouCard}
                activeOpacity={0.8}
              >
                <PropertyCard
                  property={{
                    id: property.id,
                    image: property.images?.[0] || null,
                    address: property.address || "Unknown address",
                    rent: `₦${property.rent?.toLocaleString() || "0"} / Year`,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                  }}
                  variant="list"
                  onPress={() => router.push(`/properties-details`)}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ width: width - Spacing.lg * 2 }}>
              <Text style={[styles.emptyBestForYouText, { color: brandGold }]}>
                No recommended listings just yet! Check back later or explore
                available properties.
              </Text>
            </View>
          )}
        </View>
        <View style={{ height: 64 + Spacing.sm }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.none,
    paddingTop: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },

  greetingText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "PoppinsBlack",
    marginBottom: 2,
  },
  userNameText: {
    fontWeight: "700",
    fontFamily: "PoppinsBlack",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationText: {
    fontFamily: "PoppinsRegular",
    fontSize: 13.5,
    fontWeight: "500",
  },
  headerButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bookingBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  bookingBtnText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "PoppinsMedium",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  searchBarContainer: {
    borderRadius: Radius.md,
    backgroundColor: "#F4F6F8",
    minHeight: 44,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    marginRight: 0,
  },
  searchBarInput: {
    fontSize: 15,
    fontFamily: "PoppinsRegular",
    color: "#222",
    paddingVertical: 0,
  },
  categoryRow: {
    paddingVertical: 2,
    gap: 6,
  },
  propertyRow: {
    paddingVertical: 2,
    minHeight: 130,
    alignItems: "center",
  },
  emptyCategoryText: {
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "PoppinsMedium",
    fontSize: 13.5,
    alignSelf: "center",
  },
  nearYouRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: Spacing.lg,
    marginTop: 2,
  },
  nearYouCard: {
    width: (width - Spacing.md * 2 - Spacing.xxs) / 2,
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  topLandlordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
  },
  emptyLandlordText: {
    textAlign: "center",
    marginVertical: 10,
    color: Colors.light.secondary,
    fontFamily: "PoppinsMedium",
    fontSize: 13.5,
    alignSelf: "center",
  },
  bestForYouWrap: {
    marginTop: Spacing.sm,
    marginBottom: 0,
  },
  bestForYouCard: {
    marginBottom: Spacing.xs,
  },
  emptyBestForYouText: {
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "PoppinsMedium",
    fontSize: 13.5,
    alignSelf: "center",
  },
  stickyHeader: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.background,
  },
});

export default Home;
