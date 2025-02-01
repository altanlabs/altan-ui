"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_redux_1 = require("react-redux");
var toolkit_1 = require("@reduxjs/toolkit");
var tablesSlice_1 = __importDefault(require("./tablesSlice"));
var store = (0, toolkit_1.configureStore)({
    reducer: {
        tables: tablesSlice_1.default,
    },
});
var DatabaseProvider = function (_a) {
    var children = _a.children;
    return (0, jsx_runtime_1.jsx)(react_redux_1.Provider, { store: store, children: children });
};
exports.DatabaseProvider = DatabaseProvider;
