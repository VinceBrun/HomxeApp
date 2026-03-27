import { FontAwesome } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import KeyboardAwareScrollView from "@/components/ui/KeyboardAwareScrollView";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import MiniBookingCard from "@/components/ui/RatingReviewCard";
import Spacer from "@/components/ui/Spacer";
import TextInput from "@/components/ui/TextInput";
import { useThemeColor } from "@/hooks/useThemeColor";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";

const ReviewSchema = z.object({
  review: z.string().min(5, "Review must be at least 5 characters long"),
});

type ReviewFormValues = z.infer<typeof ReviewSchema>;

export default function Ratings_Reviews() {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const placeholder = useThemeColor({}, "icon");

  const [rating, setRating] = useState<number>(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      review: "",
    },
  });

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  const onSubmit = async (values: ReviewFormValues) => {
    console.log("Review Submitted:", {
      rating,
      review: values.review,
    });
    // TODO: send to backend
  };

  return (
    <CollapsibleHeaderView
      header={
        <SafeAreaView>
          <Header title="Ratings and Reviews" />
        </SafeAreaView>
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
              <MiniBookingCard
                title="Luxury Bungalow in Lekki"
                reviews={79}
                owner={{
                  avatar: "https://via.placeholder.com/40",
                  name: "John Doe",
                  role: "Property Owner",
                }}
              />

              <Spacer size="xxl" />

              <View className="flex-row justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <FontAwesome
                      name={i <= rating ? "star" : "star-o"}
                      size={30}
                      color="#fbbf24"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Spacer size="xl" />

              <Form {...form}>
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TextInput
                          {...field}
                          placeholder="Write a review"
                          placeholderTextColor={placeholder}
                          numberOfLines={6}
                          textAlign="center"
                          textAlignVertical="top"
                          autoCapitalize="sentences"
                          autoComplete="off"
                          autoCorrect={false}
                          style={{ color: text }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>

              <Spacer size="xxl" />

              <Button
                title="Submit Review"
                handlePress={form.handleSubmit(onSubmit)}
                containerStyles="w-full"
              />

              <Spacer size="xl" />
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
    padding: 16,
    flex: 1,
  },
});
