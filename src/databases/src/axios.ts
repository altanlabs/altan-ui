// src/databases/axios.ts
import axios from "axios";
import { getDatabaseConfig } from "./config";

export const createAltanDB = (): ReturnType<typeof axios.create> => {
  const { API_BASE_URL } = getDatabaseConfig();
  const instance = axios.create({
    baseURL: API_BASE_URL
  });
  return instance;
};
