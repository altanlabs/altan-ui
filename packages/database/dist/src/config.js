"use strict";
// src/databases/config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDatabaseConfig = validateDatabaseConfig;
/**
 * Ensures each value in SAMPLE_TABLES is a valid UUID.
 */
function isValidUUID(value) {
    // This regex checks for a UUID of the form xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
/**
 * Validates that SAMPLE_TABLES only contains valid UUID table names.
 */
function validateDatabaseConfig(config) {
    for (var _i = 0, _a = Object.values(config.SAMPLE_TABLES); _i < _a.length; _i++) {
        var entry = _a[_i];
        if (!isValidUUID(entry)) {
            throw new Error("Table name \"".concat(entry, "\" is not a valid UUID."));
        }
    }
}
// Optionally, you can remove the mutable config-related functions entirely.
