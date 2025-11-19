import { create } from 'zustand';
import { User } from '@/api/mockData';

interface UserState {
  profile: User | null;
  setProfile: (profile: User) => void;
  updateProfile: (updates: Partial<User>) => void;
  addPoints: (points: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
  addPoints: (points) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, points: state.profile.points + points }
        : null,
    })),
}));
