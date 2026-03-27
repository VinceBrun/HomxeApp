/**
 * Contact Landlord Options
 * Modal with landlord contact methods (call, message, email)
 */

import Button from "@/components/ui/Button";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactLandlord() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-200">
      <ScrollView>
        <View>
          <Stack.Screen options={{ headerShown: false }} />

          {/* Landlord Profile */}
          <View className="items-center p-4">
            <Image
              source={require("@/assets/images/Garry.png")}
              className="w-[250px] h-[250px] items-center"
            />
            <Text className="text-2xl font-poppinsSemibold m-5">
              Garry Allen
            </Text>
            <Button
              handlePress={() => setModalVisible(true)}
              title="Contact Landlord"
            />
          </View>

          {/* Contact Options Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <View className="flex flex-row justify-between my-10 mx-3 align-middle">
                  <View>
                    <Text className="text-2xl font-poppinsBold">
                      Contact Options
                    </Text>
                    <Text className="font-poppins">
                      Carrier rates may apply
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Image
                      source={require("@/assets/icons/close-circle.png")}
                    />
                  </TouchableOpacity>
                </View>

                <View className="mx-3">
                  <TouchableOpacity
                    onPress={() => router.push("/")}
                    className="flex flex-row gap-8 mb-5"
                  >
                    <Image
                      source={require("@/assets/icons/call-calling.png")}
                    />
                    <Text className="font-poppinsMedium">
                      Call Landlord in-app
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => console.log("Call Landlord by phone")}
                    className="flex flex-row gap-8 mb-5"
                  >
                    <Image source={require("@/assets/icons/callz.png")} />
                    <Text className="font-poppinsMedium">
                      Call Landlord by phone
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => console.log("Message Landlord in-app")}
                    className="flex flex-row gap-8 mb-5"
                  >
                    <Image source={require("@/assets/icons/messages.png")} />
                    <Text className="font-poppinsMedium">
                      Message Landlord in-app
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => console.log("Send an Email")}
                    className="flex flex-row gap-8 mb-5"
                  >
                    <Image source={require("@/assets/icons/sms.png")} />
                    <Text className="font-poppinsMedium">Send an Email</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => console.log("Support")}
                    className="flex flex-row gap-8 mb-16"
                  >
                    <Image
                      source={require("@/assets/icons/message-question.png")}
                    />
                    <Text className="font-poppinsMedium">Support</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
