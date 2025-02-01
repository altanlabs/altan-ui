// src/databases/config.ts
export interface DatabaseConfig {
  API_BASE_URL: string;
  SAMPLE_TABLES: Record<string, string>;
}

let config: DatabaseConfig | null = null;

export const setDatabaseConfig = (cfg: DatabaseConfig) => {
  config = cfg;
};

export const getDatabaseConfig = (): DatabaseConfig => {
  if (!config) {
    throw new Error("Database configuration is not set. Call setDatabaseConfig() first.");
  }
  return config;
};
