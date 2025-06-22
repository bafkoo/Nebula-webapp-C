import { create } from 'zustand';
import type { AppState, User } from '../types/app';

interface AppStore extends AppState {
  setCurrentUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentUser: null,
  isLoading: false,
  sidebarCollapsed: false,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setLoading: (loading) => set({ isLoading: loading }),
})); 