/* eslint-disable import/no-unresolved */
/* @ts-ignore */


import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @ts-ignore
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("DB_URL")!,
  Deno.env.get("DB_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const {
      credentials: { full_name, email, password, phone_number, role },
    } = await req.json();

    if (!email || !password || !full_name || !phone_number || !role) {
      return new Response(
        JSON.stringify({
          error: "Missing fields",
          message: "Required parameter(s) missing or invalid.",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("🔐 Creating user via Supabase Admin...");
    const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, phone_number, role },
    });

    if (signUpError || !user) {
      return new Response(
        JSON.stringify({ error: signUpError?.message || "Signup failed." }),
        { status: 500, headers: corsHeaders }
      );
    }

    const userId = user.user.id;

    console.log("🧾 Inserting into users table...");
    const { error: insertError } = await supabase.from("users").insert([{
      id: userId,
      full_name,
      email,
      phone_number,
      role: [role], 
    }]);

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log("🧬 Upserting into profiles table...");
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      full_name,
      phone_number,
      role: [role], 
    }, { onConflict: ["id"] });

    if (profileError) {
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        user_id: userId,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Unknown error",
        message: "An unexpected error occurred.",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
