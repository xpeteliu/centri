import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isVisible: false,
  },
  reducers: {
    showModal: (state, action) => {
      if (action.payload.headerText) { state.headerText = action.payload.headerText; }
      if (action.payload.headerText) { state.bodyText = action.payload.bodyText; }
      state.isVisible = true;
    },
    hideModal: (state) => {
      state.isVisible = false;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;

export default modalSlice.reducer;
