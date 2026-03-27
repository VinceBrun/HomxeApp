/**
 * Supabase Client Configuration
 * Handles secure session persistence with encrypted storage.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as aesjs from "aes-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!rawUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing.");
}

// Android emulator helper: Redirect localhost to host machine IP
const supabaseUrl =
  Platform.OS === "android" &&
  /^(http:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(rawUrl)
    ? rawUrl.replace(
        /^(http:\/\/)?(localhost|127\.0\.0\.1)/i,
        "http://10.0.2.2",
      )
    : rawUrl;

/**
 * Encrypted storage adapter for Supabase Auth.
 * Combines AsyncStorage (data) with SecureStore (keys).
 */
class EncryptedSecureStore {
  private async _encrypt(key: string, value: string): Promise<string> {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(32));
    const cipher = new aesjs.ModeOfOperation.ctr(
      encryptionKey,
      new aesjs.Counter(1),
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey),
    );
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async _decrypt(
    key: string,
    encrypted: string,
  ): Promise<string | null> {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) return null;
    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1),
    );
    return aesjs.utils.utf8.fromBytes(
      cipher.decrypt(aesjs.utils.hex.toBytes(encrypted)),
    );
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    return encrypted ? this._decrypt(key, encrypted) : null;
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === "web" ? undefined : new EncryptedSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
