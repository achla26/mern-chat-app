import { createSlice } from "@reduxjs/toolkit";
import { getUserChatsThunk} from "../thunks/message.thunk"; 

const initialState = {
 };

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    // login user 
     
 
  },
});

// Action creators are generated for each case reducer function
export const {  } = messageSlice.actions;


export default messageSlice.reducer;
