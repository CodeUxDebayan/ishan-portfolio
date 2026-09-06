import { create } from 'zustand';
import { Project } from '@/components/3d/HelixCanvas';

export type ViewMode = 'spiral' | 'list';

interface UIState {
  viewMode: ViewMode;
  isMenuOpen: boolean;
  activeProjectId: string | null;
  hoveredProject: Project | null;
  isAudioPlaying: boolean;
  setViewMode: (mode: ViewMode) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  setActiveProject: (id: string | null) => void;
  setHoveredProject: (project: Project | null) => void;
  toggleAudio: () => void;
  setAudioPlaying: (playing: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  viewMode: 'spiral',
  isMenuOpen: false,
  activeProjectId: null,
  hoveredProject: null,
  isAudioPlaying: false,
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
  setActiveProject: (id) => set({ activeProjectId: id }),
  setHoveredProject: (project) => set({ hoveredProject: project }),
  toggleAudio: () => set((state) => ({ isAudioPlaying: !state.isAudioPlaying })),
  setAudioPlaying: (playing) => set({ isAudioPlaying: playing }),
}));
