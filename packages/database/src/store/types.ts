import { configureStore } from "@reduxjs/toolkit";
import type { AxiosInstance } from "axios";
import tablesReducer from "./tablesSlice";

// Configure the dummy store with a dummy extraArgument matching your real store.
const dummyStore = configureStore({
  reducer: { tables: tablesReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {} as { api: AxiosInstance }
      }
    })
});

// Infer the RootState and AppDispatch types from our dummy store.
export type RootState = ReturnType<typeof dummyStore.getState>;
export type AppDispatch = typeof dummyStore.dispatch; 