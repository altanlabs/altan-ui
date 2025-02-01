import { setDatabaseConfig } from "../src/databases/src/config";

setDatabaseConfig({
  API_BASE_URL: "http://localhost:3000",
  SAMPLE_TABLES: { "users": "table-123", "orders": "table-456" }
});

import tablesReducer, { initializeTables, TableState } from "../src/databases/src/tablesSlice";

describe("tablesSlice reducer", () => {
  it("should initialize tables correctly", () => {
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

    const stateAfterInit = tablesReducer(initialState, initializeTables());
    
    expect(Object.keys(stateAfterInit.tables.byId)).toEqual(
      expect.arrayContaining(["table-123", "table-456"])
    );
    expect(stateAfterInit.tables.byName["users"]).toBe("table-123");
    expect(stateAfterInit.tables.byName["orders"]).toBe("table-456");
  });
});