import OptionList from "@/components/ui/profile/options/OptionsList";
import { OptionProps } from "@/types";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  options: OptionProps[];
};

const SettingsSection: React.FC<Props> = ({ title, options }) => {
  return (
    <View className="mb-3 px-2">
      <Text className="text-lg font-semibold mb-3 ml-5 text-gray-700">
        {title}
      </Text>
      <View>
        <OptionList optionsList={options} />
      </View>
    </View>
  );
};

export default SettingsSection;
