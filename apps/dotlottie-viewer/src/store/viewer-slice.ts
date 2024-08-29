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
  segment: number[];
  segmentInput: number[];
  useFrameInterpolation: boolean;
  mode: 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';
  currentState: (typeof PlayerStates)[number];
  userSrc: string;
  loadTime: {
    lottieWeb: number;
    dotLottie: number;
  };
  markers: string[];
  activeMarker: string;
}

export const DEFAULT_SRC = 'https://lottie.host/779299c1-d174-4359-a66b-6253897b33e7/yRJTT0fCfq.lottie';

const initialState: AnimationSlice = {
  src: DEFAULT_SRC,
  isJson: true,
  theme: '',
  speed: 1,
  autoplay: true,
  loop: true,
  backgroundColor: '#F3F6F8',
  currentFrame: 0,
  totalFrames: 0,
  themes: [],
  animations: [],
  activeAnimationId: '',
  activeThemeId: '',
  segment: [],
  segmentInput: [1, 2],
  currentState: 'idle',
  mode: 'forward',
  userSrc: '',
  useFrameInterpolation: true,
  loadTime: {
    lottieWeb: 0,
    dotLottie: 0,
  },
  markers: [],
  activeMarker: '',
};

export const animationSlice = createSlice({
  name: 'viewer',
  initialState,
  reducers: {
    setSrc: (state, action) => {
      state.activeAnimationId = '';
      state.activeMarker = '';
      state.markers = [];
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
      state.segmentInput = [1, action.payload];
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
      state.activeAnimationId = '';
      state.activeMarker = '';
      state.markers = [];
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
    setSegment: (state, action) => {
      state.segment = action.payload;
    },
    setSegmentInput: (state, action) => {
      state.segmentInput = action.payload;
    },
    setUseFrameInterpolation: (state, action) => {
      state.useFrameInterpolation = action.payload;
    },
    setMarkers: (state, action) => {
      state.markers = action.payload;
    },
    setActiveMarker: (state, action) => {
      state.activeMarker = action.payload;
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
  setSegment,
  setSegmentInput,
  setUseFrameInterpolation,
  setMarkers,
  setActiveMarker,
} = animationSlice.actions;

export default animationSlice.reducer;
