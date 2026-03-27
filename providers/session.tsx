/**
 * Session Provider
 * Manages auth state, user profile, and active personas (Owner, Seeker, Artisan).
 */

import { supabase } from "@/lib/supabase";
import { personaService } from "@/services/persona";
import { Profile, UserPersona } from "@/types";
import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SignUpCredentials = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
};

interface SessionContextProps {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  activePersona: UserPersona | null;
  allPersonas: UserPersona[];
  signIn: (
    credentials: { email: string; password: string },
    onSuccess?: () => void,
  ) => Promise<void>;
  signUp: (
    credentials: SignUpCredentials,
    onSuccess?: () => void,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  switchPersona: (personaId: string) => Promise<void>;
  refetchPersonas: () => Promise<void>;
  isLoading: boolean;
  error: any;
  setError: (err: any) => void;
}

const SessionContext = createContext<SessionContextProps | null>(null);

/**
 * Global auth and session management provider.
 */
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activePersona, setActivePersona] = useState<UserPersona | null>(null);
  const [allPersonas, setAllPersonas] = useState<UserPersona[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // Load profile and roles for the authenticated user
  const loadUserData = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") throw profileError;

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setProfile(
        profileData ? { ...profileData, email: authUser?.email || null } : null,
      );

      const [personas, active] = await Promise.all([
        personaService.getUserPersonas(),
        personaService.getActivePersona(),
      ]);
      setAllPersonas(personas);
      setActivePersona(active);
    } catch (err) {
      console.error("Session load error:", err);
    }
  }, []);

  // Sync session and auth state changes
  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) setError(error);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await loadUserData(session.user.id);
      setIsLoading(false);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await loadUserData(session.user.id);
      else {
        setProfile(null);
        setActivePersona(null);
        setAllPersonas([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserData]);

  const signIn = useCallback(
    async (
      credentials: { email: string; password: string },
      onSuccess?: () => void,
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } =
          await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) await loadUserData(data.session.user.id);
        onSuccess?.();
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [loadUserData],
  );

  const signUp = useCallback(
    async (credentials: SignUpCredentials, onSuccess?: () => void) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              full_name: credentials.fullName,
              phone_number: credentials.phoneNumber,
            },
          },
        });

        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          await loadUserData(data.session.user.id);
        }
        onSuccess?.();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadUserData],
  );

  const switchPersona = useCallback(async (personaId: string) => {
    setIsLoading(true);
    try {
      await personaService.setActivePersona(personaId);
      setActivePersona(await personaService.getActivePersona());
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchPersonas = useCallback(async () => {
    if (user?.id) {
      const [personas, active] = await Promise.all([
        personaService.getUserPersonas(),
        personaService.getActivePersona(),
      ]);
      setAllPersonas(personas);
      setActivePersona(active);
    }
  }, [user?.id]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setActivePersona(null);
    setAllPersonas([]);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      activePersona,
      allPersonas,
      signIn,
      signUp,
      signOut,
      switchPersona,
      refetchPersonas,
      isLoading,
      error,
      setError,
    }),
    [
      session,
      user,
      profile,
      activePersona,
      allPersonas,
      signIn,
      signUp,
      signOut,
      switchPersona,
      refetchPersonas,
      isLoading,
      error,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
};

/**
 * Alias for useSession().user
 */
export const useUser = () => useSession().user;

export default useSession;
