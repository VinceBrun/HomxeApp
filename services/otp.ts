import { supabase } from "@/lib/supabase";

/**
 * OTP Service for Email Verification
 *
 * IMPORTANT: Supabase sends OTP codes when properly configured.
 * Configure email template in Supabase Studio to show {{ .Token }}
 */
const otpService = {
  /**
   * Verify the 6-digit OTP code
   */
  verifyOTP: async (email: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "signup",
      });

      if (error) throw error;

      return {
        success: true,
        session: data.session,
        user: data.user,
      };
    } catch (error: any) {
      console.error("Verify OTP error:", error);

      // Provide user-friendly error messages
      if (error.message?.includes("expired")) {
        throw new Error("OTP has expired. Please request a new code.");
      }
      if (
        error.message?.includes("invalid") ||
        error.message?.includes("Token")
      ) {
        throw new Error("Invalid OTP code. Please check and try again.");
      }

      throw new Error(error.message || "Failed to verify OTP");
    }
  },

  /**
   * Resend OTP verification code
   */
  resendOTP: async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      return {
        success: true,
        message: "Verification code sent to your email",
      };
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      throw new Error(error.message || "Failed to resend verification code");
    }
  },

  /**
   * Validate OTP format (must be 6 digits)
   */
  validateOTPFormat: (otp: string): boolean => {
    return /^\d{6}$/.test(otp);
  },
};

export default otpService;
