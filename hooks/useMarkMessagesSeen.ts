import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/user.store';
import { useChatStore } from '@/store/chat.store';

export const useMarkMessagesSeen = () => {
  const { profile } = useUserStore();
  const { selectedChatId, setUnreadCount } = useChatStore();

  const markSeen = async () => {
    if (!selectedChatId || !profile?.id) return;

    const { error } = await supabase
      .from('messages')
      .update({ seen: true })
      .eq('chat_id', selectedChatId)
      .neq('sender_id', profile.id);

    if (!error) {
      setUnreadCount(selectedChatId, 0);
    }
  };

  return { markSeen };
};
