/**
 * Persona Service
 * Manages user roles (Owner, Seeker, Artisan) via Supabase RPC.
 */

import { supabase } from "@/lib/supabase";
import { PersonaType, Profile, UserPersona } from "@/types";

export const personaService = {
  /** Retrieves all roles for the current user. */
  async getUserPersonas(): Promise<UserPersona[]> {
    const { data, error } = await supabase.rpc("get_user_personas");
    if (error) throw error;
    return data || [];
  },

  /** Gets the user's active role. */
  async getActivePersona(): Promise<UserPersona | null> {
    const { data, error } = await supabase.rpc("get_active_persona");
    if (error) {
      console.error("Get active persona error:", error);
      return null;
    }
    return data;
  },

  /** Creates or updates a user role. */
  async upsertPersona(
    type: PersonaType,
    options?: {
      display_name?: string;
      avatar_url?: string;
      bio?: string;
      metadata?: Record<string, any>;
    },
  ): Promise<UserPersona> {
    const { data, error } = await supabase.rpc("upsert_persona", {
      p_type: type,
      p_display_name: options?.display_name || null,
      p_avatar_url: options?.avatar_url || null,
      p_bio: options?.bio || null,
      p_metadata: options?.metadata || {},
    });
    if (error) throw error;
    return data;
  },

  /** Sets the active role for the current session. */
  async setActivePersona(personaId: string): Promise<Profile> {
    const { data, error } = await supabase.rpc("set_active_persona", {
      p_persona_id: personaId,
    });
    if (error) throw error;
    return data;
  },

  async getPersonaById(personaId: string): Promise<UserPersona | null> {
    const { data, error } = await supabase
      .from("user_personas")
      .select("*")
      .eq("id", personaId)
      .single();
    if (error) {
      console.error("Get persona error:", error);
      return null;
    }
    return data;
  },
};
