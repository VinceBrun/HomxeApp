import { useThemeColor } from "@/hooks/useThemeColor";
import React, { memo } from "react";
import { Text, View, StyleSheet } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: object;
  containerStyle?: object;
};

function Heading({ children, style, containerStyle }: Props) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        containerStyle,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: textColor },
          style,
        ]}
        className="text-3xl font-poppinsSemibold capitalize text-center"
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    
  },
});

export default memo(Heading);
