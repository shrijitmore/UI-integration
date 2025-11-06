import { USER_MANAGEMENT_TABLE_DETAIL } from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";
import { DROPDOWN_ENDPOINTS_USER } from "../../../utils/endpoints";

// ============ API Actions ============

export const fetchDataByUrl = createAsyncThunkAction(
  "vendor/fetchDataByUrl",
  "get",
  ({ id, url }) => ({
    url: url,
    data: { all: true },
  })
);
export const getAdminUserRoles = createAsyncThunkAction(
  "userManagement/getAdminUserRoles",
  "get",
  () => ({
    url: DROPDOWN_ENDPOINTS_USER.ROLES,
  })
);

export const getPlantsDropdown = createAsyncThunkAction(
  "userManagement/getPlantsDropdown",
  "get",
  () => ({
    url: DROPDOWN_ENDPOINTS_USER.PLANTS,
  })
);

export const getSectionsDropdown = createAsyncThunkAction(
  "userManagement/getSectionsDropdown",
  "get",
  (plant_id) => ({
    url: DROPDOWN_ENDPOINTS_USER.SECTIONS,
    data: { plant_id },
  })
);

// export const getOperationsDropdown = createAsyncThunkAction(
//   "userManagement/getOperationsDropdown",
//   "get",
//   (building_name) => ({
//     url: DROPDOWN_ENDPOINTS_USER.OPERATIONS(building_name),
//   })
// );
export const getOperationsDropdown = createAsyncThunkAction(
  "userManagement/getOperationsDropdown",
  "get",
  (building_name) => ({
    url: DROPDOWN_ENDPOINTS_USER.OPERATIONS(building_name),
  })
);

export const getMachinesDropdown = createAsyncThunkAction(
  "userManagement/getMachinesDropdown",
  "get",
  ({ plant_id, section_id }) => ({
    url: DROPDOWN_ENDPOINTS_USER.MACHINES({ plant_id, section_id }),
  })
);

// export const getUserTableDetails = createAsyncThunkAction(
//   "userManagement/getUserTableDetails",
//   "get",
//   () => ({
//     url: DROPDOWN_ENDPOINTS_USER.USER_GET_LIST,
//   })
// );

export const getUserTableDetails = createAsyncThunkAction(
  "userManagement/getUserTableDetails",
  "get", // HTTP method
  ({ page = 1, pageSize = 10, all = false, plant_id = "" } = {}) => ({
    url: `${DROPDOWN_ENDPOINTS_USER.USER_GET_LIST}?page=${page}&page_size=${pageSize}&all=${all}&plant_id=${plant_id}`,
  })
);

export const getUserManagementDetails = createAsyncThunkAction(
  "userManagement/getUserManagementDetails",
  "get",
  (id) => ({
    url: DROPDOWN_ENDPOINTS_USER.USER_UPDATE_DELETE_GET(id),
    //  `${DROPDOWN_ENDPOINTS_USER.USER_GET_LIST}/${id}`,
  })
);

export const postUserManagementDetails = createAsyncThunkAction(
  "userManagement/postUserManagementDetails",
  "post",
  (payload) => ({
    url: DROPDOWN_ENDPOINTS_USER.USER_REGISTRATION,
    data: payload,
  })
);

export const putUserManagementDetails = createAsyncThunkAction(
  "userManagement/putUserManagementDetails",
  "put",
  ({ userId, formDataToSend }) => ({
    url: DROPDOWN_ENDPOINTS_USER.USER_UPDATE_DELETE_GET(userId),
    data: formDataToSend,
  })
);

export const deleteUserManagementDetails = createAsyncThunkAction(
  "userManagement/deleteUserManagementDetails",
  "delete",
  (id) => ({
    url: DROPDOWN_ENDPOINTS_USER.USER_UPDATE_DELETE_GET(id),
  })
);

// ============ Reducers & ExtraReducers ============

const extraReducers = (builder) => {
  builder
    .addCase(getAdminUserRoles.fulfilled, (state, action) => {
      state.adminUserRoles = action.payload || [];
    })
    .addCase(getPlantsDropdown.fulfilled, (state, action) => {
      state.plantOptions = action.payload || [];
    })
    .addCase(getSectionsDropdown.fulfilled, (state, action) => {
      state.sectionOptions = action.payload || [];
    })
    .addCase(getOperationsDropdown.fulfilled, (state, action) => {
      state.operationsOptions = action.payload || [];
    })
    .addCase(getMachinesDropdown.fulfilled, (state, action) => {
      state.machineOptions = action.payload?.data || [];
    })
    .addCase(getUserTableDetails.fulfilled, (state, action) => {
      state.userTableDetails = action.payload || [];
    })
    .addCase(getUserManagementDetails.fulfilled, (state, action) => {
      state.userDetails = action.payload || {};
    })
    .addCase(postUserManagementDetails.fulfilled, (state, action) => {
      state.success = action.payload?.message;
    })
    .addCase(putUserManagementDetails.fulfilled, (state, action) => {
      state.success = action.payload?.message;
    })
    .addCase(deleteUserManagementDetails.fulfilled, (state, action) => {
      state.success = action.payload?.message;
    });
};

const reducers = {
  clearMessage: (state) => {
    state.success = null;
    state.error = null;
  },
};

const userManagementSlice = createGenericSlice(
  "userManagement",
  {
    loading: false,
    error: null,
    success: null,
    userDetails: {},
    userTableDetails: [],
    adminUserRoles: [],
    plantOptions: [],
    sectionOptions: [],
    operationsOptions: [],
    machineOptions: [],
  },
  reducers,
  extraReducers
);

export const { clearMessage } = userManagementSlice.actions;
export default userManagementSlice.reducer;
