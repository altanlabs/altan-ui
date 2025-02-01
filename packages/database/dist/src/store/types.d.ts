import type { AxiosInstance } from "axios";
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
export interface TableState {
    tables: {
        byId: Record<string, TableRecord>;
        byName: Record<string, string>;
        allIds: string[];
    };
    schemas: {
        byTableId: Record<string, unknown>;
    };
    records: {
        byTableId: Record<string, TableRecordData>;
    };
    loading: LoadingState;
    error: string | null;
    initialized: Record<string, boolean>;
}
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
export interface FetchOptions extends QueryParams {
}
declare const dummyStore: import("@reduxjs/toolkit").EnhancedStore<{
    tables: TableState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        tables: TableState;
    }, {
        api: AxiosInstance;
    }, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof dummyStore.getState>;
export type AppDispatch = typeof dummyStore.dispatch;
export interface DatabaseHookReturn {
    records: TableRecordItem[];
    schema: unknown;
    isLoading: boolean;
    schemaLoading: boolean;
    error: string | null;
    nextPageToken: string | null;
    lastUpdated: string | null;
    refresh: (options?: FetchOptions, onError?: (error: Error) => void) => Promise<void>;
    fetchNextPage: (onError?: (error: Error) => void) => Promise<void>;
    addRecord: (record: unknown, onError?: (error: Error) => void) => Promise<void>;
    modifyRecord: (recordId: string, updates: unknown) => Promise<void>;
    removeRecord: (recordId: string) => Promise<void>;
}
export {};
