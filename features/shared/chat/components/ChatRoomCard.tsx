import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Avatar from '@/components/ui/Avatar';
import Spacer from '@/components/ui/Spacer';
import { Text } from '@/components/ui/Text';
import UnreadMessageCount from './UnreadMessageCount';
import Radius from '@/constants/RADIUS';
import Spacing from '@/constants/SPACING';
import { ChatRoom } from '@/types';
import { useChatStore } from '@/store/chat.store';

type ChatRoomCardProps = {
  chatRoom: ChatRoom;
  onCardPress: (room: ChatRoom) => void;
};

export default function ChatRoomCard({ chatRoom, onCardPress }: ChatRoomCardProps) {
  const textColor = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'icon');
  const background = useThemeColor({}, 'card');

  const { participant, last_message } = chatRoom;
  const unreadCountFromStore = useChatStore((state) => state.unreadCounts[chatRoom.id]);
  const unreadCount = unreadCountFromStore ?? chatRoom.unread_message_count;

  return (
    <TouchableOpacity
      onPress={() => onCardPress(chatRoom)}
      style={[styles.cardContainer, { backgroundColor: background }]}
    >
      <Avatar imageUri={participant.display_image} size={Spacing.lg} />

      <Spacer horizontal size={'md'} />

      <View style={styles.flex}>
        <View style={styles.topRow}>
          <Text variant="h5" style={{ color: textColor }} numberOfLines={1}>
            {participant.display_name}
          </Text>
          <Text variant="h6" style={{ color: muted }}>
            {last_message?.sent_at
              ? new Date(last_message.sent_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </Text>
        </View>

        <Spacer size={'xxs'} />

        <View style={styles.bottomRow}>
          <Text variant="h6" style={{ color: muted }} numberOfLines={1}>
            {last_message?.content ?? ''}
          </Text>

          {unreadCount > 0 && (
            <UnreadMessageCount count={unreadCount} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  flex: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
