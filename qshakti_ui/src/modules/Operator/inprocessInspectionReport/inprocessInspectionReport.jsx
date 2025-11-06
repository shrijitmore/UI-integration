import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Paper,
  Typography,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  fetchDropdown,
  GET_PARAMETER_WISE_LIST,
  inProcessGetData,
  inProcessGetDataReport,
  inProcessGetDeatils,
} from "../../../store/slices/operator/CommonIOSectionSlice";
import {
  GET_INPROCESS_INSPECTION_REPORT,
  GET_OPERATION_LIST,
  GET_PO_DROPDOWN_LIST,
  GET_RM_IO_LIST,
  GET_RM_ITEMCODE_LIST,
  GET_RM_SECTION_LIST,
} from "../../../utils/endpoints";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchAutocomplete from "../FilterSection/SearchAutocomplete";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DateFilter from "../../Dashboard/DateFilter";
import ParameterWiseTable from "../RmInspection/ParameterWiseView";
import { apiDateRangeMap } from "../../Dashboard/config";
import InspectionTable from "./InspectionTable";
import { downloadInspectionReport } from "./downloadInspectionReport";
import dayjs from "dayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { downloadInspectionReportExcel } from "./downloadInspectionReportExcel";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import CustomAutocomplete from "../InprocessInspection/CustomAutocomplete";
import { showToast } from "../../../common/ShowToast";
function renameKey(objArray, oldKey, newKey) {
  return objArray.map((obj) => {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
    return obj;
  });
}
const InprocessInspectionReport = ({
  title = "In Process Inspection Report ",
  url = GET_INPROCESS_INSPECTION_REPORT,
  keyLable = false,
}) => {
  const [sectionOrMisNo, setSectionOrMisNo] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [operationListById, setOperationListById] = useState({});
  const [loading, setLoading] = useState(false);
  const [itemCode, setItemCode] = useState("");
  const [operationName, setOperationName] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
  });
  const [parameterData, setParameterData] = useState([]);
  const [seletedParameter, setSelectedParameter] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [optionsName, setOptionsName] = useState([]);
  const [optionsIo, setOptionsIo] = useState([]);
  const [optionsItem, setOptionsItem] = useState([]);
  const [optionsOperation, setOptionsOptionsOperation] = useState([]);
  const [subSectionList, setSubSectionList] = useState();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10); // ✅ define pageSize
  const [totalRecords, setTotalRecords] = useState(0); // ✅ define totalRecords
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let keydata = keyLable ? "io_no" : "operation";
        let keyvalue = keyLable
          ? sectionOrMisNo?.io_number
          : operationName?.operation_id;
        const data = {
          order_number: selectedOrder?.order_number,
          // operation: operationName?.operation_id,
          [keydata]: keyvalue,
          item_code: itemCode?.item_code,
          date_range: apiDateRangeMap[formData.dateRange] || null,
          page: page,
          page_size: 10,
          inspection_parameter_ids: seletedParameter
            ?.map((param) => param.id)
            .join(","),
        };

        // ✅ Add custom dates only when both are selected
        if (
          formData.dateRange === "custom" &&
          formData.fromDate &&
          formData.toDate
        ) {
          data.start_date = dayjs(formData?.fromDate).format("YYYY-MM-DD");
          data.end_date = dayjs(formData?.toDate).format("YYYY-MM-DD");
        }

        const res = await dispatch(
          inProcessGetDataReport({ data, url })
        ).unwrap();

        let data2 = { ...data, all: true };
        const respdf = await dispatch(
          inProcessGetDataReport({ data: data2, url })
        ).unwrap();
        const updatedData = renameKey(
          res?.data,
          "actual_readings",
          "actualReadings"
        );
        setData(updatedData || []);
        setTotalPages(res?.total_pages || 0); // ✅ total pages
        setTotalRecords(res?.total || 0);
        const updatedData2 = renameKey(
          respdf?.data,
          "actual_readings",
          "actualReadings"
        );
        setPdfData(updatedData2 || []);
      } catch (error) {
        console.error("Failed to fetch inspection data:", error);
        setData([]); // ✅ safer fallback
      } finally {
        setLoading(false);
      }
    };

    // ✅ Conditional API call
    if (formData.dateRange === "custom") {
      if (formData.fromDate && formData.toDate && seletedParameter?.length > 0)
        fetchData();
    } else {
      if (seletedParameter?.length > 0) {
        fetchData();
      }
    }
  }, [
    selectedOrder?.order_number,
    operationName?.operation_id, // ✅ was missing
    itemCode?.item_code,
    formData.dateRange,
    formData.fromDate,
    formData.toDate,
    page,
    dispatch,
    seletedParameter,
  ]);
  useEffect(() => {
    setSubSectionList({
      building_name: selectedSection?.building_name || "-",
      order_number: selectedOrder?.order_number || "-",
      item_code: itemCode?.item_code || "-",
      operation_name: operationName?.operation_name || "-",
      date_range: apiDateRangeMap[formData.dateRange] || "-",
      start_date: formData.fromDate
        ? dayjs(formData.fromDate).format("YYYY-MM-DD")
        : null,
      end_date: formData.toDate
        ? dayjs(formData.toDate).format("YYYY-MM-DD")
        : null,
      report_title: `${title}`,
      io_number: sectionOrMisNo?.io_number,
    });
  }, [
    selectedSection,
    selectedOrder,
    itemCode,
    operationName,
    formData.dateRange,
    formData.fromDate,
    formData.toDate,
    sectionOrMisNo?.io_number,
  ]);
  useEffect(() => {
    if (operationName?.operation_name || (itemCode?.item_code && keyLable)) {
      const fetchParameters = async () => {
        try {
          let keydata = keyLable ? "item_code" : "operation_name";
          let keyvalue = keyLable
            ? itemCode?.item_code
            : operationName?.operation_name;

          let data = {
            // operation_name: operationName?.operation_name,
            [keydata]: keyvalue,
          };
          const res = await dispatch(GET_PARAMETER_WISE_LIST(data)).unwrap();
          setParameterData(res?.data);
        } catch (err) {
          console.error("Failed to fetch parameters:", err);
        }
      };

      fetchParameters();
    }
  }, [operationName?.operation_name, itemCode?.item_code, keyLable]);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap", // ✅ ensures responsive on small screens
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: "1.2rem",
                lg: "1.3rem",
              },
              color: "#1a237e",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {/* In Process Inspection Report */}
            {title}
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
            {/* PDF Button */}
            <Tooltip title={`Download ${title}.pdf`} arrow>
              <Button
                variant="outlined"
                onClick={() => {
                  if (pdfData?.length === 0) {
                    showToast("No Data available so cannot download", "error");
                  } else {
                    downloadInspectionReport(pdfData, subSectionList, keyLable);
                  }
                }}
                sx={{
                  px: 1,
                  py: 1,
                  borderColor: "#D32F2F",
                  color: "#D32F2F",
                  "&:hover": {
                    borderColor: "#B71C1C",
                    backgroundColor: "#fceaea",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DownloadIcon sx={{ fontSize: 16 }} />
                  <PictureAsPdfIcon sx={{ color: "#D32F2F", fontSize: 16 }} />
                </Stack>
              </Button>
            </Tooltip>

            {/* Excel Button */}
            <Tooltip title={`Download ${title}.xlsx`} arrow>
              <Button
                variant="outlined"
                onClick={() => {
                  if (pdfData?.length === 0) {
                    showToast("No Data available so cannot download", "error");
                  } else {
                    downloadInspectionReportExcel(
                      pdfData,
                      subSectionList,
                      keyLable
                    );
                  }
                }}
                sx={{
                  px: 1,
                  py: 1,
                  borderColor: "#2E7D32",
                  color: "#2E7D32",
                  "&:hover": {
                    borderColor: "#1B5E20",
                    backgroundColor: "#e9f5ec",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DownloadIcon sx={{ fontSize: 16 }} />
                  <DescriptionIcon sx={{ color: "#2E7D32", fontSize: 16 }} />
                </Stack>
              </Button>
            </Tooltip>
          </Box>
        </Box>
        <Grid item xs={12} md={9}>
          <Card elevation={2} sx={{ p: 2, mb: 1 }}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <SearchAutocomplete
                  label="Section"
                  value={selectedSection}
                  searchKey="section"
                  onChange={(newValue) => setSelectedSection(newValue)} // ✅ reusable
                  apiThunk={(p) => dispatch(fetchDropdown(p))}
                  apiParams={{ url: GET_RM_SECTION_LIST }}
                  getOptionLabel={(o) => o?.order_no || ""}
                  options={optionsName}
                  setOptions={setOptionsName}
                  optionLabelKey="building_name"
                  optionValueKey="building_id"
                  // const [options, ] = useState([]);
                />
              </Grid>
              {keyLable ? (
                <Grid item xs={12} md={3}>
                  <SearchAutocomplete
                    label="I/O No"
                    value={sectionOrMisNo}
                    searchKey="io_no" // ✅ dynamic key
                    onChange={(newValue) => setSectionOrMisNo(newValue)}
                    apiThunk={(p) => dispatch(fetchDropdown(p))}
                    apiParams={{ url: GET_RM_IO_LIST }}
                    getOptionLabel={(o) => o?.order_no || ""}
                    options={optionsIo}
                    setOptions={setOptionsIo}
                    optionLabelKey="io_number"
                    optionValueKey="io_number"
                  />
                </Grid>
              ) : (
                <Grid item xs={12} md={3}>
                  <SearchAutocomplete
                    label="Production Order No"
                    value={selectedOrder}
                    searchKey="po_no" // ✅ dynamic key
                    onChange={(newValue) => setSelectedOrder(newValue)}
                    // onChange={handleFieldChange(setSelectedOrder)} // ✅ reusable
                    apiThunk={(p) => dispatch(fetchDropdown(p))}
                    apiParams={{ url: GET_PO_DROPDOWN_LIST }}
                    options={optionsIo}
                    setOptions={setOptionsIo}
                    optionLabelKey="order_number"
                    optionValueKey="order_number"
                  />
                </Grid>
              )}

              <Grid item xs={12} md={3}>
                <DateFilter setFormData={setFormData} formData={formData} />
              </Grid>
              <Grid item xs={12} md={3}>
                <SearchAutocomplete
                  label="Item Code"
                  value={itemCode}
                  searchKey="item_code" // ✅ dynamic key
                  onChange={(newValue) => setItemCode(newValue)}
                  apiThunk={(p) => dispatch(fetchDropdown(p))}
                  apiParams={{ url: GET_RM_ITEMCODE_LIST }}
                  getOptionLabel={(o) => o?.order_no || ""}
                  options={optionsItem}
                  setOptions={setOptionsItem}
                  optionLabelKey="item_code"
                  optionValueKey="item_code"
                />
              </Grid>
              {keyLable == false && (
                <Grid item xs={12} md={3}>
                  <SearchAutocomplete
                    label="operation Name"
                    value={operationName}
                    searchKey="operation_name" // ✅ dynamic key
                    onChange={(newValue) => setOperationName(newValue)}
                    apiThunk={(p) => dispatch(fetchDropdown(p))}
                    apiParams={{ url: GET_OPERATION_LIST }}
                    getOptionLabel={(o) => o?.operation_name || ""}
                    options={optionsOperation}
                    setOptions={setOptionsOptionsOperation}
                    optionLabelKey="operation_name"
                    optionValueKey="operation_id"
                  />
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  multiple
                  disableCloseOnSelect
                  options={parameterData}
                  value={seletedParameter}
                  onChange={(e, newValue) => setSelectedParameter(newValue)}
                  getOptionLabel={(option) =>
                    option?.inspection_parameter || ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?.inspection_parameter_id ===
                    value?.inspection_parameter_id
                  }
                  label="INSPECTION PARAMETERS"
                  placeholder="Select QC Machines"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <InspectionTable
          data={data}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          totalRecords={totalRecords}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default InprocessInspectionReport;
