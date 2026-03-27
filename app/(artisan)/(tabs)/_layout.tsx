import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type TabIconProps = {
  name: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconOutlineName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
};

const TabIcon: React.FC<TabIconProps> = ({
  iconName,
  iconOutlineName,
  name,
  focused,
}) => {
  const activeColor = useThemeColor({}, "tabActive");
  const inactiveColor = useThemeColor({}, "tabInactive");
  const color = focused ? activeColor : inactiveColor;

  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={focused ? iconName : iconOutlineName}
        size={26}
        color={color}
        style={styles.icon}
      />
      <Text style={[styles.tabLabel, { color }]}>{name}</Text>
    </View>
  );
};

export default function ArtisanTabLayout() {
  const background = useThemeColor({}, "primary");
  const active = useThemeColor({}, "tabActive");
  const inactive = useThemeColor({}, "tabInactive");

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: background,
          },
        ],
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="home"
              iconOutlineName="home-outline"
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="hammer"
              iconOutlineName="hammer-outline"
              name="Jobs"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="chatbubble"
              iconOutlineName="chatbubble-outline"
              name="Chat"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="wallet"
              iconOutlineName="wallet-outline"
              name="Earnings"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="person"
              iconOutlineName="person-outline"
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />

      {/* Hide old tabs that don't match your spec */}
      <Tabs.Screen
        name="my-jobs"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 85,
    elevation: 4,
    borderTopWidth: 0,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    backgroundColor: "#FFF",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: -2 },
      },
    }),
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    width: 60,
    marginHorizontal: 0,
  },
  icon: {
    alignSelf: "center",
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: "PoppinsMedium",
    marginTop: 2,
    textAlign: "center",
    alignSelf: "center",
  },
});
