# @altanlabs/database

A React library for easy database integration with powerful querying capabilities.

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Data Loading Behavior](#data-loading-behavior)
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

## Installation

```bash
npm install @altanlabs/database
```

## Quick Start

1. **Set up the Provider**

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
```

2. **Use the Database Hook**

```tsx
import { useDatabase } from "@altanlabs/database";

function UsersList() {
  const { 
    records,          // Current records
    schema,          // Table schema
    isLoading,       // Loading state
    refresh,         // Manual refresh with options
    fetchNextPage,   // Load next page
    addRecord,       // Create new record
    modifyRecord,    // Update existing record
    removeRecord     // Delete record
  } = useDatabase("users");

  // Optional: Refresh with specific options
  useEffect(() => {
    refresh({ 
      limit: 20,
      sort: [{ field: "created_time", direction: "desc" }]
    });
  }, [refresh]); // Don't include isLoading in dependencies

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {records.map(record => (
        <div key={record.id}>{record.fields.name}</div>
      ))}
    </div>
  );
}
```

## Data Loading Behavior

The hook manages data in two ways:

1. **Automatic Initial Load**
- Happens once when a table is first accessed
- No manual intervention needed
- Caches the data in Redux store

2. **Manual Refresh**
- Used for applying new filters/sorting
- Forces a fresh fetch regardless of cache
- Useful for updating stale data

```tsx
// Example: Table Switching
function TableViewer() {
  const [selectedTable, setSelectedTable] = useState("users");
  const { records, isLoading } = useDatabase(selectedTable);

  // No refresh needed - data loads automatically
  return (
    <div>
      <select onChange={(e) => setSelectedTable(e.target.value)}>
        <option value="users">Users</option>
        <option value="posts">Posts</option>
      </select>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>{records.map(record => (
          <div key={record.id}>{record.fields.name}</div>
        ))}</div>
      )}
    </div>
  );
}
```

## Features

### Automatic Data Loading
Data is automatically loaded and cached when a table is first accessed:
```tsx
const { records, isLoading } = useDatabase("users");
// Data loads automatically, no manual fetch needed
```

### Manual Refresh
Use `refresh()` to reload data with specific options:

```tsx
const { refresh } = useDatabase("users");

// Basic refresh
refresh();

// Refresh with options
refresh({
  limit: 20,
  sort: [{ field: "created_time", direction: "desc" }],
  filters: [{ field: "status", operator: "eq", value: "active" }]
});
```

### Filtering
Apply filters using various operators:

```tsx
refresh({
  filters: [
    { field: "status", operator: "eq", value: "active" },
    { field: "age", operator: "gte", value: 18 },
    { field: "name", operator: "contains", value: "john" }
  ]
});
```

Available operators:
- `eq` - Equals
- `neq` - Not equals
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal
- `contains` - Case-insensitive text search
- `startswith` - Case-insensitive prefix search
- `endswith` - Case-insensitive suffix search

### Sorting
Sort by multiple fields:

```tsx
refresh({
  sort: [
    { field: "created_time", direction: "desc" },
    { field: "name", direction: "asc" }
  ]
});
```

### Pagination
Handle pagination using cursor-based system:

```tsx
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
```

### CRUD Operations
Create, update, and delete records:

```tsx
function UserManager() {
  const { addRecord, modifyRecord, removeRecord } = useDatabase("users");

  // Create
  const handleCreate = async () => {
    await addRecord({
      name: "John Doe",
      email: "john@example.com"
    });
  };

  // Update
  const handleUpdate = async (id: string) => {
    await modifyRecord(id, {
      status: "inactive"
    });
  };

  // Delete
  const handleDelete = async (id: string) => {
    await removeRecord(id);
  };

  return <div>{/* Your UI */}</div>;
}
```

### Field Selection
Select specific fields and control the amount of records:

```tsx
refresh({
  fields: ["id", "name", "email"],  // Only fetch these fields
  amount: "all"                     // "all" | "first" | "one"
});
```

## API Reference

### useDatabase Hook
```typescript
const {
  // Data
  records: Array<{ id: string; fields: Record<string, any> }>,
  schema: any,
  
  // States
  isLoading: boolean,
  schemaLoading: boolean,
  nextPageToken: string | null,
  
  // Methods
  refresh: (options?: FetchOptions) => Promise<void>,
  fetchNextPage: () => Promise<void>,
  addRecord: (record: any) => Promise<void>,
  modifyRecord: (id: string, updates: any) => Promise<void>,
  removeRecord: (id: string) => Promise<void>
} = useDatabase(tableName: string);
```

### FetchOptions Interface
```typescript
interface FetchOptions {
  limit?: number;                   // Records per page
  filters?: Array<{                 // Filter conditions
    field: string;
    operator: string;
    value: unknown;
  }>;
  sort?: Array<{                    // Sort conditions
    field: string;
    direction: "asc" | "desc";
  }>;
  pageToken?: string;              // For pagination
  fields?: string[];               // Fields to select
  amount?: "all" | "first" | "one"; // Amount of records to fetch
}
```

## Best Practices

1. **Automatic Loading**
- Let the hook handle initial data loading
- Don't manually trigger refresh unless needed

2. **Refresh Usage**
- Use refresh for applying new filters/sorting
- Don't include isLoading in useEffect dependencies
```tsx
// ✅ Correct
useEffect(() => {
  refresh(options);
}, [refresh]);

// ❌ Incorrect - will cause infinite loops
useEffect(() => {
  if (!isLoading) {
    refresh(options);
  }
}, [refresh, isLoading]);
```

3. **Error Handling**
```tsx
try {
  await addRecord(newRecord);
} catch (error) {
  console.error("Failed to add record:", error);
}
```

## Examples

### Complete Table Manager
```tsx
function TableManager() {
  const { 
    records, 
    isLoading, 
    refresh,
    addRecord,
    modifyRecord,
    removeRecord 
  } = useDatabase("users");

  // Apply filters and sorting
  const handleFilter = () => {
    refresh({
      filters: [{ field: "status", operator: "eq", value: "active" }],
      sort: [{ field: "created_at", direction: "desc" }],
      limit: 20
    });
  };

  // CRUD operations
  const handleAdd = () => addRecord({ name: "New User" });
  const handleUpdate = (id: string) => modifyRecord(id, { status: "updated" });
  const handleDelete = (id: string) => removeRecord(id);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleFilter}>Filter Active Users</button>
      <button onClick={handleAdd}>Add User</button>
      {records.map(record => (
        <div key={record.id}>
          {record.fields.name}
          <button onClick={() => handleUpdate(record.id)}>Update</button>
          <button onClick={() => handleDelete(record.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Infinite Refresh Loops**
- Cause: Including isLoading in useEffect dependencies
- Solution: Remove isLoading from dependency array

2. **Missing Initial Data**
- Cause: Manually managing initial load
- Solution: Let the hook handle initial loading automatically

3. **Stale Data**
- Cause: Relying only on automatic loading
- Solution: Use refresh when data needs updating

## License

MIT License - see LICENSE for details