// src/databases/DatabaseProvider.tsx
import React, { JSX } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tablesReducer from "./tablesSlice";

const store = configureStore({
  reducer: {
    tables: tablesReducer,
  },
});

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider = ({
  children,
}: DatabaseProviderProps): JSX.Element => {
  return <Provider store={store}>{children}</Provider>;
};
