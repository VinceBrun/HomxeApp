import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/user.store';
import { useChatStore } from '@/store/chat.store';

export const useUnreadCounts = () => {
  const { profile } = useUserStore();
  const { chats, setUnreadCount } = useChatStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!profile?.id || chats.length === 0) return;
      setLoading(true);

      for (const chat of chats) {
        const { data } = await supabase
          .from('messages')
          .select('id')
          .eq('chat_id', chat.id)
          .eq('seen', false)
          .neq('sender_id', profile.id); 

        setUnreadCount(chat.id, data?.length ?? 0);
      }

      setLoading(false);
    };

    fetchUnread();
  }, [profile, chats, setUnreadCount]);

  return { loading };
};
