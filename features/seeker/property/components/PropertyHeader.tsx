import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.45;

interface PropertyHeaderProps {
  title: string;
  scrollY: Animated.Value;
  onBack: () => void;
  onShare: () => void;
}

export default function PropertyHeader({
  title,
  scrollY,
  onBack,
  onShare,
}: PropertyHeaderProps) {
  const primary = useThemeColor({}, "primary");

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.animatedHeader,
        { backgroundColor: primary, opacity: headerOpacity },
      ]}
    >
      <SafeAreaView edges={["top"]}>
        <View style={styles.animatedHeaderContent}>
          <TouchableOpacity onPress={onBack} style={styles.headerBackButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.animatedHeaderTitle} numberOfLines={1}>
            {title}
          </Text>
          <TouchableOpacity onPress={onShare} style={styles.headerShareButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  animatedHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  animatedHeaderTitle: {
    flex: 1,
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemiBold",
    color: "#fff",
    marginHorizontal: Spacing.sm,
  },
  headerShareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
});
