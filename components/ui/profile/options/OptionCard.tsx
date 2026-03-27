import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Divider, Switch, useTheme } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { router } from "expo-router";
import { OptionProps } from "@/types";
import { Text } from "@/components/ui/Text";
import Spacing from "@/constants/SPACING";
import WarningConfirmationModal from "../WarningConfirmationModal";

type Props = {
  option: OptionProps;
  isLast: boolean;
};

const OptionCard: React.FC<Props> = ({ option, isLast }) => {
  const { icon, title, type } = option;
  const { colors } = useTheme();

  const [isDangerModalVisible, setIsDangerModalVisible] = useState(false);

  const isDanger = type === "dangerButton";
  const iconColor = isDanger ? colors.error : colors.onBackground;

  const handlePress = () => {
    switch (type) {
      case "navigator":
        router.push(option.destination as any);
        break;
      case "button":
        option.onPress?.();
        break;
      case "dangerButton":
        setIsDangerModalVisible(true);
        break;
      case "switch":
        option.onToggle?.();
        break;
      case "toggle":
        option.onToggle?.();
        break;
    }
  };

  const hideDangerModal = useCallback(() => setIsDangerModalVisible(false), []);

  const modalProps = {
    visible: isDangerModalVisible,
    onDismiss: hideDangerModal,
  };

  const CardContent = (
    <View>
      <View style={styles.cardContainer}>
        <View style={styles.iconTextContainer}>
          <Ionicons name={icon} size={24} color={iconColor} />
          <View>
            <Text
              variant="h5"
              style={[styles.title, isDanger && { color: colors.error }]}
            >
              {title}
            </Text>
            {option.titleSuffix && option.titleSuffix}
          </View>
        </View>

        {(type === "switch" || type === "toggle") ? (
          <Switch
            value={type === "switch" ? option.isSwitchOn : option.value}
            onValueChange={option.onToggle}
            style={{
              transform: [{ scale: moderateScale(0.8, 0.05) }],
            }}
            trackColor={{ true: "#196606", false: undefined }}
            thumbColor={(type === "switch" ? option.isSwitchOn : option.value) ? "white" : "black"}
          />
        ) : (
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={colors.onBackground}
          />
        )}
      </View>

      {!isLast && (
        <Divider
          style={{
            marginHorizontal: styles.cardContainer.paddingHorizontal,
          }}
        />
      )}
    </View>
  );

  return (
    <>
      {Platform.OS === "android" ? (
        <TouchableNativeFeedback onPress={handlePress}>
          <View>{CardContent}</View>
        </TouchableNativeFeedback>
      ) : (
        <View onTouchEnd={handlePress}>{CardContent}</View>
      )}

      {type === "dangerButton" && (
        <WarningConfirmationModal
          {...option}
          warningHeader={title}
          hideModal={hideDangerModal}
          modalProps={modalProps}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    height: 55,
    alignItems: "center",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  title: {
    fontWeight: "600",
  },
});

export default OptionCard;
export type OptionCardProps = {
  option: OptionProps;
  isLast: boolean;
};
