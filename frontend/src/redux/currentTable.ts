import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import type { TableType, ColumnType, TaskType } from '../components/utils/Types';

// Define the initial state using that type
const initialState: TableType = {
	columns: [],
  title: "",
  users: [],
  __v: 0,
  _id: "",
};

export const currentTableSlice = createSlice({
  name: 'currentTable',
  initialState,
  reducers: {
    setCurrentTable: (state, action: PayloadAction<TableType>) => {
      state.columns = action.payload.columns
      state.title = action.payload.title
      state.users = action.payload.users
      state.__v = action.payload.__v
      state._id = action.payload._id
    },
    setColumns: (
      state,
      action: PayloadAction< ColumnType[]>
    ) => {
      state.columns = action.payload;
    },
  },
})

export const { setCurrentTable, setColumns } = currentTableSlice.actions
export const selectCurrentTable = (state: RootState) => state.currentTable
export const selectColumns = (state: RootState) => state.currentTable.columns
export default currentTableSlice.reducer