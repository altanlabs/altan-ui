# @altanlabs/database

A robust TypeScript-based database integration package for the Altan ecosystem. This package provides flexible and powerful utilities for configuring and managing database connections, interacting with backend APIs via axios, integrating Redux state management, and more. It is designed to work seamlessly in React applications.

---

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [DatabaseProvider](#databaseprovider)
  - [Configuration Utilities](#configuration-utilities)
  - [Axios Instance Creation](#axios-instance-creation)
  - [Redux Tables Slice](#redux-tables-slice)
- [Advanced Topics](#advanced-topics)
  - [Dashboard Example](#dashboard-example)
  - [Redux Store Structure](#redux-store-structure)
  - [Available Tables](#available-tables)
  - [Database & Table Setup](#database--table-setup)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Installation

Install the package via npm:

```bash
npm install @altanlabs/database
```

For projects using yarn:

```bash
yarn add @altanlabs/database
```

---

## Configuration

Before using the package, set up your database configuration using the provided utilities. In your application entry point, initialize the configuration:

```typescript
import { setDatabaseConfig } from "@altanlabs/database";

setDatabaseConfig({
  API_BASE_URL: "https://api.example.com",
  SAMPLE_TABLES: {
    // Pre-configured tables
    users: "1b52a5c4-ce93-4790-aa2a-d186daa2068d",
    posts: "d8812981-b246-4de4-8ef9-40fa8a7dbbda"
  }
});
```

---

## Usage

### DatabaseProvider

Use the `DatabaseProvider` component to wrap your application and provide Redux state for managing database operations.

```tsx
import React from "react";
import { DatabaseProvider } from "@altanlabs/database";

const App = () => (
  <DatabaseProvider>
    {/* Your application components */}
  </DatabaseProvider>
);

export default App;
```

### Configuration Utilities

Access and modify your database configuration using the following functions:

- `setDatabaseConfig(config: DatabaseConfig)`: Set the configuration for your project.
- `getDatabaseConfig()`: Retrieve the currently set database configuration.

### Axios Instance Creation

Create an axios instance with a base URL derived from your database configuration:

```typescript
import { createAltanDB } from "@altanlabs/database";

const apiClient = createAltanDB();
```

### Redux Tables Slice

The package exposes several Redux actions and thunks to interact with table records. Here are some example operations:

#### Example: Fetching Table Records

```typescript
import { useDispatch } from "react-redux";
import { fetchTableRecords } from "@altanlabs/database";

const dispatch = useDispatch();

// Fetch records from the "users" table with a limit of 20 records
dispatch(fetchTableRecords({
  tableName: "users",
  queryParams: { limit: 20 }
}));
```

#### Example: Creating a Record

```typescript
import { createRecord } from "@altanlabs/database";

dispatch(createRecord({
  tableName: "users",
  record: {
    username: "john_doe",
    email: "john@example.com"
  }
}));
```

---

## Advanced Topics

### Dashboard Example

The package can be effectively used as part of a larger dashboard application that includes:
- **Multiple chart types using Recharts**
- **Card-based layout**
- **Activity feeds**
- **Quick action buttons**

Combine these UI elements with the data management provided by the package to create powerful and responsive dashboards.

### Redux Store Structure

The Redux store integrated into this package maintains the following structure:

```javascript
const initialState = {
  tables: {
    byId: {},
    byName: {},
    allIds: [],
  },
  schemas: {
    byTableId: {},
  },
  records: {
    byTableId: {},
  },
  loading: {
    tables: 'idle',
    records: 'idle',
    schemas: 'idle',
  },
  error: null,
};
```

### Available Tables

Pre-configured tables can be defined via the `SAMPLE_TABLES` configuration object:

```javascript
const SAMPLE_TABLES = {
  users: '1b52a5c4-ce93-4790-aa2a-d186daa2068d',
  posts: 'd8812981-b246-4de4-8ef9-40fa8a7dbbda',
};
```

### Database & Table Setup

When creating new tables, adhere to a consistent schema structure. Below is an example table schema for a "Users" table:

```javascript
{
  "table": {
    "base_id": "a8a0f7dd-d854-4245-9c42-d73edb4ae309",
    "name": "Users",
    "version": 1,
    "order": 1.0,
    "fields": {
      "items": [
        {
          "name": "username",
          "type": "singleLineText",
          "cell_value_type": "string",
          "not_null": false,
          "unique": true,
          "order": 1.0
        },
        {
          "name": "email",
          "type": "email",
          "cell_value_type": "string",
          "not_null": true,
          "unique": true,
          "order": 2.0
        },
        {
          "name": "signup_date",
          "type": "date",
          "cell_value_type": "date",
          "not_null": false,
          "options": {
            "date_options": {
              "time_zone": "GMT/UTC",
              "date_format": "ISO"
            }
          },
          "order": 3.0
        }
      ]
    }
  }
}
```

For updating or inserting records, follow the structure:

```javascript
dispatch(createRecord({
  tableName: "users",
  record: {
    username: "john_doe",
    email: "john@example.com",
    signup_date: "2024-01-22"
  }
}));
```

---

## API Endpoints

The database components interact with the following API endpoints:

- `GET /table/{table_id}`  
  Retrieve the table schema.

- `POST /table/{table_id}/record/query`  
  Query table records using filters, sorting, and pagination.

- `POST /table/{table_id}/record`  
  Create a new record in the specified table.

- `PATCH /table/{table_id}/record/{record_id}`  
  Update an existing record.

- `DELETE /table/{table_id}/record/{record_id}`  
  Delete a record from the table.

Ensure your backend API conforms to these endpoints and data structures for smooth integration.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


