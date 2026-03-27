import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import Radius from '@/constants/RADIUS';
import Spacing from '@/constants/SPACING';
import { Message } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  message: Message;
  onCancel: () => void;
};

export default function ReplyPreviewBar({ message, onCancel }: Props) {
  const background = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.content}>
        <Text style={{ color: text }} numberOfLines={1}>
          Replying to: {message.content}
        </Text>
      </View>
      <TouchableOpacity onPress={onCancel}>
        <Ionicons name="close" size={20} color={text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
});
