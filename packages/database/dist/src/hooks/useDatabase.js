"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDatabase = useDatabase;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var tablesSlice_1 = require("../store/tablesSlice");
var useAppDispatch_1 = require("./useAppDispatch");
function useDatabase(table) {
    var _this = this;
    var dispatch = (0, useAppDispatch_1.useAppDispatch)();
    // Resolve the table ID from table name
    var tableId = (0, react_redux_1.useSelector)(function (state) { return state.tables.tables.byName[table]; });
    var records = (0, react_redux_1.useSelector)(function (state) { var _a; return tableId ? ((_a = state.tables.records.byTableId[tableId]) === null || _a === void 0 ? void 0 : _a.items) || [] : []; });
    var schema = (0, react_redux_1.useSelector)(function (state) {
        return tableId ? state.tables.schemas.byTableId[tableId] || null : null;
    });
    var isLoading = (0, react_redux_1.useSelector)(function (state) { return state.tables.loading.records === "loading"; });
    var schemaLoading = (0, react_redux_1.useSelector)(function (state) { return state.tables.loading.schemas === "loading"; });
    var initialized = (0, react_redux_1.useSelector)(function (state) {
        return tableId ? state.tables.initialized[tableId] : false;
    });
    var _a = (0, react_1.useState)(null), nextPageToken = _a[0], setNextPageToken = _a[1];
    // Internal method to fetch data using Redux thunks.
    var fetchData = (0, react_1.useCallback)(function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (options) {
            var result, error_1;
            if (options === void 0) { options = { limit: 20 }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, dispatch((0, tablesSlice_1.fetchTableRecords)({ tableName: table, queryParams: options })).unwrap()];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, dispatch((0, tablesSlice_1.fetchTableSchema)({ tableName: table }))];
                    case 2:
                        _a.sent();
                        setNextPageToken(result.nextPageToken);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error fetching data", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, [table, dispatch]);
    // If the data for this table isn't loaded yet, fetch automatically.
    (0, react_1.useEffect)(function () {
        if (tableId && !initialized) {
            fetchData();
        }
    }, [tableId, initialized, fetchData]);
    // Provide a refresh method to re-fetch data manually.
    var refresh = (0, react_1.useCallback)(function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (options) {
            var error_2;
            if (options === void 0) { options = { limit: 20 }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetchData(options)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error refreshing data", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, [fetchData]);
    var fetchNextPage = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!nextPageToken) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchData({ pageToken: nextPageToken, limit: 20 })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [nextPageToken, fetchData]);
    // CRUD methods to operate on records.
    var addRecord = (0, react_1.useCallback)(function (record) { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dispatch((0, tablesSlice_1.createRecord)({ tableName: table, record: record }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error creating record", error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [table, dispatch]);
    var modifyRecord = (0, react_1.useCallback)(function (recordId, updates) { return __awaiter(_this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dispatch((0, tablesSlice_1.updateRecord)({ tableName: table, recordId: recordId, updates: updates }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error updating record", error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [table, dispatch]);
    var removeRecord = (0, react_1.useCallback)(function (recordId) { return __awaiter(_this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dispatch((0, tablesSlice_1.deleteRecord)({ tableName: table, recordId: recordId }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error deleting record", error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [table, dispatch]);
    return {
        records: records,
        schema: schema,
        isLoading: isLoading,
        schemaLoading: schemaLoading,
        nextPageToken: nextPageToken,
        refresh: refresh, // simple refresh method
        fetchNextPage: fetchNextPage, // for pagination
        addRecord: addRecord,
        modifyRecord: modifyRecord,
        removeRecord: removeRecord,
    };
}
