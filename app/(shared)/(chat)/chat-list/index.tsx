import ChatRoomCard from "@/features/shared/chat/components/ChatRoomCard";
import Header from "@/components/ui/Header";
import SearchBar from "@/components/ui/SearchBar";
import { Text } from "@/components/ui/Text";
import Spacing from "@/constants/SPACING";
import { useChatRooms } from "@/hooks/useChatRooms";
import useRealtimeUnreadCounts from "@/hooks/useRealtimeUnreadCounts";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUnreadCounts } from "@/hooks/useUnreadCounts";
import { ChatRoom } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function ChatListScreen() {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const [searchTerm, setSearchTerm] = useState("");

  const { chatRooms } = useChatRooms();
  // Trigger unread counts calculation for each chat room in store
  useUnreadCounts();
  // Subscribe to realtime inserts to update unread counts for non-selected chats
  useRealtimeUnreadCounts();

  const filteredRooms = chatRooms.filter((room) =>
    room.participant.display_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handlePress = (room: ChatRoom) => {
    router.push({
      pathname: "/chat-room/[id]",
      params: {
        id: room.id,
        displayName: room.participant.display_name,
        avatarUrl: room.participant.display_image ?? "",
        participantId: room.participant.id,
        displayCountryImage: "0",
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.topSection}>
        <Header variant="default" title="Messages" showBackButton={false} />
        <View style={styles.searchBarWrapper}>
          <SearchBar
            placeholder="Search chats"
            value={searchTerm}
            onChangeText={setSearchTerm}
            useRouterSync={false}
          />
        </View>
      </View>

      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatRoomCard chatRoom={item} onCardPress={handlePress} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={64}
              color="#ccc"
            />
            <Text style={styles.emptyText}>No conversations yet</Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          filteredRooms.length === 0 && styles.listEmptySpace,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  topSection: {
    marginBottom: Spacing.sm,
  },
  searchBarWrapper: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.xl * 2,
    paddingTop: Spacing.sm,
  },
  listEmptySpace: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  emptyText: {
    marginTop: Spacing.sm,
    fontSize: 14,
    color: "#aaa",
  },
});
