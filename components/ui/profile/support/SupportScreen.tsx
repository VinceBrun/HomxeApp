import Header from "@/components/ui/Header";
import Spacer from "@/components/ui/Spacer";
import { SupportCardProps } from "@/types";
import React from "react";
import { View } from "react-native";
import SupportOptionCardList from "./SupportOptionsCardList";

type Props = { settingsOptionsList: SupportCardProps[] };
const SupportScreen: React.FC<Props> = ({ settingsOptionsList }) => {
  return (
    <View>
      <Header variant="default" title="Support" />
      <Spacer size={"lg"} />
      <SupportOptionCardList settingsOptionsList={settingsOptionsList} />
    </View>
  );
};

export default SupportScreen;

// const styles = StyleSheet.create({});
