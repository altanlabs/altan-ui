"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// index.ts
var altan_ui_exports = {};
__export(altan_ui_exports, {
  databases: () => databases_exports
});
module.exports = __toCommonJS(altan_ui_exports);

// src/databases/index.ts
var databases_exports = {};
__export(databases_exports, {
  DatabaseProvider: () => DatabaseProvider,
  createAltanDB: () => createAltanDB,
  createRecord: () => createRecord,
  deleteRecord: () => deleteRecord,
  fetchTableRecords: () => fetchTableRecords,
  fetchTableSchema: () => fetchTableSchema,
  getDatabaseConfig: () => getDatabaseConfig,
  initializeTables: () => initializeTables,
  selectIsLoading: () => selectIsLoading,
  selectSchemaLoading: () => selectSchemaLoading,
  selectTableId: () => selectTableId,
  selectTableRecords: () => selectTableRecords,
  selectTableSchema: () => selectTableSchema,
  selectTableTotal: () => selectTableTotal,
  selectTablesState: () => selectTablesState,
  setDatabaseConfig: () => setDatabaseConfig,
  updateRecord: () => updateRecord
});

// src/databases/src/config.ts
var config = null;
var setDatabaseConfig = (cfg) => {
  config = cfg;
};
var getDatabaseConfig = () => {
  if (!config) {
    throw new Error("Database configuration is not set. Call setDatabaseConfig() first.");
  }
  return config;
};

// src/databases/src/axios.ts
var import_axios = __toESM(require("axios"));
var createAltanDB = () => {
  const { API_BASE_URL } = getDatabaseConfig();
  const instance = import_axios.default.create({
    baseURL: API_BASE_URL
  });
  return instance;
};

