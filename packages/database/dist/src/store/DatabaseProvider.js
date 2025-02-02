"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// src/databases/DatabaseProvider.tsx
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var toolkit_1 = require("@reduxjs/toolkit");
var tablesSlice_1 = __importDefault(require("./tablesSlice"));
var config_1 = require("../config");
var tablesSlice_2 = require("./tablesSlice");
var axios_1 = require("../api/axios");
var DatabaseProvider = function (_a) {
    var config = _a.config, children = _a.children, _b = _a.customMiddleware, customMiddleware = _b === void 0 ? [] : _b;
    (0, config_1.validateDatabaseConfig)(config);
    // Create the Redux store once using useMemo.
    var store = (0, react_1.useMemo)(function () {
        var s = (0, toolkit_1.configureStore)({
            reducer: {
                tables: tablesSlice_1.default,
            },
            middleware: function (getDefaultMiddleware) {
                return getDefaultMiddleware({
                    thunk: {
                        // Create the axios instance once using the API_BASE_URL from the provider config.
                        extraArgument: { api: (0, axios_1.createAltanDB)(config.API_BASE_URL) },
                    },
                }).concat(customMiddleware);
            },
        });
        // Dispatch the initialization with the given config.
        s.dispatch((0, tablesSlice_2.initializeTables)(config));
        return s;
    }, [config, customMiddleware]);
    return (0, jsx_runtime_1.jsx)(react_redux_1.Provider, { store: store, children: children });
};
exports.DatabaseProvider = DatabaseProvider;
