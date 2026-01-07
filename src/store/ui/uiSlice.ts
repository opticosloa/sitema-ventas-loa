import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isSideBarOpen: false,
        isItemModalOpen: false,
        counter: 0,
        selectedProduct: null
      },
      reducers: {
        onItemModalHandler: ( state ) => {
            state.isItemModalOpen = !state.isItemModalOpen;
        },
        onSideBarOpenHandler: ( state ) => {
            state.isSideBarOpen = !state.isSideBarOpen;
        },
        setSelectedProduct: ( state, { payload } ) => {
            state.selectedProduct = payload;
        },
        increment: ( state ) => {
          state.counter += 1;
        },
        resetCouter: ( state ) => {
          state.counter = 0;
        }
      }
});



export const { onItemModalHandler, onSideBarOpenHandler, setSelectedProduct, increment, resetCouter } = uiSlice.actions;