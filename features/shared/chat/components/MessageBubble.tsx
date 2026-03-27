import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { Message } from '@/types';
import Radius from '@/constants/RADIUS';
import Spacing from '@/constants/SPACING';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = {
  message: Message;
  isMine?: boolean;
  onReplyPress?: () => void;
};

export default function MessageBubble({ message, isMine = false, onReplyPress }: Props) {
  const bubbleBg = useThemeColor({}, isMine ? 'primary' : 'card');
  const textColor = useThemeColor({}, 'text');
  const replyColor = useThemeColor({}, 'icon');

  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 15 && Math.abs(gesture.dy) < 10,
      onPanResponderMove: (_, gesture) => {
        pan.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 30 && onReplyPress) {
          onReplyPress();
        }
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View style={{ transform: [{ translateX: pan }] }} {...panResponder.panHandlers}>
      <TouchableOpacity onLongPress={onReplyPress} activeOpacity={0.7}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: bubbleBg,
              alignSelf: isMine ? 'flex-end' : 'flex-start',
              borderTopLeftRadius: isMine ? Radius.md : 0,
              borderTopRightRadius: isMine ? 0 : Radius.md,
            },
          ]}
        >
          {message.reply_to_content && (
            <View style={[styles.replyPreview, { borderLeftColor: replyColor }]}>
              <Text style={[styles.replyText, { color: replyColor }]} numberOfLines={1}>
                {message.reply_to_content}
              </Text>
            </View>
          )}

          <Text style={[styles.text, { color: textColor }]}>{message.content}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    maxWidth: '80%',
    marginBottom: Spacing.sm,
  },
  text: {
    fontSize: 14,
  },
  replyPreview: {
    borderLeftWidth: 2,
    paddingLeft: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  replyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
