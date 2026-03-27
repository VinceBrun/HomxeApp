/**
 * Cart Details Screen
 * Shopping cart for property bookings
 */

import Button from "@/components/ui/Button";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartDetails() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Dreamsville House",
      price: 82755,
      image: require("@/assets/images/Overlay.png"),
    },
    {
      id: 2,
      name: "Dreamsville House",
      price: 82755,
      image: require("@/assets/images/Overlay.png"),
    },
    {
      id: 3,
      name: "Dreamsville House",
      price: 82755,
      image: require("@/assets/images/Overlay.png"),
    },
    {
      id: 4,
      name: "Dreamsville House",
      price: 82755,
      image: require("@/assets/images/Overlay.png"),
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  const handleRemoveFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    console.log(`Item with id: ${id} removed from cart!`);
  };

  const handleCheckout = () => {
    setModalVisible(true);
  };

  const handleProceed = () => {
    setModalVisible(false);
    console.log("Proceeding with checkout...");
    // TODO: Add checkout logic
  };

  const handleCancel = () => {
    setModalVisible(false);
    console.log("Checkout canceled");
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="bg-slate-200">
          <Stack.Screen options={{ headerShown: false }} />

          {/* Header */}
          <View className="flex flex-row items-center p-4 mt-4">
            <Pressable onPress={() => router.back()}>
              <Image
                source={require("@/assets/icons/back Arrow.png")}
                className="w-10 h-10"
              />
            </Pressable>
            <Text className="font-poppinsMedium text-3xl ml-auto mr-auto">
              Cart
            </Text>
            <Image source={require("@/assets/icons/Group 2.png")} />
          </View>

          {/* Cart Items */}
          <View className="my-6">
            {cartItems.map((item) => (
              <View
                key={item.id}
                className="h-[90px] flex flex-row m-3 justify-between align-middle w-[320px] shadow-md p-1 mb-5"
              >
                <View className="flex flex-row">
                  <Image
                    className="w-[100px] h-[77px]"
                    resizeMode="contain"
                    source={item.image}
                  />
                  <View className="p-5">
                    <Text className="text-lg text-slate-500 font-poppinsMedium">
                      {item.name}
                    </Text>
                    <Text className="text-lg font-poppins">
                      ${item.price.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={() => handleRemoveFromCart(item.id)}>
                  <Image
                    resizeMode="contain"
                    className="w-full h-5 m-5"
                    source={require("@/assets/icons/bin.png")}
                  />
                </Pressable>
              </View>
            ))}
          </View>

          {/* Total Price */}
          <View className="m-6 mb-14 flex flex-row justify-between">
            <Text className="text-lg font-poppins">Total</Text>
            <Text className="text-lg font-poppinsSemibold">
              ${totalPrice.toLocaleString()}
            </Text>
          </View>

          {/* Checkout Button */}
          <Button
            title="Checkout"
            handlePress={handleCheckout}
            fullWidth
            style={{ margin: 20 }}
          />

          {/* Confirmation Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>Do you want to proceed?</Text>

                <View style={styles.modalButtonsContainer}>
                  <Pressable
                    style={styles.modalButtonYes}
                    onPress={handleProceed}
                  >
                    <Text style={styles.modalButtonText}>Yes</Text>
                  </Pressable>

                  <Pressable
                    style={styles.modalButtonNo}
                    onPress={handleCancel}
                  >
                    <Text style={styles.modalButtonText}>No</Text>
                  </Pressable>
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButtonYes: {
    backgroundColor: "#02311F",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonNo: {
    backgroundColor: "#02311F",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
