import { configureStore } from '@reduxjs/toolkit';

import viewerSlice from './viewer-slice';

const store = configureStore({
  reducer: {
    viewer: viewerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
