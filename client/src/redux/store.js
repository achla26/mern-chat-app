import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user.slice'

export default configureStore({
  reducer: {
    user: userReducer
  }
})