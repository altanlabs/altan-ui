// src/databases/tablesSlice.ts
import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { createAltanDB } from "./axios";
import { getDatabaseConfig } from "./config"

// Define RootState for typing getState in our thunks
export interface RootState {
  tables: TableState;
}

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
}

export interface QueryParams {
  filters?: unknown[];
  sort?: unknown[];
  limit?: number;
  pageToken?: string;
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
  error: null
};

export const fetchTableRecords = createAsyncThunk<
  { tableId: string; records: TableRecordItem[]; total: number; nextPageToken: string },
  { tableName: string; queryParams?: QueryParams },
  { state: RootState }
>(
  "tables/fetchRecords",
  async (
    { tableName, queryParams = {} }: { tableName: string; queryParams?: QueryParams },
    thunkAPI: { getState: () => RootState }
  ) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    const response = await altan_db.post(`/table/${tableId}/record/query`, {
      filters: queryParams.filters || [],
      sort: queryParams.sort || [],
      limit: queryParams.limit || 100,
      page_token: queryParams.pageToken,
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
    thunkAPI: { getState: () => RootState }
  ) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    const response = await altan_db.post(`/table/${tableId}/record`, {
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
    thunkAPI: { getState: () => RootState }
  ) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    const response = await altan_db.patch(`/table/${tableId}/record/${recordId}`, {
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
    thunkAPI: { getState: () => RootState }
  ) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    await altan_db.delete(`/table/${tableId}/record/${recordId}`);
    return { tableId, recordId };
  }
);

export const fetchTableSchema = createAsyncThunk<
  { tableId: string; schema: unknown },
  { tableName: string },
  { state: RootState }
>(
  "tables/fetchSchema",
  async (
    { tableName }: { tableName: string },
    thunkAPI: { getState: () => RootState }
  ) => {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId) throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    const response = await altan_db.get(`/table/${tableId}`);
    return { tableId, schema: response.data.table };
  }
);

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    initializeTables: (state: TableState) => {
      const { SAMPLE_TABLES } = getDatabaseConfig();
      Object.entries(SAMPLE_TABLES).forEach(([name, id]: [string, string]) => {
        state.tables.byId[id] = { id, name };
        state.tables.byName[name] = id;
        if (!state.tables.allIds.includes(id)) {
          state.tables.allIds.push(id);
        }
      });
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<TableState>) => {
    builder
      .addCase(fetchTableRecords.pending, (state: TableState) => {
        state.loading.records = "loading";
      })
      .addCase(
        fetchTableRecords.fulfilled,
        (
          state: TableState,
          action: {
            payload: {
              tableId: string;
              records: TableRecordItem[];
              total: number;
              nextPageToken: string;
            };
          }
        ) => {
          const { tableId, records, total } = action.payload;
          state.records.byTableId[tableId] = {
            items: records,
            total,
            lastUpdated: new Date().toISOString()
          };
          state.loading.records = "idle";
        }
      )
      .addCase(
        fetchTableRecords.rejected,
        (
          state: TableState,
          action: { error: { message?: string } }
        ) => {
          state.loading.records = "idle";
          state.error = action.error.message || null;
        }
      )
      .addCase(
        createRecord.fulfilled,
        (
          state: TableState,
          action: { payload: { tableId: string; record: TableRecordItem } }
        ) => {
          const { tableId, record } = action.payload;
          if (state.records.byTableId[tableId]?.items) {
            state.records.byTableId[tableId].items.push(record);
          }
        }
      )
      .addCase(
        updateRecord.fulfilled,
        (
          state: TableState,
          action: { payload: { tableId: string; record: TableRecordItem } }
        ) => {
          const { tableId, record } = action.payload;
          if (state.records.byTableId[tableId]?.items) {
            const index = state.records.byTableId[tableId].items.findIndex(
              (r: TableRecordItem) => r.id === record.id
            );
            if (index !== -1) {
              state.records.byTableId[tableId].items[index] = record;
            }
          }
        }
      )
      .addCase(
        deleteRecord.fulfilled,
        (
          state: TableState,
          action: { payload: { tableId: string; recordId: string } }
        ) => {
          const { tableId, recordId } = action.payload;
          if (state.records.byTableId[tableId]?.items) {
            state.records.byTableId[tableId].items =
              state.records.byTableId[tableId].items.filter(
                (record: TableRecordItem) => record.id !== recordId
              );
          }
        }
      )
      .addCase(fetchTableSchema.pending, (state: TableState) => {
        state.loading.schemas = "loading";
      })
      .addCase(
        fetchTableSchema.fulfilled,
        (
          state: TableState,
          action: { payload: { tableId: string; schema: unknown } }
        ) => {
          const { tableId, schema } = action.payload;
          state.schemas.byTableId[tableId] = schema;
          state.loading.schemas = "idle";
        }
      )
      .addCase(
        fetchTableSchema.rejected,
        (
          state: TableState,
          action: { error: { message?: string } }
        ) => {
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