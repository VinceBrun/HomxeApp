import Spacer from "@/components/ui/Spacer";
import { Text } from "@/components/ui/Text";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SupportCardProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const SupportOptionCard: React.FC<SupportCardProps> = ({
  contextText,
  title,
  icon,
  onPress,
}) => {
  const border = useThemeColor({}, "outlineBorder");
  const onBackground = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");

  return (
    <View style={[styles.cardContainer, { borderColor: border }]}>
      <TouchableOpacity activeOpacity={0.82} onPress={onPress}>
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name={icon} size={Spacing.lg} color={onBackground} />
            <Spacer size="xxs" horizontal />
            <Text variant="h3" style={{ fontWeight: "700" }}>
              {title}
            </Text>
          </View>
          <Spacer size="xs" />
          <Text variant="h5" style={{ fontWeight: "500", color: muted }}>
            {contextText}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SupportOptionCard;

const styles = StyleSheet.create({
  cardContainer: {
    overflow: "hidden",
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});
