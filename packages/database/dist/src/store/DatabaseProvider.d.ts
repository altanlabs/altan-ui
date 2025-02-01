import { ReactNode } from "react";
import type { DatabaseConfig } from "../config";
interface DatabaseProviderProps {
    config: DatabaseConfig;
    children: ReactNode;
}
export declare const DatabaseProvider: ({ config, children, }: DatabaseProviderProps) => JSX.Element;
export {};
