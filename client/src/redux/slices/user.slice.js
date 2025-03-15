import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username:"",
    password :""
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login : (state,action)=> {
        console.log('hello user')
    }
  }
})

// Action creators are generated for each case reducer function
export const { login } = userSlice.actions

export default userSlice.reducer