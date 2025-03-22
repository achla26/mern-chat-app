// utils/thunkUtils.js
import { toast } from 'react-hot-toast';

// Handle errors and show toast notifications
export const handleThunkError = (error) => {
  if (error?.response?.data?.errors?.length === 0) {
    toast.error(error?.response?.data?.message);
  } else {
    error?.response?.data?.errors?.forEach((err) => toast.error(err));
  }
  return error?.response?.data || error.message;
};

// Handle loading states in thunks
export const handleThunkLoading = (builder, thunk, stateKey) => {
  builder
    .addCase(thunk.pending, (state) => {
      state[stateKey] = true;
    })
    // .addCase(thunk.fulfilled, (state) => {
    //   state[stateKey] = false;
    // })
    .addCase(thunk.rejected, (state) => {
      state[stateKey] = false;
    });
};