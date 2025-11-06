import dayjs from "dayjs";
import {
  dashBoardOne,
  dashBoardOneGraph,
  dashBoardOneLineGraph,
  dashBoardTwoDotLineGraph,
} from "../../store/slices/dashboard/dashboardSlice";
import { apiDateRangeMap, apiKeyMap, apiKeyMapTwo } from "./config";

export const fetchDashboardData = async (
  dispatch,
  formData,
  sectionId,
  viewMode
) => {
  const payload = {
    section: sectionId ? Number(sectionId) : "",
    date_range: apiDateRangeMap[formData.dateRange] || null,
    item_code: formData?.itemCode?.map((item) => item?.id) || null,
    operation: null,
    source: viewMode,
  };

  if (formData.dateRange === "custom" && formData.fromDate && formData.toDate) {
    payload.start_date = dayjs(formData.fromDate).format("YYYY-MM-DD");
    payload.end_date = dayjs(formData.toDate).format("YYYY-MM-DD");
  }

  return await dispatch(dashBoardOne(payload)).unwrap();
};

export const fetchBarGraphData = async (
  dispatch,
  formData,
  sectionId,
  selectedSection,
  viewMode
) => {
  const payload = {
    section: sectionId ? Number(sectionId) : selectedSection?.id,
    date_range: apiDateRangeMap[formData.dateRange] || null,
    // item_code: formData.itemCode.map((item) => item.code),
    item_code: formData.itemCode.map((item) => item.id),

    operation: formData.operation?.id || formData.operation,
    inspection_param: formData.inspectionParameters.map((param) => param?.id),
    apikey: apiKeyMap[viewMode]?.barGraph || null,
  };

  if (formData.dateRange === "custom" && formData.fromDate && formData.toDate) {
    payload.start_date = dayjs(formData.fromDate).format("YYYY-MM-DD");
    payload.end_date = dayjs(formData.toDate).format("YYYY-MM-DD");
  }

  return await dispatch(dashBoardOneGraph(payload)).unwrap();
};

export const fetchLineGraphData = async (
  dispatch,
  formData,
  sectionId,
  selectedSection,
  viewMode
) => {
  const payload = {
    section: Number(sectionId || selectedSection?.id) || null,
    date_range: apiDateRangeMap[formData.dateRange] || null,
    // item_code: formData.itemCode.map((item) => item.code) || null,
    item_code: formData.itemCode.map((item) => item.id) || null,

    operation: formData.operation?.id || formData.operation || null,
    inspection_param:
      formData.inspectionParameters.map((param) => param.id) || null,
    apikey: apiKeyMap[viewMode]?.lineGraph || null,
  };

  if (formData.qcMachine?.length) {
    payload.machine = formData.qcMachine.map((param) => param.id);
  }

  if (formData.dateRange === "custom" && formData.fromDate && formData.toDate) {
    payload.start_date = dayjs(formData.fromDate).format("YYYY-MM-DD");
    payload.end_date = dayjs(formData.toDate).format("YYYY-MM-DD");
  }

  return await dispatch(dashBoardOneLineGraph(payload)).unwrap();
};

export const fetchLineTwoGraphData = async (
  dispatch,
  formData,
  sectionId,
  selectedSection,
  viewMode
) => {
  const payload = {
    section: Number(sectionId || selectedSection?.id) || null,
    date_range: apiDateRangeMap[formData.dateRange] || null,
    item_code: formData.itemCode.map((item) => item.id) || null,
    operation: formData.operation?.id || formData.operation || null,
    inspection_parameter:
      formData.inspectionParameters.map((param) => param.id) || null,
    apikey: apiKeyMapTwo[viewMode]?.lineGraph || null,
  };

  if (formData.qcMachine?.length) {
    payload.machine = formData.qcMachine.map((param) => param.id);
  }

  if (formData.dateRange === "custom" && formData.fromDate && formData.toDate) {
    payload.start_date = dayjs(formData.fromDate).format("YYYY-MM-DD");
    payload.end_date = dayjs(formData.toDate).format("YYYY-MM-DD");
  }

  return await dispatch(dashBoardTwoDotLineGraph(payload)).unwrap();
};
