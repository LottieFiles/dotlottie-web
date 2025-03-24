import { create } from 'zustand';
import { useExampleStore } from './exampleStore';

interface EditorState {
  themeJson: string;
  dotLottieObject: DotLottie | undefined;
  setThemeJson: (json: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isSlotPanelOpen: boolean;
  toggleSlotPanel: () => void;
  previewType: 'dotlottie-web';
  parsedTheme: any;
  updateParsedData: (theme: any) => void;
  setDotLottieObject: (dotLottie: DotLottie) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  themeJson: useExampleStore.getState().examples[0].interactivityJson,
  dotLottieObject: undefined,
  setThemeJson: (json) => set({ themeJson: json }),
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isSlotPanelOpen: true,
  toggleSlotPanel: () => set((state) => ({ isSlotPanelOpen: !state.isSlotPanelOpen })),
  previewType: 'dotlottie-web',
  parsedTheme: null,
  updateParsedData: (theme) => set({ parsedTheme: theme }),
  setDotLottieObject: (dotLottie) => set({ dotLottieObject: dotLottie }),
}));
