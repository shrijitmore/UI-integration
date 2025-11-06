import { ACTIVITY_LOG } from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";

export const getACtivityLog = createAsyncThunkAction(
  "list/activityLog",
  "get",
  () => ({
    url: ACTIVITY_LOG,
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

  handleAsyncState(getACtivityLog);
};
const reducers = {
  clearMessage: (state) => {
    state.success = null;
    state.error = null;
  },
};

const activityLog = createGenericSlice(
  "activityLog",
  {
    loading: false,
    error: null,
    success: null,
  },
  reducers,
  extraReducers
);

export const { clearMessage } = activityLog.actions;
export default activityLog.reducer;
