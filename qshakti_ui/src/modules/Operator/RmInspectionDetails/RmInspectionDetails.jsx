import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Grid,
  Card,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ParameterWiseTable from "../RmInspection/ParameterWiseView";
import {
  fetchDropdown,
  ioOrderList,
  rmGetDeatils,
  rmProcessGetData,
} from "../../../store/slices/operator/CommonIOSectionSlice";
import { useDispatch } from "react-redux";
import NoDataFound from "../../../common/NoDataFound";
import { useNavigate } from "react-router-dom";
import { renderCell } from "../InprocessInspectionDetails/InprocessInspectionDetails";
import {
  getCommonHeaderStyles,
  getTableCellStyles,
} from "../../../utils/tableStyle";
import { hasPermission } from "../../../utils/permissions";
import { formatDateTime } from "../../../utils/commonDateFormat";
import AmmoTargetLoader from "../../../layouts/loader/customeLoder";
import CustomAutocomplete from "../InprocessInspection/CustomAutocomplete";
import DateFilter from "../../Dashboard/DateFilter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchAutocomplete from "../FilterSection/SearchAutocomplete";
import {
  GET_ITEM_CODE_LIST,
  GET_RM_IO_LIST,
  GET_RM_ITEMCODE_LIST,
  GET_RM_SECTION_LIST,
  GET_SECTION_LIST,
  IN_PROCESS_INSPECTION_LIST_FOR_VIEW,
  RM_GETDATA_EXPORT_DATA,
} from "../../../utils/endpoints";
import { apiDateRangeMap } from "../../Dashboard/config";
import dayjs from "dayjs";
import CustomPagination from "../common/CustomPagination";
import ExportDropdown from "../../../common/commonComponent/exportComponent/ExportDropdown";

