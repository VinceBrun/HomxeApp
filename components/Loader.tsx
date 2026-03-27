import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

type Props = {
  size?: number;
};
const Loader: React.FC<Props> = ({ size }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size ?? 20} />
    </View>
  );
};

export default Loader;

// const styles = StyleSheet.create({}); // Unused
