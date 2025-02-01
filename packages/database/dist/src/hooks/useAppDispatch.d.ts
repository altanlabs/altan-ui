export declare const useAppDispatch: () => import("redux-thunk").ThunkDispatch<{
    tables: import("../store/types").TableState;
}, {
    api: import("axios").AxiosInstance;
}, import("redux").UnknownAction> & import("redux").Dispatch<import("redux").UnknownAction>;
