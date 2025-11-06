// All endpoints will go here
export const SIGN_IN = "auth/login/";
export const SIGN_UP = "auth/register/";
export const LOGOUT = "auth/logout/";
export const FORGOT_PASSWORD = "auth/forgot-password/";
export const MY_PROFILE_ACCOUNT = "auth/profile/";
export const PROFILE_PASSWORD_DETAILS_CHANGE = "auth/change-password/";
export const CONTACT_US = "contact_us/";
export const RESET_PASS = "auth/reset-password/";

export const POST_USER_MANAGEMENT_DETAIL = "admin/useradmin/";
export const UPDATE_USER_MANAGEMENT_DETAIL = (id) => `admin/useradmin/${id}/`;
export const USER_MANAGEMENT_DETAIL = (id) => `admin/useradmin/${id}`;
export const DELETE_USER_MANAGEMENT_DETAIL = (id) => `admin/useradmin/${id}/`;
export const USER_MANAGEMENT_TABLE_DETAIL = "admin/useradmin";
export const USER_ADMIN_ROLE = "admin/roles";

export const UPLOADFILE = {
  machinMaster: "master/machines/upload/",
  parameterMaster: "master/parameterslist/upload/",
  itemMaster: "master/items/upload/",
  planMaster: "master/plants/upload",
  buildingSection: "/master/buildings/upload",
  operationMaster: "/master/operations/upload/",
  inspectionMasterScheduling: "/master/inspection-schedules/upload/",
  samplingProcedure: "/master/sampling-procedure/upload/",
  faiItem: "/master/fai_items/upload/",
  faiOperation: "/master/fai_operations/upload/",
  faiSchedule: "/master/fai_inspection_schedules/upload/",
};

//Open Orders

export const PRODUCTION_PLANNER_LIST = "master/production_planner/list/";
export const PRODUCTION_PLANNER_UPLOAD = "master/production_planner/upload/";
export const RM_PLANNER_LIST = "master/rm_planner/list/";
export const RM_PLANNER_UPLOAD = "master/rm_planner/upload/";
// export const IN_PROCESS_INSPECTION_LIST = `master/operations_list`;
export const IN_PROCESS_INSPECTION_SAVE = `master/inprocess_insp_readings/`;
export const RM_INSPECTION_SAVE = `master/rm_inspection_readings/`;
export const FAI_INSPECTION_SAVE = `master/fai_readings/`;

export const RM_GETDATA = `master/rm_process_inspections/`;
export const FAI_INSPECTION_LIST = ({
  section,
  item_code,
  production_machine_id,
  qc_machine_id,
  po_no,
}) =>
  `master/fai_operations_list/?section=${section}&item_code=${item_code}&qc_machine_id=${qc_machine_id}&po_no=${po_no}`;
export const IN_PROCESS_INSPECTION_LIST = ({
  section_name,
  item_code,
  po_no,
  qc_machine_id,
}) =>
  `master/operations_list/?section=${section_name}&item_code=${item_code}&qc_machine_id=${qc_machine_id}&po_no=${po_no}`;
// &production_machine_id=${production_machine_id}`;

export const RM_INSPECTION_LIST = (mis_no, item_code, qc_machine_id, io_no) =>
  `master/rm_operations_list/?mis_no=${mis_no}&item_code=${item_code}&qc_machine_id=${qc_machine_id}&io_no=${io_no}`;

// dropdown endpoints
export const DROPDOWN_ENDPOINTS_USER = {
  PLANTS: "master/plants_dropdown/",
  ROLES: "rbac/roles/",
  SECTIONS: "master/sections-dropdown/",
  // OPERATIONS: (building_name) => `master/operations-dropdown/${building_name}`,
  OPERATIONS: (building_name) =>
    `master/operations-dropdown/?building_name=${building_name}`,

  MACHINES: ({ plant_id, section_id }) =>
    `/master/machines-types-dropdown/?plant_id=${plant_id}&section_id=${section_id}`,
  USER_REGISTRATION: "auth/register/",
  USER_GET_LIST: `auth/user/`,
  USER_UPDATE_DELETE_GET: (id) => `auth/user/${id}/`,
};

