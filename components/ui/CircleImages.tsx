import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Spacing from '@/constants/SPACING';
import Radius from '@/constants/RADIUS';
import Typography from '@/constants/TYPOGRAPHY';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Props {
  image: any;
  label: string;
}

const CircleImageCard: React.FC<Props> = ({ image, label }) => {
  const text = useThemeColor({}, 'text');
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.Image source={image} style={[styles.image, animatedStyle]} resizeMode="cover" />
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
  },
  label: {
    marginTop: Spacing.xxs,
    fontSize: Typography.fontSize.h6,
  },
});

export default CircleImageCard;
