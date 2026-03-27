import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

import Button from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import Header from "@/components/ui/Header";
import KeyboardAwareScrollView from "@/components/ui/KeyboardAwareScrollView";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import Spacer from "@/components/ui/Spacer";
import { Text } from "@/components/ui/Text";
import TextInput from "@/components/ui/TextInput";
import { useThemeColor } from "@/hooks/useThemeColor";

const HelpSupportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  problem: z
    .string()
    .min(10, "Explain the problem with at least 10 characters"),
});

type HelpSupportValues = z.infer<typeof HelpSupportSchema>;

export default function HelpSupport() {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const form = useForm<HelpSupportValues>({
    resolver: zodResolver(HelpSupportSchema),
    defaultValues: {
      title: "",
      problem: "",
    },
  });

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  const onSubmit = async (values: HelpSupportValues) => {
    console.log("Help & Support form submitted:", values);
    // TODO: Send support request to backend or handle submission
  };

  return (
    <CollapsibleHeaderView
      header={
        <View>
          <Header title="Help & Support" />
        </View>
      }
      content={
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: background }]}
          onLayout={onLayoutRootView}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.container}>
              <Text style={[styles.introText, { color: muted }]}>
                Experiencing issues? We are here to help!{"\n"}
                Contact us and we’ll work to resolve them quickly.
              </Text>

              <Spacer size="lg" />

              <Form {...form}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <TextInput
                          {...field}
                          placeholder="Enter issue title"
                          autoCapitalize="sentences"
                          autoComplete="off"
                          autoCorrect={false}
                          placeholderTextColor={muted}
                          style={{ color: text }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Spacer size="md" />

                <FormField
                  control={form.control}
                  name="problem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explain the problem</FormLabel>
                      <FormControl>
                        <TextInput
                          {...field}
                          placeholder="Describe the issue in detail"
                          numberOfLines={10}
                          textAlignVertical="top"
                          autoCapitalize="sentences"
                          autoComplete="off"
                          placeholderTextColor={muted}
                          style={{ color: text }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>

              <Spacer size="lg" />

              <Button
                title="Submit"
                handlePress={form.handleSubmit(onSubmit)}
                containerStyles="w-full"
              />

              <Spacer size="xl" />

              <View style={styles.phoneContainer}>
                <Ionicons name="call" size={48} color={primary} />
                <Spacer size="sm" />
                <Text style={[styles.helpHeading, { color: text }]}>
                  Need more help?
                </Text>
                <Text style={[styles.helpText, { color: muted }]}>
                  Call us via this number and we’ll respond{"\n"}
                  +234(0)8100001234
                </Text>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      }
    />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 24,
    flex: 1,
  },
  introText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  phoneContainer: {
    alignItems: "center",
  },
  helpHeading: {
    fontSize: 18,
    fontWeight: "600",
  },
  helpText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
  },
});
