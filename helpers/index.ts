import { supabase } from "@/lib/supabase";
import { CompleteAccountPageParams, ConfirmEmailPageParams } from "@/types";
import { getEdgeFunctionError } from "@/utils";
import { router } from "expo-router";

/**
 * Handles Supabase Auth login errors and routes user to appropriate flows
 */
export async function handleLoginError(
  error: any,
  values: { email: string; password: string },
  casesToIgnore?: string[],
): Promise<{ error: any }> {
  const { email, password } = values;

  switch (error?.status) {
    case "EMAIL_UNVERIFIED": {
      if (casesToIgnore?.includes("EMAIL_UNVERIFIED")) break;

      const { error: invokeError } = await supabase.functions.invoke(
        "send-otp",
        {
          body: { email },
        },
      );

      if (invokeError) {
        const parsedError = await getEdgeFunctionError(invokeError);
        console.error(parsedError);
        return { error: parsedError };
      }

      const confirmEmailParams: ConfirmEmailPageParams = {
        type: "verify-email-login",
        email,
        password,
        serverActionType: "verify-email",
      };

      router.push({
        pathname: "/email-verification",
        params: confirmEmailParams,
      });
      break;
    }

    case "INCOMPLETE_PROFILE": {
      if (casesToIgnore?.includes("INCOMPLETE_PROFILE")) break;

      const completeParams: CompleteAccountPageParams = {
        email,
        password,
        type: "complete-account-login",
      };

      router.push({
        pathname: "/",
        params: completeParams,
      });
      break;
    }

    default:
      console.warn("Unhandled auth error:", error);
      return { error };
  }

  return { error: null };
}
