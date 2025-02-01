"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = exports.setDatabaseConfig = void 0;
var config = null;
var setDatabaseConfig = function (cfg) {
    config = cfg;
};
exports.setDatabaseConfig = setDatabaseConfig;
var getDatabaseConfig = function () {
    if (!config) {
        throw new Error("Database configuration is not set. Call setDatabaseConfig() first.");
    }
    return config;
};
exports.getDatabaseConfig = getDatabaseConfig;
