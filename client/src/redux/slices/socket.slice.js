import { safeLocalStorage } from "@/utility/helper";
import { createSlice } from "@reduxjs/toolkit"; 
import { io } from "socket.io-client";

const initialState = { 
    socket:null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: { 
    initializeSocket: (state, action) => {
        const socket = io(import.meta.env.VITE_DB_ORIGIN,{
            query:{
                token:safeLocalStorage.getItem("accessToken"),

            }
        });

        socket.on("connect",()=>{
            console.log("connected to socket server");
        });
        state.socket=socket;       
    }
  },
   
});

// Action creators are generated for each case reducer function
export const { initializeSocket } = socketSlice.actions;

export default socketSlice.reducer;
