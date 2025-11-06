import {
  FAI_DROPDOWN,
  FAI_INSPECTION_LIST,
  FAI_INSPECTION_LIST_FOR_VIEW,
  FAI_INSPECTION_SAVE,
  GET_FAI_INSPECTION_REPORT,
  GET_INPROCESS_INSPECTION_REPORT,
  GET_PARAMETERWISE_REPORT,
  GET_RM_INSPECTION_REPORT,
  getMachineDropdownUrl,
  getRMMachineDropdownUrl,
  IN_PROCESS_INSPECTION_LIST,
  IN_PROCESS_INSPECTION_LIST_FOR_VIEW,
  IN_PROCESS_INSPECTION_SAVE,
  INPROCESS_GETDATA,
  IO_DROPDOWNRM,
  PO_DROPDOWNIP,
  RM_GETDATA,
  RM_INSPECTION_LIST,
  RMPROCESS_GETDATA,
} from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";

export const poOrderList = createAsyncThunkAction(
  "list/poOrderList",
  "get",
  () => ({
    url: PO_DROPDOWNIP,
  })
);
export const FAIpoOrderList = createAsyncThunkAction(
  "list/FAIpoOrderList",
  "get",
  () => ({
    url: FAI_DROPDOWN,
  })
);

export const ioOrderList = createAsyncThunkAction(
  "list/ioOrderList",
  "get",
  () => ({
    url: IO_DROPDOWNRM,
  })
);

export const inProcessInspectionFilter = createAsyncThunkAction(
  "list/inProcessInspectionFilter",
  "get",
  ({ section_name, item_code, po_no, qc_machine_id }) => ({
    url: IN_PROCESS_INSPECTION_LIST({
      section_name,
      item_code,
      po_no,
      qc_machine_id,
    }),
  })
);
export const FAIInspectionFilter = createAsyncThunkAction(
  "list/FAIInspectionFilter",
  "get",
  ({
    section,
    item_code,
    production_machine_id,
    qc_machine_id,
    po_no,
  }) => ({
    url: FAI_INSPECTION_LIST({
      section,
      item_code,
      // production_machine_id,
      qc_machine_id,
      po_no,
    }),
  })
);
export const RMInspectionFilter = createAsyncThunkAction(
  "list/RMInspectionFilter",
  "get",
  ({ mis_no, item_code, qc_machine_id, io_no }) => ({
    url: RM_INSPECTION_LIST(mis_no, item_code, qc_machine_id, io_no),
  })
);

export const inProcessInspectionSave = createAsyncThunkAction(
  "list/inProcessInspectionSave",
  "post",
  ({ data, url }) => {
    return {
      url,
      data,
    };
  }
);
export const updateInProcessInspection = createAsyncThunkAction(
  "list/updateInProcessInspection",
  "put",
  ({ data, url }) => {
    return { url, data };
  }
);

export const machineDropDawn = createAsyncThunkAction(
  "list/machineDropDawn",
  "get",
  ({ sectionName, itemCode }) => ({
    url: getMachineDropdownUrl(sectionName, itemCode),
  })
);
export const machineRMDropDawn = createAsyncThunkAction(
  "list/machineRMDropDawn",
  "get",
  ({ mis_no, itemCode }) => ({
    url: getRMMachineDropdownUrl(mis_no, itemCode),
  })
);
export const inProcessGetData = createAsyncThunkAction(
  "list/inProcessGetData",
  "get",
  (data) => ({
    url: INPROCESS_GETDATA,
    data: data,
  })
);
export const inProcessGetDataReport = createAsyncThunkAction(
  "list/inProcessGetDataReport",
  "get",
  ({ data, url }) => ({
    url: url,
    data: data,
  })
);
export const faiGetDataReport = createAsyncThunkAction(
  "list/faiGetDataReport",
  "get",
  (data) => ({
    url: GET_FAI_INSPECTION_REPORT,
    data: data,
  })
);
export const rmGetDataReport = createAsyncThunkAction(
  "list/rmGetDataReport",
  "get",
  (data) => ({
    url: GET_RM_INSPECTION_REPORT,
    data: data,
  })
);

export const faiGetData = createAsyncThunkAction(
  "list/faiGetData",
  "get",
  (data) => ({
    url: FAI_INSPECTION_SAVE,
    data: data,
  })
);

export const rmProcessGetData = createAsyncThunkAction(
  "list/rmProcessGetData",
  "get",
  (data) => ({
    url: RMPROCESS_GETDATA,
    data: data,
  })
);

export const inProcessGetDeatils = createAsyncThunkAction(
  "list/inProcessGetDeatils",
  "get",
  ({ data }) => ({
    url: IN_PROCESS_INSPECTION_LIST_FOR_VIEW,
    data: data,
  })
);
export const rmGetDeatils = createAsyncThunkAction(
  "list/inProcessGetDeatils",
  "get",
  ({ data }) => ({
    url: RM_GETDATA,
    data: data,
  })
);
export const faiGetDeatils = createAsyncThunkAction(
  "list/faiGetDeatils",
  "get",
  ({ data }) => ({
    url: FAI_INSPECTION_LIST_FOR_VIEW,
    data: data,
  })
);
export const GET_PARAMETER_WISE_LIST = createAsyncThunkAction(
  "list/GET_PARAMETER_WISE_LIST",
  "get",
  (data) => ({
    url: GET_PARAMETERWISE_REPORT,
    data: data,
  })
);

// apiThunk.js
export const fetchDropdown = createAsyncThunkAction(
  "dropdown/fetch",
  "get",
  ({ url, params }) => ({
    // url,
    // params,
    url: url,
    data: params,
  })
);

GET_PARAMETERWISE_REPORT;
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

  handleAsyncState(poOrderList);
  handleAsyncState(ioOrderList);
  handleAsyncState(inProcessInspectionFilter);
  handleAsyncState(inProcessInspectionSave);
  handleAsyncState(machineDropDawn);
  handleAsyncState(RMInspectionFilter);
  handleAsyncState(machineRMDropDawn);
  handleAsyncState(inProcessGetData);
  handleAsyncState(rmProcessGetData);
  handleAsyncState(rmGetDeatils);
  handleAsyncState(FAIpoOrderList);
  handleAsyncState(FAIInspectionFilter);
  handleAsyncState(faiGetDeatils);
  handleAsyncState(faiGetData);
  handleAsyncState(fetchDropdown);
  handleAsyncState(inProcessGetDataReport);
  handleAsyncState(faiGetDataReport);
  handleAsyncState(rmGetDataReport);
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

const poList = createGenericSlice(
  "poList",
  {
    loading: false,
    error: null,
    success: null,
  },
  reducers,
  extraReducers
);

export const { clearMessage, setAuthToken } = poList.actions;
export default poList.reducer;
