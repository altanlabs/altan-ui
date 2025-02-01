# @altanlabs/database

@altanlabs/database is a lightweight React library for seamless database integration. It offers powerful querying capabilities including filtering, sorting, pagination, and CRUD operations—all powered by a simple React hook interface and Redux under the hood.

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Setting Up the Provider](#setting-up-the-provider)
  - [Using the Database Hook](#using-the-database-hook)
- [Features](#features)
  - [Automatic Data Loading](#automatic-data-loading)
  - [Manual Refresh](#manual-refresh)
  - [Filtering](#filtering)
  - [Sorting](#sorting)
  - [Pagination](#pagination)
  - [CRUD Operations](#crud-operations)
  - [Field Selection](#field-selection)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Installation

Install via npm:

```bash
npm install @altanlabs/database
```

## Quick Start

### Setting Up the Provider

Wrap your application with the `DatabaseProvider`, passing the configuration including the API base URL and your sample table mappings.

```tsx
// App.tsx
import { DatabaseProvider } from "@altanlabs/database";

const config = {
  API_BASE_URL: "https://api.example.com",
  SAMPLE_TABLES: {
    users: "1b52a5c4-ce93-4790-aa2a-d186daa2068d",
    posts: "d8812981-b246-4de4-8ef9-40fa8a7dbbda"
  }
};

function App() {
  return (
    <DatabaseProvider config={config}>
      <YourApp />
    </DatabaseProvider>
  );
}

export default App;
```

### Using the Database Hook

Access your table data easily with the `useDatabase` hook. Below is an example of a simple users list:

```tsx
// UsersList.tsx
import { useDatabase } from "@altanlabs/database";
import { useEffect } from "react";

function UsersList() {
  const { 
    records, 
    schema, 
    isLoading, 
    refresh 
  } = useDatabase("users");

  useEffect(() => {
    // Fetch initial data with sort and limit options
    refresh({ 
      limit: 20,
      sort: [{ field: "created_time", direction: "desc" }]
    });
  }, [refresh]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {records.map(record => (
        <div key={record.id}>{record.fields.name}</div>
      ))}
    </div>
  );
}

export default UsersList;
```

## Features

### Automatic Data Loading
Data is automatically fetched and cached when a table is first accessed. Accessing the hook triggers initial schema and records loading without extra configuration:

```tsx
const { records, isLoading } = useDatabase("users");
```

### Manual Refresh
Force a fresh fetch of records with custom options—great for applying filters, sorting, or refreshing stale data.

```tsx
refresh({
  limit: 20,
  sort: [{ field: "created_time", direction: "desc" }],
  filters: [{ field: "status", operator: "eq", value: "active" }]
});
```

### Filtering
Apply various filter operators to narrow down your results. Supported operators include `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`, `startswith`, and `endswith`.

```tsx
refresh({
  filters: [
    { field: "status", operator: "eq", value: "active" },
    { field: "age", operator: "gte", value: 18 }
  ]
});
```

### Sorting
Sort your records by one or multiple fields.

```tsx
refresh({
  sort: [
    { field: "created_time", direction: "desc" },
    { field: "name", direction: "asc" }
  ]
});
```

### Pagination
Supports cursor-based pagination. Use the `fetchNextPage` method to seamlessly load additional records.

```tsx
// PaginatedList.tsx
function PaginatedList() {
  const { records, nextPageToken, fetchNextPage } = useDatabase("users");

  return (
    <div>
      {records.map(record => (
        <div key={record.id}>{record.fields.name}</div>
      ))}
      
      {nextPageToken && (
        <button onClick={fetchNextPage}>Load More</button>
      )}
    </div>
  );
}

export default PaginatedList;
```

### CRUD Operations
Perform individual or bulk create, update, and delete operations:

```tsx
// UserManager.tsx
function UserManager() {
  const { 
    addRecord, 
    modifyRecord, 
    removeRecord,
    addRecords,    // Bulk create
    removeRecords  // Bulk delete
  } = useDatabase("users");

  // Single record operations
  const handleCreate = async () => {
    await addRecord({ name: "John Doe", email: "john@example.com" });
  };

  const handleUpdate = async (id: string) => {
    await modifyRecord(id, { status: "inactive" });
  };

  const handleDelete = async (id: string) => {
    await removeRecord(id);
  };

  // Bulk operations
  const handleBulkCreate = async () => {
    await addRecords([
      { name: "User 1", email: "user1@example.com" },
      { name: "User 2", email: "user2@example.com" }
    ]);
  };

  const handleBulkDelete = async () => {
    await removeRecords(["id1", "id2", "id3"]);
  };

  return <div>{/* Your UI components here */}</div>;
}

export default UserManager;
```

### Field Selection
Fetch only the specific fields you need by providing an array of field names along with the fetch options.

```tsx
refresh({
  fields: ["id", "name", "email"],
  amount: "all" // Options: "all" | "first" | "one"
});
```

## API Reference

### Field Types
The library defines a comprehensive set of field types. Example:

```typescript
enum FieldType {
  SingleLineText = "singleLineText",
  MultiLineText = "multiLineText",
  Select = "select",
  LongText = "longText",
  Number = "number",
  SingleSelect = "singleSelect",
  MultiSelect = "multiSelect",
  Date = "date",
  DateTime = "dateTime",
  Checkbox = "checkbox",
  User = "user",
  Attachment = "attachment",
  Reference = "reference",
  Email = "email",
  Phone = "phone",
  URL = "url",
  Duration = "duration",
  Rating = "rating",
  Formula = "formula",
  Rollup = "rollup",
  Count = "count",
  Lookup = "lookup",
  Currency = "currency",
  Percent = "percent",
  ForeignKey = "foreignKey",
  JSON = "json",
  Trigger = "trigger"
}
```

### Field Formatting Helpers
Use the helpers to format field values appropriately.

```typescript
import { fieldHelpers } from "@altanlabs/database";

fieldHelpers.formatFieldValue(value, field);
fieldHelpers.formatDateValue(date, includeTime);
fieldHelpers.formatBooleanValue(value);
fieldHelpers.formatNumberValue(value, field);
fieldHelpers.formatCurrencyValue(value, field);
fieldHelpers.formatPercentValue(value, field);
fieldHelpers.formatDurationValue(value);
fieldHelpers.formatMultiSelectValue(value);
fieldHelpers.formatJSONValue(value);
```

### useDatabase Hook
The hook returns an object with data, state flags, and operations:

```typescript
const {
  // Data
  records,          // Array of records
  schema,           // Table schema or null

  // Loading States
  isLoading,        // Records are loading
  schemaLoading,    // Schema is loading

  // Error Information
  error,

  // Pagination
  nextPageToken,
  lastUpdated,

  // Operations
  refresh,          // Refresh records with options
  fetchNextPage,    // Load next page of records
  addRecord,        // Create a new record
  modifyRecord,     // Update an existing record
  removeRecord,     // Delete a record
  addRecords,       // Bulk create records
  removeRecords     // Bulk delete records
} = useDatabase("tableName");
```

## Best Practices

- **Automatic Loading:** Allow the hook to manage initial data loading automatically.
- **Refresh Usage:** Use the `refresh` method to apply new filters or sorting. Avoid including loading flags like `isLoading` in `useEffect` dependencies to prevent infinite loops.
- **Error Handling:** Wrap asynchronous operations in try/catch blocks and use provided error callbacks where necessary.

Example:

```tsx
useEffect(() => {
  refresh({ limit: 20 });
}, [refresh]);
```

## Troubleshooting

### Common Issues
1. **Infinite Refresh Loops:** Ensure that your dependency arrays in `useEffect` do not include state flags like `isLoading`.
2. **Stale Data:** Trigger a manual refresh to update cached data.
3. **Missing Initial Data:** Rely on the automatic data fetch rather than manually trying to load data.

## Examples

For complete examples, please refer to the `examples` directory in this repository.

### Complete Table Manager Example
```tsx
function TableManager() {
  const { 
    records,
    isLoading,
    refresh,
    addRecord,
    modifyRecord,
    removeRecord,
    addRecords,
    removeRecords
  } = useDatabase("users");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => refresh({ 
        filters: [{ field: "status", operator: "eq", value: "active" }], 
        sort: [{ field: "created_at", direction: "desc" }],
        limit: 20 
      })}>
        Filter Active Users
      </button>
      <button onClick={() => addRecord({ name: "New User" })}>
        Add User
      </button>
      <div>
        {records.map(record => (
          <div key={record.id}>
            {record.fields.name}
            <button onClick={() => modifyRecord(record.id, { status: "updated" })}>
              Update
            </button>
            <button onClick={() => removeRecord(record.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Field Formatting Example
```tsx
import { fieldHelpers } from "@altanlabs/database";

function FormattedValue({ value, field }) {
  const formattedValue = fieldHelpers.formatFieldValue(value, field);
  return <span>{formattedValue}</span>;
}
```

## License

MIT License - see [LICENSE](./LICENSE) for details.