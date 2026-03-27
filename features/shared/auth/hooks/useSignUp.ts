/**
 * Sign Up Hook
 * Manages form state, validation, and submission logic for user registration.
 */

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import * as z from "zod";
import useTransientSession from "@/hooks/useTransientSession";
import { TextInput as RNTextInput } from "react-native";

export const SignUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpFormType = z.infer<typeof SignUpSchema>;

export const useSignUp = () => {
  const router = useRouter();
  const { signUp, isLoading, error, setError } = useTransientSession();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [showExistsModal, setShowExistsModal] = useState(false);

  const emailFieldRef = useRef<RNTextInput>(null);
  const phoneFieldRef = useRef<RNTextInput>(null);
  const passwordFieldRef = useRef<RNTextInput>(null);

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpFormType) => {
    setError(null);
    form.clearErrors("root");

    if (!isChecked) {
      form.setError("root", {
        message: "You must agree to the Terms and Conditions",
      });
      return;
    }

    try {
      await signUp(
        {
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
        },
        () => {
          router.push({
            pathname: "/email-verification",
            params: {
              email: values.email,
              isNewUser: "true",
            },
          });
        },
      );
    } catch (err: any) {
      console.error("SignUp error:", err);
      const errorMessage = err?.message || "";

      if (
        errorMessage.includes("User already registered") ||
        errorMessage.includes("already registered")
      ) {
        setShowExistsModal(true);
      } else {
        form.setError("root", {
          message: errorMessage || "Something went wrong. Please try again.",
        });
      }
    }
  };

  return {
    form,
    isLoading,
    error,
    showPassword,
    setShowPassword,
    isChecked,
    setChecked,
    showExistsModal,
    setShowExistsModal,
    onSubmit,
    emailFieldRef,
    phoneFieldRef,
    passwordFieldRef,
  };
};
