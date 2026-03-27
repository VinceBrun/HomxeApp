import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import Radius from '@/constants/RADIUS';
import Spacing from '@/constants/SPACING';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  replyingTo?: any;
};

export default function ChatInputBar({ value, onChange, onSend }: Props) {
  const background = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');
  const border = useThemeColor({}, 'outlineBorder');
  const icon = useThemeColor({}, 'icon');

  return (
    <View style={[styles.wrapper, { backgroundColor: background }]}>
      <View style={[styles.inputContainer, { borderColor: border }]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Type a message"
          placeholderTextColor={icon}
          style={[styles.input, { color: text }]}
        />
        <TouchableOpacity onPress={onSend} style={styles.sendButton}>
          <Ionicons name="send" size={20} color={icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
    paddingTop: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Platform.OS === 'android' ? 4 : 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: Spacing.sm,
  },
});
