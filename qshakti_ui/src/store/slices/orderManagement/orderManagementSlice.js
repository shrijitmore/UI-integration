import {
  GET_OREDRMANAGEMENT_DROPDOWNS,
  POST_PUT_GET_DELETE_ORDER_MANAGEMENT,
} from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";

export const getOrderManagementDropdown = createAsyncThunkAction(
  "list/orderManagementDropdowns",
  "get",
  ({ section, po_number, machine_type }) => ({
    url: GET_OREDRMANAGEMENT_DROPDOWNS,
    data: { section, po_number, machine_type },
  })
);

export const getOrderManagemnt = createAsyncThunkAction(
  "list/getOrderManagemnt",
  "get",
  () => ({
    url: POST_PUT_GET_DELETE_ORDER_MANAGEMENT,
  })
);

export const postOrderManagemnt = createAsyncThunkAction(
  "list/postOrderManagemnt",
  "post",
  ({ payload }) => ({
    url: POST_PUT_GET_DELETE_ORDER_MANAGEMENT,
    data: payload,
  })
);

export const UpdateOrderManagemnet = createAsyncThunkAction(
  "list/UpdateOrderManagemnet",
  "put",
  ({ id, payload }) => ({
    url: `${POST_PUT_GET_DELETE_ORDER_MANAGEMENT}${id}/`,
    data: payload,
  })
);

export const DeleteOrderManagemnt = createAsyncThunkAction(
  "list/DeleteOrderManagemnt",
  "delete",
  (id) => ({
    url: `${POST_PUT_GET_DELETE_ORDER_MANAGEMENT}${id}/`,
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

  handleAsyncState(getOrderManagementDropdown);
  handleAsyncState(getOrderManagemnt);
  handleAsyncState(postOrderManagemnt);
  handleAsyncState(UpdateOrderManagemnet);
  handleAsyncState(DeleteOrderManagemnt);
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

const orderManagement = createGenericSlice(
  "orderManagement",
  {
    loading: false,
    error: null,
    success: null,
  },
  reducers,
  extraReducers
);

export const { clearMessage } = orderManagement.actions;
export default orderManagement.reducer;
