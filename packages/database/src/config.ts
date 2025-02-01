// src/databases/config.ts

// Only export the type definition
export interface DatabaseConfig {
  API_BASE_URL: string;
  SAMPLE_TABLES: Record<string, string>;
}

// Optionally, you can remove the mutable config-related functions entirely.
