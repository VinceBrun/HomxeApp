import { create } from 'zustand';
import { ChatRoom, Message, ZustandSetState } from '@/types';
import { createSetState } from '@/utils';

type ChatStoreState = {
  selectedChatId: string | null;
  chats: ChatRoom[];
  messages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
  setSelectedChatId: ZustandSetState<string | null>;
  setChats: ZustandSetState<ChatRoom[]>;
  setMessages: (chatId: string, messages: Message[]) => void;
  setUnreadCount: (chatId: string, count: number) => void;
};

export const useChatStore = create<ChatStoreState>((set) => ({
  selectedChatId: null,
  chats: [],
  messages: {},
  unreadCounts: {},
  setSelectedChatId: createSetState('selectedChatId', set),
  setChats: createSetState('chats', set),
  setMessages: (chatId, newMessages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: newMessages,
      },
    })),
  setUnreadCount: (chatId, count) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatId]: count,
      },
    })),
}));
