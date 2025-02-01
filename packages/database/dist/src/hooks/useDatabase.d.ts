export interface FetchOptions {
    limit?: number;
    filters?: Array<{
        field: string;
        operator: string;
        value: unknown;
    }>;
    sort?: Array<{
        field: string;
        direction: "asc" | "desc";
    }>;
    pageToken?: string;
    fields?: string[];
    amount?: "all" | "first" | "one";
}
export declare function useDatabase(table: string): {
    records: import("../store/tablesSlice").TableRecordItem[];
    schema: {} | null;
    isLoading: boolean;
    schemaLoading: boolean;
    nextPageToken: string | null;
    refresh: (options?: FetchOptions) => Promise<void>;
    fetchNextPage: () => Promise<void>;
    addRecord: (record: unknown) => Promise<void>;
    modifyRecord: (recordId: string, updates: unknown) => Promise<void>;
    removeRecord: (recordId: string) => Promise<void>;
};
