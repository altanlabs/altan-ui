import type { AxiosInstance } from "axios";
import type { RootState } from "./types";
import type { DatabaseConfig } from "../config";
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
}
export interface LoadingState {
    tables: "idle" | "loading";
    records: "idle" | "loading";
    schemas: "idle" | "loading";
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
export interface QueryParams {
    filters?: unknown[];
    sort?: unknown[];
    limit?: number;
    pageToken?: string;
    fields?: string[];
    amount?: string;
}
export declare const fetchTableRecords: import("@reduxjs/toolkit").AsyncThunk<{
    tableId: string;
    records: TableRecordItem[];
    total: number;
    nextPageToken: string;
}, {
    tableName: string;
    queryParams?: QueryParams;
}, {
    state: RootState;
    extra: {
        api: AxiosInstance;
    };
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction> | undefined;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createRecord: import("@reduxjs/toolkit").AsyncThunk<{
    tableId: string;
    record: TableRecordItem;
}, {
    tableName: string;
    record: unknown;
}, {
    state: RootState;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction> | undefined;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateRecord: import("@reduxjs/toolkit").AsyncThunk<{
    tableId: string;
    record: TableRecordItem;
}, {
    tableName: string;
    recordId: string;
    updates: unknown;
}, {
    state: RootState;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction> | undefined;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const deleteRecord: import("@reduxjs/toolkit").AsyncThunk<{
    tableId: string;
    recordId: string;
}, {
    tableName: string;
    recordId: string;
}, {
    state: RootState;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction> | undefined;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchTableSchema: import("@reduxjs/toolkit").AsyncThunk<{
    tableId: string;
    schema: unknown;
}, {
    tableName: string;
}, {
    state: RootState;
    extra: {
        api: AxiosInstance;
    };
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction> | undefined;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const initializeTables: import("@reduxjs/toolkit").ActionCreatorWithPayload<DatabaseConfig, "tables/initializeTables">;
export declare const selectTablesState: (state: RootState) => TableState;
export declare const selectTableId: (state: RootState, tableName: string) => string;
export declare const selectTableRecords: (state: RootState, tableName: string) => TableRecordItem[];
export declare const selectTableTotal: (state: RootState, tableName: string) => number;
export declare const selectIsLoading: (state: RootState) => boolean;
export declare const selectTableSchema: (state: RootState, tableName: string) => unknown;
export declare const selectSchemaLoading: (state: RootState) => boolean;
declare const _default: import("redux").Reducer<TableState>;
export default _default;
