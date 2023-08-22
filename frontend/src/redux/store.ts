import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user';
import uiReducer from './isMobile'
import tablesReducer from './tables'
import currentTableReducer from './currentTable';

export const store = configureStore({
  reducer: {
		user: userReducer,
		ui: uiReducer,
    tables: tablesReducer,
    currentTable: currentTableReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch