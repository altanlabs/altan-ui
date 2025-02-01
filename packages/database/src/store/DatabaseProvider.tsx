// src/databases/DatabaseProvider.tsx
import React, { ReactNode, useMemo } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tablesReducer from "./tablesSlice";
import type { DatabaseConfig } from "../config";
import { initializeTables } from "./tablesSlice";
import { createAltanDB } from "../api/axios";

interface DatabaseProviderProps {
  config: DatabaseConfig;
  children: ReactNode;
}

export const DatabaseProvider = ({
  config,
  children,
}: DatabaseProviderProps): JSX.Element => {
  // Create the Redux store once using useMemo.
  const store = useMemo(() => {
    const s = configureStore({
      reducer: {
        tables: tablesReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {
            // Create the axios instance once using the API_BASE_URL from the provider config.
            extraArgument: { api: createAltanDB(config.API_BASE_URL) },
          },
        }),
    });
    // Dispatch the initialization with the given config.
    s.dispatch(initializeTables(config));
    return s;
  }, [config]);

  return <Provider store={store}>{children}</Provider>;
};
