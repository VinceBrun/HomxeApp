/**
 * Auth Service
 * Handles password recovery flows and validation logic.
 */

import { supabase } from "@/lib/supabase";

export const authService = {
  // Initiates password reset flow via email
  async sendPasswordResetEmail(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "homxe://reset-password",
      });
      if (error) throw error;
      return { success: true, message: "Reset link sent to your email" };
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw error;
    }
  },

  // Updates password for current session
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true, message: "Password updated successfully" };
    } catch (error: any) {
      console.error("Update password error:", error);
      throw error;
    }
  },

  // Checks for valid auth session during reset
  async verifyResetSession(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session !== null;
    } catch {
      return false;
    }
  },

  // Standard email regex validation
  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Password strength check: 8+ chars, upper, lower, number
  validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) return { valid: false, message: "Password must be at least 8 characters" };
    if (!/[A-Z]/.test(password)) return { valid: false, message: "Must contain uppercase letter" };
    if (!/[a-z]/.test(password)) return { valid: false, message: "Must contain lowercase letter" };
    if (!/[0-9]/.test(password)) return { valid: false, message: "Must contain a number" };
    return { valid: true };
  },
};