const tebleCellStyle = {
  maxWidth: { xs: 120, sm: 150, md: 200 }, // Responsive max-widths
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  padding: "8px",
  textAlign: "center",
  verticalAlign: "middle",
  border: "1px solid #e0e0e0", // clean subtle border
  // display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.9 rem", // responsive font size
};
const RmInspectionDetails = () => {
  const [isUpdated, setIsUpdated] = useState(false);

  const [loading, setLoading] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [editId, setEditId] = useState(null);
  const [rmInspectionData, setRmInspectionData] = useState([]);
  const [operationListById, setOperationListById] = useState({});
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [sectionOrMisNo, setSectionOrMisNo] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({
    dateRange: "",
    fromDate: null,
    toDate: null,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10); // ✅ define pageSize
  const [totalRecords, setTotalRecords] = useState(0); // ✅ define totalRecords

  // const [rmInspectionData, setRmInspectionData] = useState([]);

  const navigate = useNavigate();
  const [optionsName, setOptionsName] = useState([]);
  const [optionsIo, setOptionsIo] = useState([]);
  const [optionsItem, setOptionsItem] = useState([]);
  const [loader, setLoader] = useState(false);
  const handleViewClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
    setLoader(true);
  };

  const handleClose = () => {
    setSelectedRow(null);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let data = {
  //         io_no: sectionOrMisNo?.io_number,
  //         section: selectedSection?.id,
  //         item_code: itemCode?.item_code,
  //         date_range: apiDateRangeMap[formData.dateRange] || null,
  //         page, // current page
  //         page_size: 10, // you can make this dynamic if needed
  //       };

  //       // ✅ Only add start & end date if custom is selected
  //       if (formData.dateRange === "custom") {
  //         data.start_date = dayjs(formData.fromDate).format("YYYY-MM-DD");
  //         data.end_date = dayjs(formData.toDate).format("YYYY-MM-DD");
  //       }

  //       const res = await dispatch(rmProcessGetData(data)).unwrap();
  //       setRmInspectionData(res?.data || []);
  //     } catch (error) {
  //       setRmInspectionData([]);
  //       console.error("Failed to fetch inspection data:", error);
  //     }
  //   };

  //   // ✅ Condition for API call
  //   if (formData.dateRange === "custom") {
  //     if (formData.fromDate && formData.toDate) {
  //       fetchData(); // run only when both dates selected
  //     }
  //   } else {
  //     fetchData(); // run directly for non-custom ranges
  //   }
  // }, [sectionOrMisNo, selectedSection, itemCode, formData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ⏳ Start loader

        let data = {
          io_no: sectionOrMisNo?.io_number,
          section: selectedSection?.id,
          item_code: itemCode?.item_code,
          date_range: apiDateRangeMap[formData.dateRange] || null,
          page, // ✅ current page from state
          page_size: 10, // ✅ can make dynamic if needed
        };

        // ✅ Only add start & end date if custom is selected
        if (formData.dateRange === "custom") {
          data.start_date = dayjs(formData.fromDate).format("YYYY-MM-DD");
          data.end_date = dayjs(formData.toDate).format("YYYY-MM-DD");
        }

        const res = await dispatch(rmProcessGetData(data)).unwrap();

        setRmInspectionData(res?.data || []);
        setTotalRecords(res?.total || 0); // ✅ total records

        setTotalPages(res?.total_pages || 0); // ✅ update total pages from API
        setLoading(false);
      } catch (error) {
        setRmInspectionData([]);
        console.error("Failed to fetch inspection data:", error);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Condition for API call
    if (formData.dateRange === "custom") {
      if (formData.fromDate && formData.toDate) {
        fetchData(); // run only when both dates selected
      }
    } else {
      fetchData(); // run directly for non-custom ranges
    }
  }, [sectionOrMisNo, selectedSection, itemCode, formData, page]); // ✅ added page dependency

  useEffect(() => {
    if (operationListById?.io_no && operationListById?.item_code) {
      dispatch(rmGetDeatils({ data: operationListById }))
        .unwrap()
        .then((response) => {
          setData(response.data || []);
          setLoader(false);
        })
        .catch((error) => {
          console.error("Error fetching details:", error);
        })
        .finally(() => {
          setLoading(false); // ✅ Stop loader
        });
    }
  }, [operationListById]);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // keeps them apart
            mb: 1,
            mt: 2,
          }}
        >
          <Typography
            fontWeight="bold"
            variant="h4"
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: "1.2rem",
                lg: "1.3rem",
              },
              color: "#1a237e",
              mt: 1,
              mb: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/rminspectiondetails")}
          >
            RM Inspection Details
          </Typography>

          {/* {(selectedRow === null || !editId) && (
            <ExportDropdown
              FilterHeaderKey={
                selectedRow == null
                  ? []
                  : !editId
                  ? [
                      "id",
                      "inspection_parameter_name",
                      "LSL",
                      "USL",
                      "inspection_frequency",
                      "sample_size",
                      "remarks",
                      "actual_readings",
                    ]
                  : [
                      "id",
                      "io_no",
                      "mis_no",
                      "date_time",
                      "section_name",
                      "item_code",
                    ]
              }
              // fetchUrl={!editId ? RM_GETDATA_EXPORT_DATA : ""} // fetch only if editId is not set
              fileName="RM InspectionDetails Report"
              data={selectedRow == null ? [] : !editId ? data : []} // use passedData if editId exists
              fetchUrl={
                selectedRow==null   ? RM_GETDATA_EXPORT_DATA : ""
              } // use passedData if editId exists

              // setSelectedRow(null);
            />
          )} */}
        </Box>
        {selectedRow === null && (
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
                    datasearchId={"search-section_details"}
                    // const [options, ] = useState([]);
                  />
                </Grid>
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
                  datasearchId={"search-io_no_details"}
                  />
                </Grid>

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
                    optionLabelKey="item_code" // dropdown text
                    optionValueKey="item_code"
                    datasearchId={"search_item_code_details"}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}

        <Paper elevation={3} sx={{ p: 1, border: "1px solid #ccc" }}>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ border: "1px solid #ccc" }}>
              <TableHead>
                <TableRow>
                  {[
                    "I/O No.",
                    "MIS No.",
                    "Date & Time",
                    "Section Name",
                    // "User Name",
                    "Item Code",
                    "Action",
                  ].map((head, i) => {
                    const shouldCenter = [
                      "I/O No.",
                      "MIS No.",
                      "Date & Time",
                      "Section Name",
                      // "User Name",
                      "Item Code",
                      "Action",
                    ].includes(head);

                    return (
                      <TableCell
                        key={i}
                        align={shouldCenter ? "center" : "left"}
                        sx={{
                          ...getCommonHeaderStyles({ center: shouldCenter }),
                          border: "1px solid #ccc", // ✅ column borders
                        }}
                      >
                        {head}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        py={4}
                      >
                        <CircularProgress /> {/* MUI loader */}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : selectedRow === null ? (
                  rmInspectionData?.length > 0 ? (
                    rmInspectionData.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell
                          sx={{
                            ...getTableCellStyles({ center: false }),
                            border: "1px solid #e0e0e0",
                            alignItems: "center",
                            verticalAlign: "middle",

                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.io_no}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...getTableCellStyles({ center: false }),
                            border: "1px solid #e0e0e0",
                            alignItems: "center",
                            verticalAlign: "middle",

                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {renderCell(item.mis_no)}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...getTableCellStyles({ center: false }),
                            border: "1px solid #e0e0e0",
                            alignItems: "center",
                            verticalAlign: "middle",

                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {/* {commonDateFormat(item.date_time)} */}
                          {/* {item.date_time} */}
                          {formatDateTime(item.date_time)}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...getTableCellStyles({ center: false }),
                            border: "1px solid #e0e0e0",
                            alignItems: "center",
                            verticalAlign: "middle",

                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.section_name}
                        </TableCell>
                        {/* <TableCell
                          sx={{
                            ...getTableCellStyles({ center: false }),
                            border: "1px solid #e0e0e0",
                            alignItems: "center",
                            verticalAlign: "middle",

                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.user_name || "N/A"}
                        </TableCell> */}
                        <TableCell
                          sx={{
                            ...getTableCellStyles({ center: false }),
                            border: "1px solid #e0e0e0",
                            alignItems: "center",
                            verticalAlign: "middle",

                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.item_code}
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            verticalAlign: "middle", // Vertical centering in table cell
                          }}
                        >
                          <Box
                            display="flex"
                            justifyContent="center" // Horizontal center
                            alignItems="center" // Vertical center inside box
                            gap={1}
                          >
                            <IconButton
                              onClick={() => {
                                setEditId("");
                                handleViewClick(index);
                                setOperationListById({
                                  io_no: item.io_no,
                                  item_code: item.item_code,
                                });
                              }}
                              size="small"
                              sx={{
                                bgcolor: "#e3f2fd",
                                "&:hover": { bgcolor: "#bbdefb" },
                                borderRadius: 1,
                              }}
                            >
                              <VisibilityIcon
                                color="primary"
                                fontSize="small"
                              />
                            </IconButton>
                            {hasPermission("rmInspectionDetails", "edit") && (
                              <IconButton
                                onClick={() => {
                                  setEditId(item.io_no);
                                  handleViewClick(index);
                                  setOperationListById({
                                    io_no: item.io_no,
                                    item_code: item.item_code,
                                  });
                                }}
                                size="small"
                                sx={{
                                  bgcolor: "#f3e5f5",
                                  "&:hover": { bgcolor: "#e1bee7" },
                                  borderRadius: 1,
                                }}
                              >
                                <EditIcon color="primary" fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box display="flex" justifyContent="center" py={4}>
                          <NoDataFound />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  (() => {
                    const item = rmInspectionData[selectedRow];
                    if (!item) return null;

                    return (
                      <React.Fragment key={selectedRow}>
                        <TableRow
                          sx={{
                            backgroundColor: "#e3f2fd",
                            border: "1px solid #ccc",
                            "& td": { textAlign: "center" }, // 🔥 makes all TableCell text center
                          }}
                        >
                          <TableCell
                            sx={{
                              backgroundColor: "#e3f2fd",
                              border: "1px solid #ccc",
                            }}
                          >
                            {item.io_no}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              backgroundColor: "#e3f2fd",
                              border: "1px solid #ccc",
                            }}
                          >
                            {item.mis_no}
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: "#e3f2fd",
                              border: "1px solid #ccc",
                            }}
                          >
                            {item.date_time}
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: "#e3f2fd",
                              border: "1px solid #ccc",
                            }}
                          >
                            {item.section_name}
                          </TableCell>
                          {/* <TableCell>{item.user_name || "N/A"}</TableCell> */}
                          <TableCell
                            sx={{
                              backgroundColor: "#e3f2fd",
                              border: "1px solid #ccc",
                            }}
                          >
                            {item.item_code}
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: "#e3f2fd",
                              border: "1px solid #ccc",
                            }}
                          >
                            <Button
                              onClick={handleClose}
                              startIcon={<VisibilityIcon />}
                              color="primary"
                              variant="outlined"
                              size="small"
                            >
                              Back to List
                            </Button>
                          </TableCell>
                        </TableRow>

                        {loader ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ width: "100%", py: 4, height: "300px" }}
                              >
                                {/* <AmmoTargetLoader /> */}
                                <CircularProgress size={30} />
                                {/* Box */}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow style={{ padding: 0, margin: 0 }}>
                            <TableCell colSpan={7} sx={{ p: 0, m: 0 }}>
                              <ParameterWiseTable
                                keyName="RM"
                                LayoutKey={
                                  Array.isArray(data) && data.length > 0
                                    ? data[0]?.input_type || "parameter"
                                    : "parameter"
                                }
                                setActiveView={setSelectedRow}
                                operationList={data}
                                isView={!editId}
                                isEdit={editId}
                                isdata={true}
                                setIsUpdated={setIsUpdated} // now it's valid
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })()
                )}
              </TableBody>
            </Table>
            {selectedRow === null && (
              <CustomPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1); // reset to first page when page size changes
                }}
              />
            )}
          </TableContainer>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default RmInspectionDetails;
