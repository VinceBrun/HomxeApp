import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useChatStore } from '@/store/chat.store';
import { Message } from '@/types';

export const useRealtimeMessages = (chatId: string) => {
  const { messages, setMessages } = useChatStore();

  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          const current = messages[chatId] || [];
          setMessages(chatId, [...current, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, messages, setMessages]);
};
