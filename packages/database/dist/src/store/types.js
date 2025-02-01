"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var toolkit_1 = require("@reduxjs/toolkit");
var tablesSlice_1 = __importDefault(require("./tablesSlice"));
// Redux Store Types
var dummyStore = (0, toolkit_1.configureStore)({
    reducer: { tables: tablesSlice_1.default },
    middleware: function (getDefaultMiddleware) {
        return getDefaultMiddleware({
            thunk: {
                extraArgument: {}
            }
        });
    }
});
