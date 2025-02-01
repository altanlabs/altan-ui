export interface DatabaseConfig {
    API_BASE_URL: string;
    SAMPLE_TABLES: Record<string, string>;
}
export declare const setDatabaseConfig: (cfg: DatabaseConfig) => void;
export declare const getDatabaseConfig: () => DatabaseConfig;
