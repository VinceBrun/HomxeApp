/**
 * Complaints & Issues Screen
 * Submit and track property complaints with image upload
 */

import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

import Button from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import Header from "@/components/ui/Header";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import LargeTextArea from "@/components/ui/TextArea";
import { useThemeColor } from "@/hooks/useThemeColor";

const issueOptions = [
  "Maintenance",
  "Payment",
  "Facilities",
  "Environment",
  "Neighbors",
  "Others",
];

const ComplaintSchema = z.object({
  description: z.string().min(10, "Please describe the issue in detail"),
});

type ComplaintFormValues = z.infer<typeof ComplaintSchema>;

export default function ComplaintsIssues() {
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "outlineBorder");
  const muted = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");
  const card = useThemeColor({}, "card");

  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(ComplaintSchema),
    defaultValues: {
      description: "",
    },
  });

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Media library access is needed to upload your image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async (values: ComplaintFormValues) => {
    if (!selectedIssue) {
      Alert.alert("Missing Category", "Please select an issue category.");
      return;
    }

    const payload = {
      category: selectedIssue,
      description: values.description,
      image,
    };

    console.log("Complaint submitted:", payload);
    // TODO: Integrate with backend
  };

  return (
    <CollapsibleHeaderView
      header={
        <SafeAreaView>
          <Header title="Complaints and Issues" />
        </SafeAreaView>
      }
      content={
        <View style={styles.container}>
          {/* Issue Selection */}
          <Text style={[styles.introText, { color: muted }]}>
            What issues are you experiencing?
          </Text>

          <FlatList
            data={issueOptions}
            numColumns={3}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            contentContainerStyle={styles.cardList}
            columnWrapperStyle={styles.cardRow}
            renderItem={({ item }) => {
              const isSelected = selectedIssue === item;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedIssue(item)}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isSelected ? primary : card,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isSelected ? "#fff" : text,
                      fontWeight: "600",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Description */}
          <Form {...form}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LargeTextArea
                      {...field}
                      placeholder="Describe your issue"
                      autoCapitalize="sentences"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>

          {/* Image Upload */}
          <TouchableOpacity
            onPress={handleImagePick}
            style={[styles.uploadBox, { borderColor: border }]}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.uploadedImage} />
            ) : (
              <Text style={{ color: muted }}>Upload Image (if any)</Text>
            )}
          </TouchableOpacity>

          <Button
            title="Submit"
            handlePress={form.handleSubmit(handleSubmit)}
            containerStyles="mt-6"
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  introText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  cardList: {
    marginBottom: 24,
  },
  cardRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadBox: {
    marginTop: 24,
    marginBottom: 24,
    height: 160,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
});
