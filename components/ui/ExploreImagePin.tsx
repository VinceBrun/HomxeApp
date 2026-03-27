import React from 'react';
import { Image, Text, Pressable, StyleSheet } from 'react-native';
import Radius from '@/constants/RADIUS';
import Spacing from '@/constants/SPACING';
import Typography from '@/constants/TYPOGRAPHY';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ExploreImagePinProps {
  image: any;
  label?: string;
  onPress: () => void;
}

const ExploreImagePin: React.FC<ExploreImagePinProps> = ({ image, label, onPress }) => {
  const card = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');

  return (
    <Pressable style={[styles.wrapper, { backgroundColor: card }]} onPress={onPress}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      {label && <Text style={[styles.label, { color: text }]} numberOfLines={1}>{label}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 64,
    alignItems: 'center',
    borderRadius: Radius.md,
    marginRight: Spacing.sm,
    paddingVertical: Spacing.xxs,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    marginBottom: Spacing.xxs,
  },
  label: {
    fontSize: Typography.fontSize.h6,
    textAlign: 'center',
    maxWidth: 64,
  },
});

export default ExploreImagePin;
