import Spacer from "@/components/ui/Spacer";
import { Text } from "@/components/ui/Text";
import Spacing from "@/constants/SPACING";
import withErrorAndLoading from "@/hoc/withErrorAndLoading";
import { Profile } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Avatar from "../Avatar";
import UserProfileForm, {
  UserProfileReadonlyFormField,
} from "./user-profile/UserProfileForm";

type Props = { userProfile?: Profile };
const ReadonlyUserProfile: React.FC<Props> = ({ userProfile }) => {
  if (!userProfile)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="h2">Profile not found</Text>
      </View>
    );

  const formFields: UserProfileReadonlyFormField[] = [
    { label: "Full Name", value: userProfile.fullName ?? null },
    { label: "Phone Number", value: userProfile.phoneNumber ?? null },
    { label: "Email", value: userProfile.email || "" },
  ];

  return (
    <View style={styles.container}>
      <Avatar
        size={80}
        imageUri={userProfile.avatar}
        additionalStyles={{ alignSelf: "center" }}
      />
      <Spacer size="xl" />
      <UserProfileForm readonly formFields={formFields} />
    </View>
  );
};

export default withErrorAndLoading(ReadonlyUserProfile);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxs,
  },
});
