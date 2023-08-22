import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { User } from '../components/utils/Types'

// Define the initial state using that type
const initialState: User = {
	_id: "",
	email: "",
	firstName: "",
	lastName: "",
	level: "",
	userIconId: 0,
	createdAt: "",
	updatedAt: "",
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
			const userData = action.payload;

      state._id = userData._id
      state.email = userData.email
      state.firstName = userData.firstName
      state.lastName = userData.lastName
      state.level = userData.level
      state.userIconId = userData.userIconId
      state.createdAt = userData.createdAt
      state.updatedAt = userData.updatedAt
    },
  },
})

export const { setUserData } = userSlice.actions
export const selectUser = (state: RootState) => state.user
export default userSlice.reducer