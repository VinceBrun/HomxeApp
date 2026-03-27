/**
 * User Store
 * Manages global user state, including profile details and active personas.
 */

import { Profile, UserPersona, ZustandSetState } from '@/types';
import { createSetState } from '@/utils';
import { create } from 'zustand';

type UserState = {
  profile: Profile | null;
  activePersona: UserPersona | null;
  allPersonas: UserPersona[];
  setProfile: ZustandSetState<Profile | null>;
  setActivePersona: ZustandSetState<UserPersona | null>;
  setAllPersonas: ZustandSetState<UserPersona[]>;
  resetUser: () => void;
};

const initialState = {
  profile: null,
  activePersona: null,
  allPersonas: [],
};

const useUser = create<UserState>((set) => ({
  ...initialState,
  setProfile: createSetState<UserState>('profile', set),
  setActivePersona: createSetState<UserState>('activePersona', set),
  setAllPersonas: createSetState<UserState>('allPersonas', set),
  resetUser: () => set(initialState),
}));

export function useUserStore() {
  return useUser();
}