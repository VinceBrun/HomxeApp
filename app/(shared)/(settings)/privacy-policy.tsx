import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicy = () => {
  const background = useThemeColor({}, "background");
  const muted = useThemeColor({}, "icon");
  const text = useThemeColor({}, "text");

  const handleAgree = () => {
    console.log("User agreed to the Privacy Policy");
    // You can navigate or set a flag here
  };

  const clauses = [
    {
      title: "Clause 1",
      content:
        "We collect personal information including names, email addresses, and phone numbers to facilitate communication between landlords and tenants. All data is stored securely and not shared with unauthorized third parties.",
    },
    {
      title: "Clause 2",
      content:
        "Location data may be collected with your permission to suggest nearby properties and facilities. This data is used strictly for enhancing your app experience and will not be stored beyond the session duration.",
    },
    {
      title: "Clause 3",
      content:
        "Uploaded images and media (e.g., property photos or issue reports) are stored in secure cloud storage and are accessible only by relevant parties such as landlords or our support team.",
    },
    {
      title: "Clause 4",
      content:
        "We implement security protocols to prevent unauthorized access to your data, including encryption and role-based access control. Users are advised to use strong passwords to enhance their security.",
    },
    {
      title: "Clause 5",
      content:
        "By continuing to use this app, you consent to our privacy practices. You may withdraw consent at any time by deleting your account, after which your data will be erased within 30 days.",
    },
  ];

  return (
    <CollapsibleHeaderView
      header={
        <SafeAreaView>
          <Header variant="default" title="Privacy Policy" />
        </SafeAreaView>
      }
      content={
        <SafeAreaView
          style={[styles.container, { backgroundColor: background }]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            className="px-4"
          >
            <Text style={[styles.dateText, { color: muted }]}>
              Last Modified June, 20th 2025
            </Text>

            {clauses.map((clause, index) => (
              <View key={index} className="mb-4">
                <Header variant="sub" title={clause.title} />
                <Text style={[styles.clauseText, { color: text }]}>
                  {clause.content}
                </Text>
              </View>
            ))}

            <Button title="Agree and Continue" handlePress={handleAgree} />
          </ScrollView>
        </SafeAreaView>
      }
    />
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  clauseText: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
});
