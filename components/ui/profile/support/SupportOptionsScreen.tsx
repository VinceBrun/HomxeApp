import Header from "@/components/ui/Header";
import Spacer from "@/components/ui/Spacer";
import Spacing from "@/constants/SPACING";
import { SupportCardProps } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import SupportOptionsCardList from "./SupportOptionsCardList";

type Props = { settingsOptionsList: SupportCardProps[] };
const SupportOptionsScreen: React.FC<Props> = ({ settingsOptionsList }) => {
  return (
    <View style={styles.container}>
      <Header variant="default" title="Support" />
      <Spacer size={"lg"} />
      <SupportOptionsCardList settingsOptionsList={settingsOptionsList} />
    </View>
  );
};

export default SupportOptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Spacing.xl,
  },
});
