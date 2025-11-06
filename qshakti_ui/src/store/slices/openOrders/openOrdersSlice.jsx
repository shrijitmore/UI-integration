import {
  GET_OPERATION_DETAILS,
  IN_PROCESS_INSPECTION_LIST,
  ORDER_DETAILS,
  PRODUCTION_PLANNER_LIST,
  PRODUCTION_PLANNER_UPLOAD,
  PRODUCTIONACTIONSTARTSTOP,
  RM_PLANNER_LIST,
  RM_PLANNER_UPLOAD,
} from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";

export const uploadProductionPlannerList = createAsyncThunkAction(
  "list/uploadProductionPlannerList",
  "get",
  ({ page = 1, pageSize = 10, all = false } = {}) => ({
    url: `${PRODUCTION_PLANNER_LIST}?page=${page}&page_size=${pageSize}&all=${all}`,
  })
);
export const productionOrdersList = createAsyncThunkAction(
  "list/productionOrdersList",
  "get",
  ({ page = 1, pageSize = 10, all = false } = {}) => ({
    url: `${PRODUCTION_PLANNER_LIST}?page=${page}&page_size=${pageSize}&all=${all}`,
  })
);
export const ORDER_DETAILSlIST = createAsyncThunkAction(
  "list/ORDER_DETAILSlIST",
  "get",
  () => ({
    url: ORDER_DETAILS,
  })
);
export const OPERATION_DETAILS = createAsyncThunkAction(
  "list/OPERATION_DETAILS",
  "get",
  ({ order_id }) => ({
    url: GET_OPERATION_DETAILS(order_id),
  })
);

export const uploadMachineMaster = createAsyncThunkAction(
  "upload/uploadMachineMaster",
  "post",
  ({ data }) => ({
    url: PRODUCTION_PLANNER_UPLOAD,
    data,
  })
);

export const uploadRmPlanner = createAsyncThunkAction(
  "upload/uploadRmPlanner",
  "post",
  ({ data }) => ({
    url: RM_PLANNER_UPLOAD,
    data,
  })
);

export const uploadParameterMasterList = createAsyncThunkAction(
  "upload/uploadParameterMasterList",
  "get",
  ({ page = 1, pageSize = 10, all = false } = {}) => ({
    url: `${RM_PLANNER_LIST}?page=${page}&page_size=${pageSize}&all=${all}`,
  })
);

export const productionActionOrders = createAsyncThunkAction(
  "startstop/productionActionOrders",
  "post",
  ({ data, id, lot_number }) => ({
    url: PRODUCTIONACTIONSTARTSTOP(id, lot_number),
    data,
  })
);

const extraReducers = (builder) => {
  const handleAsyncState = (action) => {
    builder
      .addCase(action.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(action.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message;
      })
      .addCase(action.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  };

  handleAsyncState(uploadProductionPlannerList);
  handleAsyncState(productionOrdersList);
  handleAsyncState(uploadRmPlanner);
  handleAsyncState(uploadMachineMaster);
  handleAsyncState(uploadParameterMasterList);
  handleAsyncState(productionActionOrders);
  handleAsyncState(ORDER_DETAILSlIST);
  handleAsyncState(OPERATION_DETAILS);
};
const reducers = {
  clearMessage: (state) => {
    state.success = null;
    state.error = null;
  },
  setAuthToken: (state, action) => {
    state.accessToken = action.payload;
  },
};

const openOrdersSlice = createGenericSlice(
  "openOrders",
  {
    loading: false,
    error: null,
    success: null,
  },
  reducers,
  extraReducers
);

export const { clearMessage, setAuthToken } = openOrdersSlice.actions;
export default openOrdersSlice.reducer;
