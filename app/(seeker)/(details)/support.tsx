/**
 * Support Screen
 * Help form for users to submit issues and contact support
 */

import Button from "@/components/ui/Button";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Support() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    console.log("Submitted complaint:", { title, description });
    // TODO: Submit to support system
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="bg-slate-200 w-full p-1">
          <Stack.Screen options={{ headerShown: false }} />

          {/* Header */}
          <View className="flex flex-row p-5 pt-10">
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={require("@/assets/icons/chevron left.png")} />
            </TouchableOpacity>
            <Text className="text-3xl font-poppinsSemibold text-center ml-20">
              Help & Support
            </Text>
          </View>

          <Text className="text-xl text-center justify-center px-8 mb-20 font-poppins">
            Experiencing issues? We are here to help! Contact us and we&#39;ll
            work to resolve them quickly.
          </Text>

          {/* Title Input */}
          <View className="p-5">
            <Text className="text-xl font-bold pb-3 font-poppinsSemibold">
              Title
            </Text>
            <View className="p-5 px-20 shadow-md border rounded-md">
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Type your concern here"
              />
            </View>
          </View>

          {/* Description Input */}
          <View className="p-5">
            <Text className="text-xl font-poppinsSemibold pb-3">
              Explain the problem
            </Text>
            <View className="p-20 shadow-md border rounded-md">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Share your problem here"
                multiline
              />
            </View>
          </View>

          <Button
            title="Submit"
            handlePress={handleSubmit}
            containerStyles="mt-20"
          />

          {/* Contact Info */}
          <View className="pb-5 px-5 flex flex-row">
            <Text className="font-poppinsSemibold text-xl">
              You can contact us on this number{" "}
            </Text>
            <Text className="font-poppinsLight text-xl">123456789</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
