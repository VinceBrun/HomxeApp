import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useTypingWatcher = (chatId: string, otherUserId: string) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!chatId || !otherUserId) return;

    const channel = supabase
      .channel(`typing:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'typing_status',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.new.user_id === otherUserId) {
            setIsTyping(payload.new.is_typing);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, otherUserId]);

  return isTyping;
};
