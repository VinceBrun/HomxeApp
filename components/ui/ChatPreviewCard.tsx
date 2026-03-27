import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Spacing from '@/constants/SPACING';
import Typography from '@/constants/TYPOGRAPHY';
import Radius from '@/constants/RADIUS';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = {
  name: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
  unread?: boolean;
  onPress: () => void;
};

const ChatPreviewCard: React.FC<Props> = ({ name, avatar, lastMessage, time, unread, onPress }) => {
  const bg = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: bg }]} onPress={onPress}>
      <Image
        source={avatar ? { uri: avatar } : require('@/assets/images/Andrew.png')}
        style={styles.avatar}
      />
      <View style={styles.details}>
        <Text style={[styles.name, { color: text }]} numberOfLines={1}>{name}</Text>
        <Text style={styles.message} numberOfLines={1}>{lastMessage}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>{time}</Text>
        {unread && <View style={styles.badge} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: Typography.fontSize.h5,
    fontWeight: '600',
  },
  message: {
    fontSize: Typography.fontSize.h6,
    color: '#777',
  },
  meta: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C851',
  },
});

export default ChatPreviewCard;
