import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/user.store';
import { ChatRoom } from '@/types';
import { useChatStore } from '@/store/chat.store';

export const useChatRooms = () => {
  const { profile } = useUserStore();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const { setChats } = useChatStore();

  useEffect(() => {
    const fetchChats = async () => {
      if (!profile?.id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('chats')
        .select(`
          id,
          tenant_id,
          landlord_id,
          messages (
            id,
            content,
            sent_at,
            sender_id
          ),
          tenant:profiles (id, full_name, avatar_url, role),
          landlord:profiles (id, full_name, avatar_url, role)
        `)
        .or(`tenant_id.eq.${profile.id},landlord_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Chat fetch error:', error.message);
        setLoading(false);
        return;
      }

      const parsedChats = data.map((chat: any) => {
        const isTenant = profile.id === chat.tenant_id;
        const otherParty = isTenant ? chat.landlord : chat.tenant;
        const lastMessage = chat.messages?.[chat.messages.length - 1];

        return {
          id: chat.id,
          status: 'ACTIVE',
          participant: {
            id: otherParty.id,
            display_name: otherParty.full_name,
            display_image: otherParty.avatar_url,
            role: otherParty.role,
            is_online: true, 
          },
          last_message: lastMessage
            ? {
                content: lastMessage.content,
                sent_at: lastMessage.sent_at,
                sender_id: lastMessage.sender_id,
              }
            : null,
          unread_message_count: 0, 
        } as ChatRoom;
      });

      setChatRooms(parsedChats);
      setChats(parsedChats);
      setLoading(false);
    };

    fetchChats();
  }, [profile, setChats]);

  return { chatRooms, loading };
};
