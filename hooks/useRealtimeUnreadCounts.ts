import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/user.store';
import { useChatStore } from '@/store/chat.store';
import { Message } from '@/types';

export default function useRealtimeUnreadCounts() {
  const { profile } = useUserStore();
  const { selectedChatId, unreadCounts, setUnreadCount } = useChatStore();

  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel(`unread:${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=neq.${profile.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;

          // If we're currently viewing this chat, it will be marked seen by ChatThreadScreen
          if (selectedChatId === newMessage.chat_id) return;

          const current = unreadCounts[newMessage.chat_id] ?? 0;
          setUnreadCount(newMessage.chat_id, current + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, selectedChatId, unreadCounts, setUnreadCount]);
}
