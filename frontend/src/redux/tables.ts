import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { TableType } from '../components/utils/Types'

// Define the initial state using that type
const initialState: TableType[] = []

export const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables: (state, action: PayloadAction<TableType[]>) => {
			const tablesData = action.payload;
      return tablesData
    },
  },
})

export const { setTables } = tablesSlice.actions
export const selectTables = (state: RootState) => state.tables
export default tablesSlice.reducer