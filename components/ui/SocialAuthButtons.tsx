import { supabase } from "@/lib/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

function SocialAuthButtons() {
  const Facebook: ImageSourcePropType = require("@/assets/icons/facebook.png");
  const Google: ImageSourcePropType = require("@/assets/icons/google.png");
  const Apple: ImageSourcePropType = require("@/assets/icons/appleIcon.png");

  const handleAppleAuth = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        const {
          error,
          data: { user },
        } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });
        console.log(JSON.stringify({ error, user }, null, 2));
        if (!error) {
          console.log("Apple: SIGNED_IN");
        }
      } else {
        throw new Error("No identityToken.");
      }
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        console.log("User cancelled Apple Sign-in flow");
      } else {
        console.error(e);
      }
    }
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity>
        <Image style={styles.icon} source={Facebook} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image style={styles.icon} source={Google} />
      </TouchableOpacity>
      {Platform.OS === "ios" && (
        <TouchableOpacity onPress={handleAppleAuth}>
          <Image style={styles.icon} source={Apple} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 4,
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default SocialAuthButtons;
