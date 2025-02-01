import { useCallback, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  fetchTableRecords,
  fetchTableSchema,
  createRecord,
  updateRecord,
  deleteRecord,
  selectTableData,
} from "../store/tablesSlice";
import { useAppDispatch } from "./useAppDispatch";
import {
  FetchOptions,
  DatabaseHookReturn,
  RootState,
} from "../store/types";

export function useDatabase(table: string): DatabaseHookReturn {
  const dispatch = useAppDispatch();
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  // Use memoized selector for better performance
  const tableData = useSelector((state: RootState) => selectTableData(state, table));
  const isLoadingRecords = useSelector((state: RootState) => state.tables.loading.records === "loading");
  const isLoadingSchema = useSelector((state: RootState) => state.tables.loading.schemas === "loading");
  const error = useSelector((state: RootState) => state.tables.error);

  // Memoize derived data
  const { records, schema, initialized, lastUpdated } = useMemo(() => ({
    records: tableData?.records || [],
    schema: tableData?.schema || null,
    initialized: tableData?.initialized || false,
    lastUpdated: tableData?.lastUpdated || null
  }), [tableData]);

  // Load schema if needed
  useEffect(() => {
    if (table && !schema && !isLoadingSchema) {
      dispatch(fetchTableSchema({ tableName: table }));
    }
  }, [table, schema, isLoadingSchema, dispatch]);

  // Initial data load
  useEffect(() => {
    if (table && !initialized && !isLoadingRecords) {
      dispatch(fetchTableRecords({ 
        tableName: table,
        queryParams: { limit: 20 } 
      }));
    }
  }, [table, initialized, isLoadingRecords, dispatch]);

  const refresh = useCallback(async (
    options: FetchOptions = { limit: 20 }, 
    onError?: (error: Error) => void
  ) => {
    if (!isLoadingRecords) {
      try {
        const result = await dispatch(
          fetchTableRecords({ tableName: table, queryParams: options })
        ).unwrap();
        setNextPageToken(result.nextPageToken);
      } catch (error) {
        console.error('Failed to refresh:', error);
        onError?.(error as Error);
      }
    }
  }, [table, dispatch, isLoadingRecords]);

  // Memoize the return object to prevent unnecessary rerenders
  return useMemo(() => ({
    records,
    schema,
    isLoading: isLoadingRecords,
    schemaLoading: isLoadingSchema,
    error,
    nextPageToken,
    lastUpdated,
    refresh,
    fetchNextPage: async (onError?: (error: Error) => void) => {
      if (nextPageToken && !isLoadingRecords) {
        await refresh({ pageToken: nextPageToken, limit: 20 }, onError);
      }
    },
    addRecord: async (record: unknown, onError?: (error: Error) => void) => {
      try {
        await dispatch(createRecord({ tableName: table, record })).unwrap();
      } catch (error) {
        console.error('Failed to add record:', error);
        onError?.(error as Error);
      }
    },
    modifyRecord: async (recordId: string, updates: unknown) => {
      try {
        await dispatch(updateRecord({ tableName: table, recordId, updates })).unwrap();
      } catch (error) {
        console.error('Failed to modify record:', error);
      }
    },
    removeRecord: async (recordId: string) => {
      try {
        await dispatch(deleteRecord({ tableName: table, recordId })).unwrap();
      } catch (error) {
        console.error('Failed to remove record:', error);
      }
    },
  }), [
    records, schema, isLoadingRecords, isLoadingSchema, error,
    nextPageToken, lastUpdated, refresh, table, dispatch
  ]);
} 