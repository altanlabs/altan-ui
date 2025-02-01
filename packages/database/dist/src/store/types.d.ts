import type { AxiosInstance } from "axios";
declare const dummyStore: import("@reduxjs/toolkit").EnhancedStore<{
    tables: import("./tablesSlice").TableState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        tables: import("./tablesSlice").TableState;
    }, {
        api: AxiosInstance;
    }, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof dummyStore.getState>;
export type AppDispatch = typeof dummyStore.dispatch;
export {};
