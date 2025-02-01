"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAltanDB = void 0;
// src/databases/axios.ts
var axios_1 = __importDefault(require("axios"));
var config_1 = require("./config");
var createAltanDB = function () {
    var API_BASE_URL = (0, config_1.getDatabaseConfig)().API_BASE_URL;
    var instance = axios_1.default.create({
        baseURL: API_BASE_URL
    });
    return instance;
};
exports.createAltanDB = createAltanDB;
