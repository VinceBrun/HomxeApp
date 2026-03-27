import Avatar from "@/components/ui/Avatar";
import Radius from "@/constants/RADIUS";
import useProfile from "@/hooks/useProfile";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

const IMAGE_SIZE = 80;

type Props = { onImageSelect: (s: string) => void };

const UserProfileFormImageHandler: React.FC<Props> = ({ onImageSelect }) => {
  const muted = useThemeColor({}, "icon");
  const primaryLight = useThemeColor({}, "primary");

  const [imageUri, setImageUri] = useState<null | string>(null);
  const { profile } = useProfile();

  // Initialize with profile avatar
  useEffect(() => {
    if (profile?.avatar) {
      setImageUri(profile.avatar);
    }
  }, [profile?.avatar]);

  return (
    <TouchableWithoutFeedback onPress={() => onImageSelect(imageUri || "")}>
      <View style={[styles.imageContainer, { backgroundColor: muted }]}>
        <Avatar imageUri={imageUri ?? profile?.avatar} size={IMAGE_SIZE} />
        <View
          style={[
            styles.imageContainerLabel,
            { backgroundColor: primaryLight },
          ]}
        >
          <MaterialCommunityIcons name="account-edit-outline" size={12} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UserProfileFormImageHandler;

const styles = StyleSheet.create({
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: Radius.full,
    alignSelf: "center",
    position: "relative",
    marginHorizontal: "auto",
  },
  imageContainerLabel: {
    width: 20,
    height: 20,
    position: "absolute",
    right: 0,
    bottom: 0,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
