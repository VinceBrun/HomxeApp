import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types';
import { useChatStore } from '@/store/chat.store';

export const useChatMessages = (chatId: string) => {
  const { messages: storeMessages, setMessages: setStoreMessages } = useChatStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('sent_at', { ascending: true });

      if (data) setStoreMessages(chatId, data as Message[]);
      if (error) console.warn('❌ Message fetch error:', error.message);
      setLoading(false);
    };

    fetchMessages();
  }, [chatId, setStoreMessages]);

  return { messages: storeMessages[chatId] ?? [], loading };
};
