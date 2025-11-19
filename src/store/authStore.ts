import { create } from 'zustand';
import { MOCK_USERS, User } from '@/api/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  socialLogin: (provider: 'google' | 'facebook' | 'apple') => boolean;
  logout: () => void;
}

// In a real app, you'd fetch the user, but here we find them in the mock data.
// The password is not checked for this simulation.
const findUserByEmail = (email: string): User | undefined => 
  MOCK_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email) => {
    const user = findUserByEmail(email);
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  socialLogin: (provider) => {
    // Simulate a successful social login.
    // In a real app, this would involve an OAuth flow.
    // We'll just log in the first mock user for demonstration.
    console.log(`Simulating ${provider} login...`);
    const user = MOCK_USERS[0];
    set({ user, isAuthenticated: true });
    return true;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
