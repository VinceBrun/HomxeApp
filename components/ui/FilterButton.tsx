import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import Spacing from '@/constants/SPACING';
import Radius from '@/constants/RADIUS';
import { useThemeColor } from '@/hooks/useThemeColor';

type FilterButtonProps = {
  onPress: () => void;
};

const FilterButton: React.FC<FilterButtonProps> = ({ onPress }) => {
  const bg = useThemeColor({}, "card");
  const border = useThemeColor({}, "outlineBorder");

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[
        styles.container,
        { backgroundColor: bg, borderColor: border },
      ]}
    >
      <Image
        source={require('@/assets/icons/filter.png')}
        style={styles.icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    minHeight: 40,
    minWidth: 40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 1,
      },
    }),
  },
  icon: {
    width: 22,
    height: 22,
  },
});

export default FilterButton;
