/**
 * Copyright 2023 Design Barn Inc.
 */

import { createSlice } from '@reduxjs/toolkit';

export const PlayerStates = ['idle', 'loading', 'playing', 'paused', 'stopped'] as const;

interface AnimationSlice {
  src: string;
  isJson: boolean;
  theme: string;
  speed: number;
  autoplay: boolean;
  loop: boolean;
  backgroundColor: string;
  currentFrame: number;
  totalFrames: number;
  themes: { id: string; animations: string[] }[];
  animations: string[];
  activeAnimationId: string;
  activeThemeId: string;
  segment: string[];
  mode: 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';
  currentState: (typeof PlayerStates)[number];
  userSrc: string;
  loadTime: {
    lottieWeb: number;
    dotLottie: number;
  };
}

export const DEFAULT_SRC = '/celebrate.json';
// src: "https://lottie.host/5525262b-4e57-4f0a-8103-cfdaa7c8969e/VCYIkooYX8.json",
// src: 'lottie-lego.json',
// src: './theming_example.lottie',

const initialState: AnimationSlice = {
  src: DEFAULT_SRC,
  isJson: true,
  theme: '',
  speed: 1,
  autoplay: true,
  loop: true,
  backgroundColor: '',
  currentFrame: 0,
  totalFrames: 0,
  themes: [],
  animations: [],
  activeAnimationId: '',
  activeThemeId: '',
  segment: [],
  currentState: 'idle',
  mode: 'forward',
  userSrc: '',
  loadTime: {
    lottieWeb: 0,
    dotLottie: 0,
  },
};

export const animationSlice = createSlice({
  name: 'viewer',
  initialState,
  reducers: {
    setSrc: (state, action) => {
      state.src = action.payload;
      if (state.src.endsWith('.json') || state.src.startsWith('data:application/json')) {
        state.isJson = true;
      } else {
        state.isJson = false;
      }
    },
    setIsJson: (state, action) => {
      state.isJson = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSpeed: (state, action) => {
      state.speed = action.payload;
    },
    setAutoplay: (state, action) => {
      state.autoplay = action.payload;
    },
    setLoop: (state, action) => {
      state.loop = action.payload;
    },
    setBackgroundColor: (state, action) => {
      state.backgroundColor = action.payload;
    },
    setCurrentFrame: (state, action) => {
      state.currentFrame = action.payload;
    },
    setTotalFrames: (state, action) => {
      state.totalFrames = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setMdode: (state, action) => {
      state.mode = action.payload;
    },
    setThemes: (state, action) => {
      state.themes = action.payload;
    },
    setAnimations: (state, action) => {
      state.animations = action.payload;
    },
    setActiveAnimationId: (state, action) => {
      state.activeAnimationId = action.payload;
    },
    setActiveThemeId: (state, action) => {
      state.activeThemeId = action.payload;
    },
    setUserSrc: (state, action) => {
      state.userSrc = action.payload;
    },
    resetUserConfig: (state) => {
      state.userSrc = '';
      state.src = DEFAULT_SRC;
      if (state.src.endsWith('.json') || state.src.startsWith('data:application/json')) {
        state.isJson = true;
      } else {
        state.isJson = false;
      }
    },
    setLoadTimeDotLottie: (state, action) => {
      state.loadTime.dotLottie = action.payload;
    },
    setLoadTimeLottieWeb: (state, action) => {
      state.loadTime.lottieWeb = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSrc,
  setTheme,
  setSpeed,
  setAutoplay,
  setLoop,
  setBackgroundColor,
  setCurrentFrame,
  setTotalFrames,
  setCurrentState,
  setMdode,
  setThemes,
  setAnimations,
  setActiveAnimationId,
  setActiveThemeId,
  setUserSrc,
  resetUserConfig,
  setIsJson,
  setLoadTimeDotLottie,
  setLoadTimeLottieWeb,
} = animationSlice.actions;

export default animationSlice.reducer;
