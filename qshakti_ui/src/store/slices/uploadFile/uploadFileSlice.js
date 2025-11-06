import { UPLOADFILE } from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";

export const uploadFile = createAsyncThunkAction(
  "auth/uploadFile",
  "post",
  ({ UPLOADFILE, data }) => ({
    url: `${UPLOADFILE}`,
    data: data,
  })
);

const extraReducers = (builder) => {
  builder
    .addCase(uploadFile.pending, (state) => {
      state.loading = true;
    })
    .addCase(uploadFile.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload?.message;
    })
    .addCase(uploadFile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
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

const uploadFileSlice = createGenericSlice(
  "auth",
  {
    loading: false,
    error: null,
    success: null,
    accessToken: null,
    vendorId: null,
    refreshToken: null,
    role: "",
    profileData: [],
  },
  reducers,
  extraReducers
);

export const { clearMessage, setAuthToken } = uploadFileSlice.actions;
export default uploadFileSlice.reducer;
