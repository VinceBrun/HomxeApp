import Button from "@/components/ui/Button";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Agreement = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="bg-slate-200">
          <Stack.Screen options={{ headerShown: false }} />

          <View className="flex flex-row items-center p-4 mt-8">
            <Pressable onPress={() => router.back()}>
              <Image
                source={require("@/assets/icons/back Arrow.png")}
                className="w-10 h-10"
              />
            </Pressable>
            <Text className="text-3xl ml-auto mr-auto font-bold">
              Rental Agreement
            </Text>
          </View>

          <View className="m-8">
            <Text className="text-xl">
              This is a house rental agreement entered between the landlord
              _______________
              {/* <HorizontalRule width="60%" />  60% width for a smaller line */}
              [name of house owner] and the tenant _______________
              {/* <HorizontalRule width="60%" /> */}
              [name of tenant] for the given property at _______________
              {/* <HorizontalRule />  */}
              [address of the house to be given] for rent. {"\n"}
              This agreement will be effective from{"\n"} _______
              {/* <HorizontalRule width="80%" />  Smaller width for dates */}
              [dd/mm/yy] till {"\n"} _______
              {/* <HorizontalRule width="80%" /> */}
              [dd/mm/yy].
            </Text>

            <Text className="text-xl font-semibold my-3">
              Terms and Condition
            </Text>
            <Text className="text-xl">
              1. The tenant will be liable to pay the monthly amount of
              _______________
              {/* <HorizontalRule width="80%"/>  */}
              to the landlord. {"\n"}
              2. Any other bill will be discussed between the landlord and
              tenant.
            </Text>

            <Text className="text-xl font-semibold my-3">
              Signatures of the Parties
            </Text>
            <View className="flex flex-row justify-between">
              <View>
                <Text></Text>
                <Text className="text-xl">Landlord Signature</Text>
              </View>
              <View>
                <Text></Text>
                <Text className="text-xl">Tenant Signature</Text>
              </View>
            </View>
          </View>

          <View className="m-5">
            <Button
              title="Proceed"
              onPress={() => console.log("Proceeded with the agreement")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Agreement;
