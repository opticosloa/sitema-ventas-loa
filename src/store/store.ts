import { configureStore } from '@reduxjs/toolkit';
import { uiSlice, authSlice} from './';



export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        auth: authSlice.reducer,
    },
  devTools: true,
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;