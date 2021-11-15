import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './MessageModal/modalSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
  },
});

export default store;
