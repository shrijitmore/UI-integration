import {
  DASHBOARD_ONE,
  DASHBOARD_ONE_GRAPH,
  DASHBOARD_ONE_LINE_GRAPH,
  DASHBOARD_ONE_RAW_BARGRAPH,
  DASHBOARD_TWO_DOT_LINE_GRAPH,
} from "../../../utils/endpoints";
import { createAsyncThunkAction } from "../../genericAsyncFunctions";
import { createGenericSlice } from "../../genericSlice";

export const dashBoardOne = createAsyncThunkAction(
  "auth/dashBoardOne",
  "get",
  ({
    section,
    date_range,
    item_code,
    operation,
    start_date,
    end_date,
    source,
  }) => ({
    url: DASHBOARD_ONE(
      section,
      date_range,
      item_code,
      operation,
      start_date,
      end_date,
      source
    ),
  })
);
export const dashBoardOneGraph = createAsyncThunkAction(
  "auth/dashBoardOneGraph",
  "get",
  ({
    section,
    date_range,
    item_code,
    operation,
    start_date,
    end_date,
    inspection_param,
    apikey,
  }) => ({
    url: DASHBOARD_ONE_GRAPH(
      section,
      date_range,
      item_code,
      operation,
      start_date,
      end_date,
      inspection_param,
      apikey
    ),
  })
);
export const dashBoardTwoDotLineGraph = createAsyncThunkAction(
  "auth/dashBoardTwoDotLineGraph",
  "get",
  ({
    section,
    date_range,
    item_code,
    operation,
    start_date,
    end_date,
    inspection_parameter,
    apikey,
  }) => ({
    url: DASHBOARD_TWO_DOT_LINE_GRAPH(
      section,
      date_range,
      item_code,
      operation,
      start_date,
      end_date,
      inspection_parameter,
      apikey
    ),
  })
);
export const dashBoardOneRawBarGraph = createAsyncThunkAction(
  "auth/dashBoardOneRawBarGraph",
  "get",
  ({
    section,
    date_range,
    item_code,
    start_date,
    end_date,
    inspection_param,
  }) => ({
    url: DASHBOARD_ONE_RAW_BARGRAPH(
      section,
      date_range,
      item_code,
      start_date,
      end_date,
      inspection_param
    ),
  })
);
export const dashBoardOneLineGraph = createAsyncThunkAction(
  "auth/dashBoardOneLineGraph",
  "get",
  ({
    section,
    date_range,
    item_code,
    operation,
    start_date,
    end_date,
    inspection_param,
    machine,
    apikey,
  }) => ({
    url: DASHBOARD_ONE_LINE_GRAPH(
      section,
      date_range,
      item_code,
      operation,
      start_date,
      end_date,
      inspection_param,
      machine,
      apikey
    ),
  })
);

const extraReducers = (builder) => {
  builder
    // dashBoardOne
    .addCase(dashBoardOne.pending, (state) => {
      state.loading = true;
    })
    .addCase(dashBoardOne.fulfilled, (state, action) => {
      state.loading = false;
      state.dashBoardOneData = action.payload.data;
      state.authChecked = true;
    })
    .addCase(dashBoardOne.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.authChecked = true;
    })

    // dashBoardOneGraph
    .addCase(dashBoardOneGraph.pending, (state) => {
      state.loading = true;
    })
    .addCase(dashBoardOneGraph.fulfilled, (state, action) => {
      state.loading = false;
      state.dashBoardOneGraphData = action.payload.data;
      state.authChecked = true;
    })
    .addCase(dashBoardOneGraph.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.authChecked = true;
    })
    .addCase(dashBoardOneRawBarGraph.pending, (state) => {
      state.loading = true;
    })
    .addCase(dashBoardOneRawBarGraph.fulfilled, (state, action) => {
      state.loading = false;
      state.dashBoardOneRawBarGraphData = action.payload.data;
      state.authChecked = true;
    })
    .addCase(dashBoardOneRawBarGraph.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.authChecked = true;
    })
    .addCase(dashBoardOneLineGraph.pending, (state) => {
      state.loading = true;
    })
    .addCase(dashBoardOneLineGraph.fulfilled, (state, action) => {
      state.loading = false;
      state.dashBoardOneGraphData = action.payload.data;
      state.authChecked = true;
    })
    .addCase(dashBoardOneLineGraph.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.authChecked = true;
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

const dashboardSlice = createGenericSlice(
  "dashboardone",
  {
    loading: false,
    error: null,
    success: null,
    accessToken: null,
    vendorId: null,
    refreshToken: null,
    role: "",
    dashBoardOneData: [],
    dashBoardOneGraphData: [],
  },
  reducers,
  extraReducers
);

export const { clearMessage, setAuthToken } = dashboardSlice.actions;
export default dashboardSlice.reducer;
