import { configureStore } from "@reduxjs/toolkit";
import type { AxiosInstance } from "axios";
import tablesReducer from "./tablesSlice";

// Database Types
export interface TableRecord {
  id: string;
  name: string;
}

export interface TableRecordItem {
  id: string;
  fields: Record<string, unknown>;
}

export interface TableRecordData {
  items: TableRecordItem[];
  total: number;
  lastUpdated: string;
  nextPageToken?: string;
}

export type LoadingStatus = "idle" | "loading" | "error";

export interface LoadingState {
  tables: LoadingStatus;
  records: LoadingStatus;
  schemas: LoadingStatus;
}

// Schema Types
export interface TableFieldOption {
  color?: string
  label?: string
}

export interface TableFieldOptions {
  required?: boolean
  date_options?: {
    include_time?: boolean
  }
  select_options?: TableFieldOption[]
}

export interface TableField {
  id: string
  table_id: string
  name: string
  type: string
  cell_value_type: string
  is_multiple_cell_value: boolean
  db_field_type: string
  db_field_name: string
  not_null: boolean
  unique: boolean
  is_primary: boolean
  is_computed: boolean
  is_pending: boolean
  has_error: boolean
  order: number
  version: number
  created_by: string
  date_creation: string
  options?: TableFieldOptions
}

export interface TableView {
  id: string
  table_id: string
  name: string
  type: string
  sort: Record<string, unknown>
  options: Record<string, unknown>
  order: number
  version: number
  column_meta: Record<string, unknown>
  enable_share: boolean
  created_by: string
  date_creation: string
}

export interface TableSchema {
  table: {
    id: string
    base_id: string
    name: string
    description: string
    version: number
    order: number
    created_by: string
    permission_type: string
    date_creation: string
    fields: {
      items: TableField[]
    }
    views: {
      items: TableView[]
    }
  }
}

// Query Types
export type FilterOperator = "eq" | "neq" | "gt" | "lt" | "contains" | "startsWith";

export interface QueryFilter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export interface QuerySort {
  field: string;
  direction: "asc" | "desc";
}

export interface QueryParams {
  filters?: QueryFilter[];
  sort?: QuerySort[];
  limit?: number;
  pageToken?: string;
  fields?: string[];
  amount?: "all" | "first" | "one";
}

// Hook Types
export interface FetchOptions extends QueryParams {}

// Redux Store Types
const dummyStore = configureStore({
  reducer: { tables: tablesReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {} as { api: AxiosInstance }
      }
    })
});

export type RootState = ReturnType<typeof dummyStore.getState>;
export type AppDispatch = typeof dummyStore.dispatch;

// Export a type for the hook return value
export interface DatabaseHookReturn {
  records: TableRecordItem[]
  schema: TableSchema | null
  isLoading: boolean
  schemaLoading: boolean
  error: string | null
  nextPageToken: string | null
  lastUpdated: string | null
  refresh: (options?: FetchOptions, onError?: (error: Error) => void) => Promise<void>
  fetchNextPage: (onError?: (error: Error) => void) => Promise<void>
  addRecord: (record: unknown, onError?: (error: Error) => void) => Promise<void>
  modifyRecord: (recordId: string, updates: unknown) => Promise<void>
  removeRecord: (recordId: string) => Promise<void>
}

// Update the TableState interface to use the correct schema type
export interface TableState {
  tables: {
    byId: Record<string, TableRecord>;
    byName: Record<string, string>;
    allIds: string[];
  };
  schemas: {
    byTableId: Record<string, TableSchema>;
  };
  records: {
    byTableId: Record<string, TableRecordData>;
  };
  loading: LoadingState;
  error: string | null;
  initialized: Record<string, boolean>;
} 