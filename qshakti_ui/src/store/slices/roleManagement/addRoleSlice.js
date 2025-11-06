import {
  ADDROLE,
  DELETE_ROLE_DETAIL,
  EDITROLEDATABYID,
  GETROLELISTDATA,
} from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";

export const addRoleData = createAsyncThunkAction(
  "addRole/addRoleData",
  "post",
  (payload) => ({
    url: ADDROLE,
    data: payload,
  })
);
export const EditRoleData = createAsyncThunkAction(
  "addRole/EditRoleData",
  "put",
  ({ id, payload }) => ({
    url: EDITROLEDATABYID(id), // should return like `/api/roles/3/`
    data: payload,
  })
);

export const getRoleData = createAsyncThunkAction(
  "addRole/getRoleData",
  "get",
  ({ plant_id }) => ({
    url: GETROLELISTDATA,
    data: { plant_id },
  })
);

export const deleteRoleData = createAsyncThunkAction(
  "addRole/deleteRoleData",
  "delete",
  (id) => {
    return {
      url: DELETE_ROLE_DETAIL(id),
    };
  }
);

const extraReducers = (builder) => {
  builder
    .addCase(addRoleData.pending, (state) => {
      state.loading = true;
    })
    .addCase(addRoleData.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload?.message;
    })
    .addCase(addRoleData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(EditRoleData.pending, (state) => {
      state.loading = true;
    })
    .addCase(EditRoleData.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload?.message;
    })
    .addCase(EditRoleData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(getRoleData.pending, (state) => {
      state.loading = true;
    })
    .addCase(getRoleData.fulfilled, (state, action) => {
      state.data = action?.payload;
    })

    .addCase(getRoleData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteRoleData.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteRoleData.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload?.message;
    })
    .addCase(deleteRoleData.rejected, (state, action) => {
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

const addRoleSlice = createGenericSlice(
  "addRole",
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

export const { clearMessage, setAuthToken } = addRoleSlice.actions;
export default addRoleSlice.reducer;
