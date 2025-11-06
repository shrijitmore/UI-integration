import {
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  LOGOUT,
  MY_PROFILE_ACCOUNT,
  RESET_PASS,
  SIGN_IN,
  SIGN_UP,
} from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";

export const signUp = createAsyncThunkAction(
  "auth/signUp",
  "post",
  (payload) => ({
    url: SIGN_UP,
    data: payload,
  })
);

export const signIn = createAsyncThunkAction(
  "auth/signIn",
  "post",
  (payload) => ({
    url: SIGN_IN,
    data: payload,
  })
);

export const logOut = createAsyncThunkAction(
  "auth/logOut",
  "post",
  (payload) => ({
    url: LOGOUT,
    data: payload,
  })
);

export const forgotPassword = createAsyncThunkAction(
  "auth/forgotPassword",
  "post",
  (payload) => ({
    url: FORGOT_PASSWORD,
    data: payload,
  })
);

export const resetPassword = createAsyncThunkAction(
  "auth/resetPassword",
  "post",
  ({ id, token, payload }) => ({
    url: `${RESET_PASS}${id}/${token}/`,
    data: payload,
  })
);

export const myProfileAcc = createAsyncThunkAction(
  "auth/myProfileAcc",
  "get",
  () => ({
    url: MY_PROFILE_ACCOUNT,
  })
);

export const profilePassDetailsChange = createAsyncThunkAction(
  "auth/profilePassDetailsChange",
  "post",
  (payload) => ({
    url: CHANGE_PASSWORD,
    data: payload,
  })
);

const extraReducers = (builder) => {
  builder
    .addCase(signUp.pending, (state) => {
      state.loading = true;
    })
    .addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload?.message;
    })
    .addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(signIn.pending, (state) => {
      state.loading = true;
    })
    .addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
    })
    .addCase(signIn.rejected, (state, action) => {
      state.loading = false;
    })

    .addCase(logOut.pending, (state) => {
      state.loading = true;
    })
    .addCase(logOut.fulfilled, (state, action) => {
      state.loading = false;
    })
    .addCase(logOut.rejected, (state, action) => {
      state.loading = false;
    })

    .addCase(forgotPassword.pending, (state) => {
      state.loading = true;
    })
    .addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload?.message;
    })
    .addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(resetPassword.pending, (state) => {
      state.loading = true;
    })
    .addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload?.message;
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(myProfileAcc.pending, (state) => {
      state.loading = true;
    })
    .addCase(myProfileAcc.fulfilled, (state, action) => {
      state.loading = false;
      state.profileData = action.payload.data;
      state.authChecked = true;
    })
    .addCase(myProfileAcc.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.authChecked = true;
    })

    .addCase(profilePassDetailsChange.pending, (state) => {
      state.loading = true;
    })
    .addCase(profilePassDetailsChange.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload?.message;
    })
    .addCase(profilePassDetailsChange.rejected, (state, action) => {
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

const authSlice = createGenericSlice(
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

export const { clearMessage, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
