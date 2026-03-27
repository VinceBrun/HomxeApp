/* eslint-disable import/no-unresolved */
/* @ts-ignore */


import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("DB_URL")!,
  Deno.env.get("DB_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      headers: corsHeaders,
      status: 405,
    });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: "Missing fields",
          message: "Email and password are required.",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("Authenticating user...");
    const { error: signInError, data: loginData } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !loginData?.user) {
      return new Response(
        JSON.stringify({
          error: "login_failed",
          message: signInError?.message || "Login failed. Please try again.",
        }),
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = loginData.user.id;
    const incomingRole = req.headers.get('x-app-role');

    console.log("Fetching profile...");
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !userProfile) {
      return new Response(
        JSON.stringify({
          error: "profile_missing",
          message: "User profile not found.",
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (incomingRole && !userProfile.role.includes(incomingRole)) {
      const updatedRoles = [...userProfile.role, incomingRole];
      console.log(`🔁 Appending missing role: ${incomingRole}`);
      await supabase
        .from("profiles")
        .update({ role: updatedRoles })
        .eq("id", userId);
    }

    if (!userProfile.email_confirmed) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email not confirmed. Please verify your email to proceed.",
          status: "EMAIL_UNVERIFIED",
        }),
        { status: 403, headers: corsHeaders }
      );
    }

    const { first_name, last_name } = userProfile;
    if (!first_name || !last_name) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User profile is not complete.",
          status: "INCOMPLETE_PROFILE",
        }),
        { status: 403, headers: corsHeaders }
      );
    }

    console.log("Checking passcode...");
    const { error: passcodeError } = await supabase
      .from("passcodes")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (passcodeError?.code === "PGRST116") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User passcode not found.",
          status: "NO_PASSCODE",
        }),
        { status: 403, headers: corsHeaders }
      );
    }

    if (passcodeError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Passcode check failed",
          message: passcodeError.message,
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: loginData,
        message: "Login successful.",
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Unexpected error",
        message: "Something went wrong.",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
