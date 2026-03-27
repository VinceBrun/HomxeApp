import { SupportCardProps } from "@/types";
import React from "react";
import { View } from "react-native";
import SupportOptionCard from "./SupportOptionCard";

type Props = { settingsOptionsList: SupportCardProps[] };
const SupportOptionsCardList: React.FC<Props> = ({ settingsOptionsList }) => {
  return (
    <View style={{ paddingHorizontal: 30, gap: 16, display: "flex" }}>
      {settingsOptionsList.map((option, index) => (
        <SupportOptionCard {...option} key={option.title + index} />
      ))}
    </View>
  );
};

export default SupportOptionsCardList;
