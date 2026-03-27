import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Divider } from "react-native-paper";

function DividerWithText({ text = "OR" }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 12 }}
    >
      <Divider style={{ flex: 1 }} />
      <Text style={{ marginHorizontal: 10 }}>{text}</Text>
      <Divider style={{ flex: 1 }} />
    </View>
  );
}

export default DividerWithText;
