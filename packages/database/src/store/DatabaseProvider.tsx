// src/databases/DatabaseProvider.tsx
import React, { ReactNode, useMemo } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tablesReducer from "./tablesSlice";
import type { DatabaseConfig } from "../config";
import { validateDatabaseConfig } from "../config";
import { initializeTables } from "./tablesSlice";
import { createAltanDB } from "../api/axios";

interface DatabaseProviderProps {
  config: DatabaseConfig;
  children: ReactNode;
  enableDevTools?: boolean; // Add option to disable Redux DevTools
  customMiddleware?: Array<any>; // Allow custom middleware
}

export const DatabaseProvider = ({
  config,
  children,
  customMiddleware = [],
}: DatabaseProviderProps): JSX.Element => {

  validateDatabaseConfig(config);

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
        }).concat(customMiddleware),
    });
    // Dispatch the initialization with the given config.
    s.dispatch(initializeTables(config));
    return s;
  }, [config, customMiddleware]);

  return <Provider store={store}>{children}</Provider>;
};
