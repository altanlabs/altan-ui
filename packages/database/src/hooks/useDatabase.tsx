import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchTableRecords,
  fetchTableSchema,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../store/tablesSlice";
import { useAppDispatch } from "./useAppDispatch";
import type { RootState } from "../store/types";

export interface FetchOptions {
  limit?: number;
  filters?: Array<{ field: string; operator: string; value: unknown }>;
  sort?: Array<{ field: string; direction: "asc" | "desc" }>;
  pageToken?: string;
  fields?: string[];
  amount?: "all" | "first" | "one"; 
}

export function useDatabase(table: string) {
  const dispatch = useAppDispatch();

  // Resolve the table ID from table name
  const tableId = useSelector((state: RootState) => state.tables.tables.byName[table]);
  const records = useSelector((state: RootState) =>
    tableId ? state.tables.records.byTableId[tableId]?.items || [] : []
  );
  const schema = useSelector((state: RootState) =>
    tableId ? state.tables.schemas.byTableId[tableId] || null : null
  );
  const isLoading = useSelector((state: RootState) => state.tables.loading.records === "loading");
  const schemaLoading = useSelector((state: RootState) => state.tables.loading.schemas === "loading");
  const initialized = useSelector((state: RootState) =>
    tableId ? state.tables.initialized[tableId] : false
  );

  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  // Internal method to fetch data using Redux thunks.
  const fetchData = useCallback(
    async (options: FetchOptions = { limit: 20 }) => {
      try {
        const result = await dispatch(
          fetchTableRecords({ tableName: table, queryParams: options })
        ).unwrap();
        await dispatch(fetchTableSchema({ tableName: table }));
        setNextPageToken(result.nextPageToken);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    },
    [table, dispatch]
  );

  // If the data for this table isn't loaded yet, fetch automatically.
  useEffect(() => {
    if (tableId && !initialized) {
      fetchData();
    }
  }, [tableId, initialized, fetchData]);

  // Provide a refresh method to re-fetch data manually.
  const refresh = useCallback(async (options: FetchOptions = { limit: 20 }) => {
    try {
      await fetchData(options);
    } catch (error) {
      console.error("Error refreshing data", error);
    }
  }, [fetchData]);

  const fetchNextPage = useCallback(async () => {
    if (nextPageToken) {
      await fetchData({ pageToken: nextPageToken, limit: 20 });
    }
  }, [nextPageToken, fetchData]);

  // CRUD methods to operate on records.
  const addRecord = useCallback(
    async (record: unknown) => {
      try {
        await dispatch(createRecord({ tableName: table, record }));
      } catch (error) {
        console.error("Error creating record", error);
      }
    },
    [table, dispatch]
  );

  const modifyRecord = useCallback(
    async (recordId: string, updates: unknown) => {
      try {
        await dispatch(updateRecord({ tableName: table, recordId, updates }));
      } catch (error) {
        console.error("Error updating record", error);
      }
    },
    [table, dispatch]
  );

  const removeRecord = useCallback(
    async (recordId: string) => {
      try {
        await dispatch(deleteRecord({ tableName: table, recordId }));
      } catch (error) {
        console.error("Error deleting record", error);
      }
    },
    [table, dispatch]
  );

  return {
    records,
    schema,
    isLoading,
    schemaLoading,
    nextPageToken,
    refresh,       // simple refresh method
    fetchNextPage, // for pagination
    addRecord,
    modifyRecord,
    removeRecord,
  };
} 