import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './MessageModal/modalSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
  },
});

export default store;