export const ADDROLE = "rbac/roles/";
export const GETROLELISTDATA = "rbac/roles/";
export const EDITROLEDATABYID = (id) => `rbac/roles/${id}/`;
export const DELETE_ROLE_DETAIL = (id) => `rbac/roles/${id}/`;
export const PRODUCTIONACTIONSTARTSTOP = (id, lot_number) =>
  `/master/production_planner/toggle/${id}/?lot_number=${lot_number}`;

export const PERMISSION_LIST_POST = "rbac/permissions/";
export const PO_DROPDOWNIP = "master/po_no_dropdown/";
export const IO_DROPDOWNRM = "master/io_no_dropdown/";
export const FAI_DROPDOWN = "master/fai_po_no_dropdown/";

export const getMachineDropdownUrl = (sectionName, itemCode) =>
  `master/machine_dropdown/?section_name=${sectionName}&item_code=${itemCode}`;

export const getRMMachineDropdownUrl = (mis_no, itemCode) =>
  `master/qc_machine_dropdown/?mis_no=${mis_no}&item_code=${itemCode}`;

export const INPROCESS_GETDATA = "master/inprocess_insp_readings/";
export const RMPROCESS_GETDATA = "master/rm_inspections_details/";
export const IN_PROCESS_INSPECTION_LIST_FOR_VIEW =
  "master/inprocess_insp_details/";

export const FAI_INSPECTION_LIST_FOR_VIEW = "master/fai_details/";

export const ACTIVITY_LOG = "activity_log/";
// export const DASHBOARD_ONE = (section, date_range, item_code, operation) => {
//   const params = new URLSearchParams();
//   console.log(item_code, "item_code=======>");
//   if (section) params.append("section", section);
//   if (date_range) params.append("date_range", date_range);
//   if (item_code?.length > 0) {
//     params.append("item_code", item_code.map((item) => item).join(","));
//   }
//   if (operation) params.append("operation", operation);

//   return `qms_app/inspection/dropdowns/?${params.toString()}`;
// };

export const DASHBOARD_ONE = (
  section,
  date_range,
  item_code,
  operation,
  start_date,
  end_date,
  source
) => {
  const params = new URLSearchParams();
  if (section) params.append("section", section);
  if (date_range) params.append("date_range", date_range);
  if (start_date) params.append("start_date", start_date);
  if (end_date) params.append("end_date", end_date);

  if (item_code?.length > 0) {
    item_code.forEach((id) => params.append("item_code", id));
  }
  if (operation) params.append("operation", operation);
  if (source) params.append("source", source);

  return `qms_app/inspection/dropdowns/?${params.toString()}`;
};
export const DASHBOARD_ONE_GRAPH = (
  section,
  date_range,
  item_code,
  operation,
  start_date,
  end_date,
  inspection_param,
  apikey
) => {
  const params = new URLSearchParams();
  if (section) params.append("section", section);
  if (date_range) params.append("date_range", date_range);
  if (start_date) params.append("start_date", start_date);
  if (end_date) params.append("end_date", end_date);

  if (item_code?.length > 0) {
    item_code.forEach((id) => params.append("item_code", id));
  }
  if (inspection_param?.length > 0) {
    inspection_param.forEach((id) => params.append("inspection_param", id));
  }
  if (operation) params.append("operation", operation);

  // return `qms_app/operation-bargraph/?${params.toString()}`;
  return `qms_app/${apikey}/?${params.toString()}`;
};

