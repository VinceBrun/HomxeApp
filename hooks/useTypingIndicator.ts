import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/user.store';

export const useTypingIndicator = (chatId: string) => {
  const { profile } = useUserStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setTyping = useCallback(async (isTyping: boolean) => {
    if (!chatId || !profile?.id) return;

    await supabase
      .from('typing_status')
      .upsert(
        {
          chat_id: chatId,
          user_id: profile.id,
          is_typing: isTyping,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'chat_id,user_id',
        }
      );
  }, [chatId, profile?.id]);

  const onTypingStart = () => {
    setTyping(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 3000); 
  };

  useEffect(() => {
    return () => {
      setTyping(false); 
    };
  }, [setTyping]);

  return { onTypingStart };
};
