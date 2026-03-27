import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Platform } from "react-native";
import { Checkbox, Switch as PaperSwitch } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";

type Props = { value: boolean; onValueChange: (v: boolean) => void };

const Switch: React.FC<Props> = ({ value, onValueChange }) => {
  const primary = useThemeColor({}, "primary");
  const outline = useThemeColor({}, "outlineBorder");

  if (Platform.OS === "ios") {
    return (
      <PaperSwitch
        style={{
          transform: [{ scale: moderateScale(0.8, 0.05) }],
        }}
        value={value}
        onValueChange={onValueChange}
        color={primary}
      />
    );
  }

  return (
    <Checkbox.Android
      status={value ? "checked" : "unchecked"}
      onPress={() => onValueChange(!value)}
      color={primary}
      uncheckedColor={outline}
    />
  );
};

export default Switch;
