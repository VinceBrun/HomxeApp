import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import Spacing from '@/constants/SPACING';
import Radius from '@/constants/RADIUS';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MessageBubble from "@/features/shared/chat/components/MessageBubble";
import ReplyPreviewBar from "@/features/shared/chat/components/ReplyPreviewBar";
import { Message } from '@/types';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useChatStore } from '@/store/chat.store';
import { useMarkMessagesSeen } from '@/hooks/useMarkMessagesSeen';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { useTypingWatcher } from '@/hooks/useTypingWatcher';

export default function ChatThreadScreen() {
  const { participantId, displayName, id, avatarUrl } = useLocalSearchParams<{
    participantId?: string;
    displayName?: string;
    id?: string;
    avatarUrl?: string;
  }>();


  const chatId = id ?? '';
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const icon = useThemeColor({}, 'icon');
  const border = useThemeColor({}, 'outlineBorder');
  const router = useRouter();

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [inputText, setInputText] = useState('');

  const { messages } = useChatMessages(chatId);
  const { sendMessage } = useSendMessage();
  const { setSelectedChatId } = useChatStore();
  const { markSeen } = useMarkMessagesSeen();
  const { onTypingStart } = useTypingIndicator(chatId);
  const isTyping = useTypingWatcher(chatId, participantId as string);

  useRealtimeMessages(chatId);

  useEffect(() => {
    if (chatId) {
      setSelectedChatId(chatId);
      markSeen();
    }
  }, [chatId]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(chatId, inputText.trim(), replyingTo);
    setInputText('');
    setReplyingTo(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back}>
          <Ionicons name="arrow-back" size={24} color={icon} />
        </TouchableOpacity>
        <View style={styles.headerUser}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : { uri: `https://ui-avatars.com/api/?name=${displayName}&background=cccccc&color=000000&size=128` }
            }
            style={styles.avatar}
          />
          <Text style={[styles.headerText, { color: text }]}>
            {typeof displayName === 'string' ? displayName : 'Chat'}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="call-outline" size={24} color={icon} style={styles.icon} />
          <MaterialCommunityIcons name="video-plus-outline" size={24} color={icon} style={styles.icon} />
          <MaterialCommunityIcons name="dots-vertical" size={24} color={icon} style={styles.icon} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.threadWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isMine={item.sender_id !== participantId}
              onReplyPress={() => setReplyingTo(item)}
            />
          )}
          contentContainerStyle={styles.thread}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <Text style={[styles.typingIndicator, { color: text }]}>
                {typeof displayName === 'string' ? displayName : 'User'} is typing...
              </Text>
            ) : null
          }
        />

        {replyingTo && (
          <ReplyPreviewBar
            message={replyingTo}
            onCancel={() => setReplyingTo(null)}
          />
        )}

        <View style={styles.inputBar}>
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: border,
                backgroundColor: useThemeColor({}, 'card'),
              },
            ]}
          >
            <TouchableOpacity>
              <Ionicons name="happy-outline" size={20} color={icon} />
            </TouchableOpacity>

            <TextInput
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                onTypingStart();
              }}
              placeholder="Type a message"
              placeholderTextColor="#A9A9A9"
              style={[styles.input, { color: text }]}
              onSubmitEditing={handleSend}
            />

            <Ionicons name="attach-outline" size={20} color={icon} style={styles.icon} />
            <Ionicons name="camera-outline" size={20} color={icon} style={styles.icon} />
          </View>

          <TouchableOpacity
            style={styles.voiceIcon}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name={inputText.trim() ? 'send' : 'mic-outline'}
              size={30}
              color={icon}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: Spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
    marginRight: Spacing.sm,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 20,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: Spacing.sm,
  },
  threadWrapper: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  thread: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl * 2.5,
  },
  typingIndicator: {
    fontSize: 13,
    fontStyle: 'italic',
    marginVertical: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.lg,
    paddingTop: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginHorizontal: Spacing.sm,
  },
  voiceIcon: {
    marginLeft: Spacing.xxxs,
    marginBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.xs,
  },
});