export const DASHBOARD_ONE_RAW_BARGRAPH = (
  section,
  date_range,
  item_code,

  start_date,
  end_date,
  inspection_param
) => {
  const params = new URLSearchParams();
  if (section) params.append("section", section);
  if (date_range) params.append("date_range", date_range);
  if (start_date) params.append("start_date", start_date);
  if (end_date) params.append("end_date", end_date);

  if (item_code?.length > 0) {
    item_code.forEach((id) => params.append("item_code", id));
  }
  if (inspection_param?.length > 0) {
    inspection_param.forEach((id) => params.append("inspection_param", id));
  }

  return `qms_app/rm-bargraph/?${params.toString()}`;
};

export const DASHBOARD_ONE_LINE_GRAPH = (
  section,
  date_range,
  item_code,
  operation,
  start_date,
  end_date,
  inspection_param,
  machine,
  apikey
) => {
  const params = new URLSearchParams();
  if (section) params.append("section", section);
  if (date_range) params.append("date_range", date_range);
  if (start_date) params.append("start_date", start_date);
  if (end_date) params.append("end_date", end_date);

  if (item_code?.length > 0) {
    item_code.forEach((id) => params.append("item_code", id));
  }
  if (operation) params.append("operation", operation);
  if (inspection_param?.length > 0) {
    inspection_param.forEach((id) => params.append("inspection_param", id));
  }
  if (machine?.length > 0) {
    machine.forEach((id) => params.append("machine", id));
  }

  return `qms_app/${apikey}/?${params.toString()}`;
};
export const DASHBOARD_TWO_DOT_LINE_GRAPH = (
  section,
  date_range,
  item_code,
  operation,
  start_date,
  end_date,
  inspection_parameter,
  apikey
) => {
  const params = new URLSearchParams();
  if (section) params.append("section", section);
  if (date_range) params.append("date_range", date_range);
  if (start_date) params.append("start_date", start_date);
  if (end_date) params.append("end_date", end_date);

  if (item_code?.length > 0) {
    item_code.forEach((id) => params.append("item_code", id));
  }
  if (inspection_parameter?.length > 0) {
    inspection_parameter.forEach((id) =>
      params.append("inspection_parameter", id)
    );
  }
  if (operation) params.append("operation", operation);

  return `qms_app/${apikey}/cordinates/?${params.toString()}`;
};

export const ORDER_DETAILS = "master/order-details/";
export const GET_OPERATION_DETAILS = (order_id) =>
  `master/order-details/${order_id}/operation_details/`;
// 'http://127.0.0.1:8000/master/fai_details/?order_number=1001&item_code=ITM024&operation=OP001' \

export const CHANGE_PASSWORD = "auth/change-password/";

export const GET_PRODUCTION_ORDER_NO_LIST = "master/production_order_no/";
export const GET_SECTION_LIST = "master/section_list/";

export const GET_ITEM_CODE_LIST = "master/item_code_list/";
export const GET_RM_SECTION_LIST = "qms_app/rm/dropdown/section";
export const GET_RM_IO_LIST = "qms_app/rm/dropdown/io_no";
export const GET_RM_ITEMCODE_LIST = "qms_app/rm/dropdown/item_code";
export const GET_PO_DROPDOWN_LIST = "master/po_number";

export const GET_OPERATION_LIST = "qms_app/dropdown/operation_name/";
export const GET_INPROCESS_INSPECTION_REPORT =
  "master/inprocess_insp_reports_details/";
export const GET_FAI_INSPECTION_REPORT = "master/fai_reports_details/";
export const GET_RM_INSPECTION_REPORT = "master/rm_reports_details/";
export const GET_PARAMETERWISE_REPORT = "master/inspection_parameters/";

export const GET_CREATE_ADMIN_BID = "admin/bid/";
export const INPROCESS_GETDATA_EXPORT_DATA = "master/inprocess_insp_readings/";
export const FAI_GETDATA_EXPORT_DATA = "master/fai_readings/";
export const RM_GETDATA_EXPORT_DATA = "master/rm_inspections_details/all/";
// fai_reports_details;

export const GET_OREDRMANAGEMENT_DROPDOWNS = "master/podropdowns/";
export const POST_PUT_GET_DELETE_ORDER_MANAGEMENT = "master/po-no-mapping/";
