import React from 'react';
import { StyleSheet, View } from 'react-native';
// import Spacer from '@/components/ui/Spacer';
import Spacing from '@/constants/SPACING';
import { OptionProps } from '@/types';
import OptionList from './OptionsList';

type Props = {
  optionsList: OptionProps[];
  containerStyles?: View['props']['style'];
};
const OptionsListScreen: React.FC<Props> = ({
  optionsList,
  containerStyles,
}) => {
  return (
    <View style={[styles.container, containerStyles]}>
      <OptionList {...{ optionsList }} />
    </View>
  );
};

export default OptionsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Spacing.xl,
  },
});
