import { PERMISSION_LIST_POST } from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";

export const getPermissionList = createAsyncThunkAction(
  "list/roleList",
  "get",
  ({ role, plant }) => ({
    url: PERMISSION_LIST_POST,
    data: { role, plant },
  })
);

export const postPermission = createAsyncThunkAction(
  "list/postPermission",
  "post",
  (payload) => ({
    url: PERMISSION_LIST_POST,
    data: payload,
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

  handleAsyncState(getPermissionList);
  handleAsyncState(postPermission);
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

const roleBaseAuth = createGenericSlice(
  "roleBaseAuth",
  {
    loading: false,
    error: null,
    success: null,
  },
  reducers,
  extraReducers
);

export const { clearMessage, setAuthToken } = roleBaseAuth.actions;
export default roleBaseAuth.reducer;
