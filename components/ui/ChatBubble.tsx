import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import Spacing from '@/constants/SPACING';
import Radius from '@/constants/RADIUS';

type ChatBubbleProps = {
  message: string;
  time: string;
  isSender: boolean;
  readStatus?: 'single' | 'double';
  date?: string;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, time, isSender, readStatus, date }) => {
  const bubbleColor = useThemeColor({}, isSender ? 'primary' : 'card');
  const textColor = useThemeColor({}, isSender ? 'background' : 'text');
  const secondary = useThemeColor({}, 'secondary');

  const seenIcon = readStatus === 'double' ? 'check-all' : 'check';

  return (
    <View style={styles.wrapper}>
      {date && (
        <Text style={[styles.date, { color: secondary }]}>{date}</Text>
      )}
      <View
        style={[
          styles.row,
          isSender ? styles.rowEnd : styles.rowStart,
        ]}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: bubbleColor,
              borderTopLeftRadius: isSender ? Radius.md : 0,
              borderTopRightRadius: isSender ? 0 : Radius.md,
            },
            isSender ? styles.senderShadow : styles.receiverShadow,
          ]}
        >
          <Text style={[styles.messageText, { color: textColor }]}>
            {message}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.timeText, { color: secondary }]}>{time}</Text>
            {isSender && readStatus && (
              <MaterialCommunityIcons
                name={seenIcon}
                size={16}
                color={readStatus === 'double' ? '#00C851' : secondary}
                style={{ marginLeft: 6 }}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  date: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowStart: {
    justifyContent: 'flex-start',
  },
  rowEnd: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    padding: Spacing.sm,
    borderRadius: Radius.lg,
  },
  senderShadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  receiverShadow: {
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'PoppinsRegular',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  timeText: {
    fontSize: 11,
  },
});

export default ChatBubble;
