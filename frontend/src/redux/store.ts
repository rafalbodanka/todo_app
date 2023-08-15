import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user';
import uiReducer from './isMobile'

export const store = configureStore({
  reducer: {
		user: userReducer,
		ui: uiReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch