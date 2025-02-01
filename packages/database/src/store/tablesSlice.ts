// src/databases/tablesSlice.ts
import { createSlice, createAsyncThunk, ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";
import type { AxiosInstance } from "axios";
import type { RootState } from "./types"; // Use the RootState from the dedicated types file
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

const initialState: TableState = {
  tables: {
    byId: {},
    byName: {},
    allIds: []
  },
  schemas: {
    byTableId: {}
  },
  records: {
    byTableId: {}
  },
  loading: {
    tables: "idle",
    records: "idle",
    schemas: "idle"
  },
  error: null,
  initialized: {}
};

export const fetchTableRecords = createAsyncThunk<
  { tableId: string; records: TableRecordItem[]; total: number; nextPageToken: string },
  { tableName: string; queryParams?: QueryParams },
  { state: RootState; extra: { api: AxiosInstance } }
>(
  "tables/fetchRecords",
  async (
    { tableName, queryParams = {} }: { tableName: string; queryParams?: QueryParams },
    thunkAPI
  ) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const { api } = thunkAPI.extra as { api: AxiosInstance };
    const response = await api.post(`/table/${tableId}/record/query`, {
      filters: queryParams.filters || [],
      sort: queryParams.sort || [],
      limit: queryParams.limit || 100,
      page_token: queryParams.pageToken,
      fields: queryParams.fields,
      amount: queryParams.amount || "all"
    });
    return {
      tableId,
      records: response.data.records,
      total: response.data.total,
      nextPageToken: response.data.next_page_token
    };
  }
);

export const createRecord = createAsyncThunk<
  { tableId: string; record: TableRecordItem },
  { tableName: string; record: unknown },
  { state: RootState }
>(
  "tables/createRecord",
  async (
    { tableName, record }: { tableName: string; record: unknown },
    thunkAPI
  ) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const { api } = thunkAPI.extra as { api: AxiosInstance };
    const response = await api.post(`/table/${tableId}/record`, {
      records: [{ fields: record }]
    });
    return {
      tableId,
      record: response.data.records[0]
    };
  }
);

export const updateRecord = createAsyncThunk<
  { tableId: string; record: TableRecordItem },
  { tableName: string; recordId: string; updates: unknown },
  { state: RootState }
>(
  "tables/updateRecord",
  async (
    { tableName, recordId, updates }: { tableName: string; recordId: string; updates: unknown },
    thunkAPI
  ) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const { api } = thunkAPI.extra as { api: AxiosInstance };
    const response = await api.patch(`/table/${tableId}/record/${recordId}`, {
      fields: updates
    });
    return {
      tableId,
      record: response.data.record
    };
  }
);

export const deleteRecord = createAsyncThunk<
  { tableId: string; recordId: string },
  { tableName: string; recordId: string },
  { state: RootState }
>(
  "tables/deleteRecord",
  async (
    { tableName, recordId }: { tableName: string; recordId: string },
    thunkAPI
  ) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const { api } = thunkAPI.extra as { api: AxiosInstance };
    await api.delete(`/table/${tableId}/record/${recordId}`);
    return { tableId, recordId };
  }
);

export const fetchTableSchema = createAsyncThunk<
  { tableId: string; schema: unknown },
  { tableName: string },
  { state: RootState; extra: { api: AxiosInstance } }
>(
  "tables/fetchSchema",
  async ({ tableName }, thunkAPI) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const { api } = thunkAPI.extra as { api: AxiosInstance };
    const response = await api.get(`/table/${tableId}`);
    return { tableId, schema: response.data.table };
  }
);

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    initializeTables: (state: TableState, action: PayloadAction<DatabaseConfig>) => {
      const { SAMPLE_TABLES } = action.payload;
      Object.entries(SAMPLE_TABLES).forEach(([name, id]) => {
        state.tables.byId[id] = { id, name };
        state.tables.byName[name] = id;
        if (!state.tables.allIds.includes(id)) {
          state.tables.allIds.push(id);
        }
        state.initialized[id] = false;
      });
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<TableState>) => {
    builder
      .addCase(fetchTableRecords.pending, (state: TableState) => {
        state.loading.records = "loading";
      })
      .addCase(fetchTableRecords.fulfilled, (state: TableState, action) => {
        const { tableId, records, total } = action.payload;
        state.records.byTableId[tableId] = {
          items: records,
          total,
          lastUpdated: new Date().toISOString()
        };
        state.loading.records = "idle";
        state.initialized[tableId] = true;
      })
      .addCase(
        fetchTableRecords.rejected,
        (state: TableState, action: { error: { message?: string } }) => {
          state.loading.records = "idle";
          state.error = action.error.message || null;
        }
      )
      .addCase(createRecord.fulfilled, (state: TableState, action) => {
        const { tableId, record } = action.payload;
        if (state.records.byTableId[tableId]?.items) {
          state.records.byTableId[tableId].items.push(record);
        }
      })
      .addCase(updateRecord.fulfilled, (state: TableState, action) => {
        const { tableId, record } = action.payload;
        if (state.records.byTableId[tableId]?.items) {
          const index = state.records.byTableId[tableId].items.findIndex(
            (r: TableRecordItem) => r.id === record.id
          );
          if (index !== -1) {
            state.records.byTableId[tableId].items[index] = record;
          }
        }
      })
      .addCase(deleteRecord.fulfilled, (state: TableState, action) => {
        const { tableId, recordId } = action.payload;
        if (state.records.byTableId[tableId]?.items) {
          state.records.byTableId[tableId].items =
            state.records.byTableId[tableId].items.filter(
              (record: TableRecordItem) => record.id !== recordId
            );
        }
      })
      .addCase(fetchTableSchema.pending, (state: TableState) => {
        state.loading.schemas = "loading";
      })
      .addCase(fetchTableSchema.fulfilled, (state: TableState, action) => {
        const { tableId, schema } = action.payload;
        state.schemas.byTableId[tableId] = schema;
        state.loading.schemas = "idle";
      })
      .addCase(
        fetchTableSchema.rejected,
        (state: TableState, action: { error: { message?: string } }) => {
          state.loading.schemas = "idle";
          state.error = action.error.message || null;
        }
      );
  }
});

export const { initializeTables } = tablesSlice.actions;
export const selectTablesState = (state: RootState) => state.tables;
export const selectTableId = (state: RootState, tableName: string) =>
  state.tables.tables.byName[tableName];
export const selectTableRecords = (state: RootState, tableName: string) => {
  const tableId = state.tables.tables.byName[tableName];
  return tableId ? state.tables.records.byTableId[tableId]?.items || [] : [];
};
export const selectTableTotal = (state: RootState, tableName: string) => {
  const tableId = state.tables.tables.byName[tableName];
  return tableId ? state.tables.records.byTableId[tableId]?.total || 0 : 0;
};
export const selectIsLoading = (state: RootState) =>
  state.tables.loading.records === "loading";
export const selectTableSchema = (state: RootState, tableName: string) => {
  const tableId = state.tables.tables.byName[tableName];
  return tableId ? state.tables.schemas.byTableId[tableId] : null;
};
export const selectSchemaLoading = (state: RootState) =>
  state.tables.loading.schemas === "loading";
export default tablesSlice.reducer;

