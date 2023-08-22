import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import type { UiState } from '../components/utils/Types'

const initialState: UiState = {
    isMobile: window.innerWidth <= 768,
  };

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
        state.isMobile = action.payload;
      },
  },
})

export const { setIsMobile } = uiSlice.actions;
export const isMobileValue = (state: RootState) => state.ui.isMobile
export default uiSlice.reducer