// src/databases/src/tablesSlice.ts
var import_toolkit = require("@reduxjs/toolkit");
var initialState = {
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
var fetchTableRecords = (0, import_toolkit.createAsyncThunk)(
  "tables/fetchRecords",
  (_0, _1) => __async(void 0, [_0, _1], function* ({ tableName, queryParams = {} }, thunkAPI) {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId)
      throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    const response = yield altan_db.post(`/table/${tableId}/record/query`, {
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
  })
);
var createRecord = (0, import_toolkit.createAsyncThunk)(
  "tables/createRecord",
  (_0, _1) => __async(void 0, [_0, _1], function* ({ tableName, record }, thunkAPI) {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId)
      throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    const response = yield altan_db.post(`/table/${tableId}/record`, {
      records: [{ fields: record }]
    });
    return {
      tableId,
      record: response.data.records[0]
    };
  })
);
var updateRecord = (0, import_toolkit.createAsyncThunk)(
  "tables/updateRecord",
  (_0, _1) => __async(void 0, [_0, _1], function* ({ tableName, recordId, updates }, thunkAPI) {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId)
      throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    const response = yield altan_db.patch(`/table/${tableId}/record/${recordId}`, {
      fields: updates
    });
    return {
      tableId,
      record: response.data.record
    };
  })
);
var deleteRecord = (0, import_toolkit.createAsyncThunk)(
  "tables/deleteRecord",
  (_0, _1) => __async(void 0, [_0, _1], function* ({ tableName, recordId }, thunkAPI) {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId)
      throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    yield altan_db.delete(`/table/${tableId}/record/${recordId}`);
    return { tableId, recordId };
  })
);
var fetchTableSchema = (0, import_toolkit.createAsyncThunk)(
  "tables/fetchSchema",
  (_0, _1) => __async(void 0, [_0, _1], function* ({ tableName }, thunkAPI) {
    const state = thunkAPI.getState();
    const tableId = state.tables.tables.byName[tableName];
    if (!tableId)
      throw new Error(`Table ${tableName} not found`);
    const altan_db = createAltanDB();
    const response = yield altan_db.get(`/table/${tableId}`);
    return { tableId, schema: response.data.table };
  })
);
var tablesSlice = (0, import_toolkit.createSlice)({
  name: "tables",
  initialState,
  reducers: {
    initializeTables: (state) => {
      const { SAMPLE_TABLES } = getDatabaseConfig();
      Object.entries(SAMPLE_TABLES).forEach(([name, id]) => {
        state.tables.byId[id] = { id, name };
        state.tables.byName[name] = id;
        if (!state.tables.allIds.includes(id)) {
          state.tables.allIds.push(id);
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTableRecords.pending, (state) => {
      state.loading.records = "loading";
    }).addCase(
      fetchTableRecords.fulfilled,
      (state, action) => {
        const { tableId, records, total } = action.payload;
        state.records.byTableId[tableId] = {
          items: records,
          total,
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
        };
        state.loading.records = "idle";
      }
    ).addCase(
      fetchTableRecords.rejected,
      (state, action) => {
        state.loading.records = "idle";
        state.error = action.error.message || null;
      }
    ).addCase(
      createRecord.fulfilled,
      (state, action) => {
        var _a;
        const { tableId, record } = action.payload;
        if ((_a = state.records.byTableId[tableId]) == null ? void 0 : _a.items) {
          state.records.byTableId[tableId].items.push(record);
        }
      }
    ).addCase(
      updateRecord.fulfilled,
      (state, action) => {
        var _a;
        const { tableId, record } = action.payload;
        if ((_a = state.records.byTableId[tableId]) == null ? void 0 : _a.items) {
          const index = state.records.byTableId[tableId].items.findIndex(
            (r) => r.id === record.id
          );
          if (index !== -1) {
            state.records.byTableId[tableId].items[index] = record;
          }
        }
      }
    ).addCase(
      deleteRecord.fulfilled,
      (state, action) => {
        var _a;
        const { tableId, recordId } = action.payload;
        if ((_a = state.records.byTableId[tableId]) == null ? void 0 : _a.items) {
          state.records.byTableId[tableId].items = state.records.byTableId[tableId].items.filter(
            (record) => record.id !== recordId
          );
        }
      }
    ).addCase(fetchTableSchema.pending, (state) => {
      state.loading.schemas = "loading";
    }).addCase(
      fetchTableSchema.fulfilled,
      (state, action) => {
        const { tableId, schema } = action.payload;
        state.schemas.byTableId[tableId] = schema;
        state.loading.schemas = "idle";
      }
    ).addCase(
      fetchTableSchema.rejected,
      (state, action) => {
        state.loading.schemas = "idle";
        state.error = action.error.message || null;
      }
    );
  }
});
var { initializeTables } = tablesSlice.actions;
var selectTablesState = (state) => state.tables;
var selectTableId = (state, tableName) => state.tables.tables.byName[tableName];
var selectTableRecords = (state, tableName) => {
  var _a;
  const tableId = state.tables.tables.byName[tableName];
  return tableId ? ((_a = state.tables.records.byTableId[tableId]) == null ? void 0 : _a.items) || [] : [];
};
var selectTableTotal = (state, tableName) => {
  var _a;
  const tableId = state.tables.tables.byName[tableName];
  return tableId ? ((_a = state.tables.records.byTableId[tableId]) == null ? void 0 : _a.total) || 0 : 0;
};
var selectIsLoading = (state) => state.tables.loading.records === "loading";
var selectTableSchema = (state, tableName) => {
  const tableId = state.tables.tables.byName[tableName];
  return tableId ? state.tables.schemas.byTableId[tableId] : null;
};
var selectSchemaLoading = (state) => state.tables.loading.schemas === "loading";
var tablesSlice_default = tablesSlice.reducer;

// src/databases/src/DatabaseProvider.tsx
var import_react = __toESM(require("react"));
var import_react_redux = require("react-redux");
var import_toolkit2 = require("@reduxjs/toolkit");
var store = (0, import_toolkit2.configureStore)({
  reducer: {
    tables: tablesSlice_default
  }
});
var DatabaseProvider = ({
  children
}) => {
  return /* @__PURE__ */ import_react.default.createElement(import_react_redux.Provider, { store }, children);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  databases
});
