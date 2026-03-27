import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/user.store";
import { Message } from "@/types";

export const useSendMessage = () => {
  const { profile } = useUserStore();

  const sendMessage = async (
    chatId: string,
    content: string,
    _replyTo?: Message | null,
  ) => {
    if (!chatId || !profile?.id || !content.trim()) return;

    const now = new Date().toISOString();
    const { error } = await supabase.from("messages").insert({
      chat_id: chatId,
      sender_id: profile.id,
      content: content.trim(),
      sent_at: now,
      seen: false,
      // reply_to_message_id: replyTo?.id ?? null,
      // reply_to_content: replyTo?.content ?? null,
    });

    if (error) {
      console.warn("Message send failed:", error.message);
    }
  };

  return { sendMessage };
};
