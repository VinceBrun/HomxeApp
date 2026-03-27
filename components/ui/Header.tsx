/**
 * Unified Header Component
 * Multi-variant header supporting navigation, titles, and contextual actions.
 */

import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * UNIFIED HEADER COMPONENT
 * Consolidates: Header, subHeader, ChatHeader, ProfileHeader, RecentChatHeader, SupportHeader
 *
 * Variants:
 * - default: Standard back button + title
 * - sub: Section header with title + action button
 * - chat: Chat header with user + actions
 * - profile: Profile header with avatar (use separate ProfileHeader for this - too specialized)
 * - transparent: Transparent overlay header
 *
 * Usage:
 * <Header variant="default" title="Settings" />
 * <Header variant="sub" title="Featured" actionText="See All" onActionPress={fn} />
 * <Header variant="chat" userName="John Doe" onMessagePress={fn} onCallPress={fn} />
 */

export type HeaderVariant = "default" | "sub" | "chat" | "transparent";

export interface BaseHeaderProps {
  variant?: HeaderVariant;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export interface DefaultHeaderProps extends BaseHeaderProps {
  variant?: "default" | "transparent";
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: ReactNode;
}

export interface SubHeaderProps extends BaseHeaderProps {
  variant: "sub";
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export interface ChatHeaderProps extends BaseHeaderProps {
  variant: "chat";
  userName: string;
  onBackPress?: () => void;
  onMessagePress?: () => void;
  onCallPress?: () => void;
  showActions?: boolean;
}

export type HeaderProps = DefaultHeaderProps | SubHeaderProps | ChatHeaderProps;

const Header: React.FC<HeaderProps> = (props) => {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  //   const mutedColor = useThemeColor({}, "icon");
  //   const primary = useThemeColor({}, "primary");
  const outlineText = useThemeColor({}, "outlineText");
  const shadowColor = useThemeColor({}, "tertiary");

  const handleBack = () => {
    if ("onBackPress" in props && props.onBackPress) {
      props.onBackPress();
    } else {
      router.back();
    }
  };

  // DEFAULT VARIANT
  if (
    !props.variant ||
    props.variant === "default" ||
    props.variant === "transparent"
  ) {
    const {
      title,
      showBackButton = true,
      style,
      titleStyle,
      rightAction,
    } = props as DefaultHeaderProps;
    const isTransparent = props.variant === "transparent";

    return (
      <View
        style={[
          styles.defaultContainer,
          {
            backgroundColor: isTransparent ? "transparent" : backgroundColor,
            shadowColor: isTransparent ? "transparent" : shadowColor,
          },
          isTransparent && styles.transparent,
          style,
        ]}
      >
        {showBackButton ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Image
              source={require("@/assets/icons/arrow-left.png")}
              style={[styles.icon, { tintColor: textColor }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.sideSpace} />
        )}

        {title ? (
          <Text
            style={[styles.defaultTitle, { color: textColor }, titleStyle]}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </Text>
        ) : (
          <View style={styles.flexOne} />
        )}

        {rightAction ? (
          <View style={styles.rightAction}>{rightAction}</View>
        ) : (
          <View style={styles.sideSpace} />
        )}
      </View>
    );
  }

  // SUB VARIANT (Section header with action)
  if (props.variant === "sub") {
    const { title, actionText, onActionPress, style } = props as SubHeaderProps;

    return (
      <View style={[styles.subContainer, style]}>
        <Text style={[styles.subTitle, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        {actionText?.trim() && (
          <TouchableOpacity
            onPress={onActionPress}
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.subActionText, { color: outlineText }]}>
              {actionText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // CHAT VARIANT
  if (props.variant === "chat") {
    const {
      userName,
      onMessagePress,
      onCallPress,
      showActions = true,
      style,
    } = props as ChatHeaderProps;

    return (
      <SafeAreaView
        edges={["top"]}
        style={[styles.chatContainer, { backgroundColor }, style]}
      >
        <Pressable onPress={handleBack} style={styles.chatBackButton}>
          <Image
            source={require("@/assets/icons/arrow-left.png")}
            style={[styles.icon, { tintColor: textColor }]}
          />
        </Pressable>

        <Text
          style={[styles.chatUserName, { color: textColor }]}
          numberOfLines={1}
        >
          {userName}
        </Text>

        {showActions && (
          <View style={styles.chatActions}>
            {onMessagePress && (
              <Pressable onPress={onMessagePress} hitSlop={10}>
                <Ionicons
                  name="chatbubble-outline"
                  size={24}
                  color={textColor}
                />
              </Pressable>
            )}
            {onCallPress && (
              <Pressable
                onPress={onCallPress}
                hitSlop={10}
                style={{ marginLeft: 16 }}
              >
                <Ionicons name="call-outline" size={24} color={textColor} />
              </Pressable>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  defaultContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
    zIndex: 10,
  },
  transparent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  backButton: {
    padding: Spacing.sm,
  },
  icon: {
    width: 24,
    height: 24,
  },
  sideSpace: {
    width: 40,
  },
  rightAction: {
    minWidth: 40,
    alignItems: "flex-end",
  },
  flexOne: {
    flex: 1,
  },
  defaultTitle: {
    flex: 1,
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemibold",
    textAlign: "center",
  },

  // SUB VARIANT
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: Spacing.md,
    paddingHorizontal: 0, // Will be controlled by parent
  },
  subTitle: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
  },
  subActionText: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsMedium",
  },

  // CHAT VARIANT
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chatBackButton: {
    padding: Spacing.xs,
  },
  chatUserName: {
    flex: 1,
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
    textAlign: "center",
    marginHorizontal: Spacing.md,
  },
  chatActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Header;
